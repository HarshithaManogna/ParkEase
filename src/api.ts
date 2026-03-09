import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-parkease';

// Middleware to authenticate
const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// --- Auth Routes ---
router.post('/auth/register', (req, res) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(name, email, phone, hashedPassword, role);
    
    const token = jwt.sign({ id: info.lastInsertRowid, role }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(201).json({ message: 'User created', user: { id: info.lastInsertRowid, name, email, role } });
  } catch (err: any) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
  res.json({ message: 'Logged in', user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone } });
});

router.post('/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

router.get('/auth/me', authenticate, (req: any, res) => {
  const user = db.prepare('SELECT id, name, email, phone, role FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

// --- Parking Spaces Routes ---
router.get('/parkings', (req, res) => {
  const parkings = db.prepare(`
    SELECT p.*, u.name as owner_name, u.phone as owner_phone 
    FROM parking_spaces p 
    JOIN users u ON p.owner_id = u.id
  `).all() as any[];
  
  // Parse JSON strings
  const formatted = parkings.map(p => ({
    ...p,
    facilities: JSON.parse(p.facilities || '[]'),
    images: JSON.parse(p.images || '[]')
  }));
  res.json(formatted);
});

router.get('/parkings/:id', (req, res) => {
  const parking = db.prepare(`
    SELECT p.*, u.name as owner_name, u.phone as owner_phone 
    FROM parking_spaces p 
    JOIN users u ON p.owner_id = u.id 
    WHERE p.id = ?
  `).get(req.params.id) as any;
  
  if (!parking) return res.status(404).json({ error: 'Not found' });
  
  parking.facilities = JSON.parse(parking.facilities || '[]');
  parking.images = JSON.parse(parking.images || '[]');
  res.json(parking);
});

router.post('/parkings', authenticate, (req: any, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Only owners can add parking' });
  
  const { title, location, lat, lng, price_hourly, price_daily, price_monthly, facilities, images } = req.body;
  
  const stmt = db.prepare(`
    INSERT INTO parking_spaces (title, owner_id, location, lat, lng, price_hourly, price_daily, price_monthly, facilities, images)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const info = stmt.run(
    title, req.user.id, location, lat || 0, lng || 0, 
    price_hourly, price_daily, price_monthly, 
    JSON.stringify(facilities || []), JSON.stringify(images || [])
  );
  
  res.status(201).json({ id: info.lastInsertRowid });
});

router.get('/my-parkings', authenticate, (req: any, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Unauthorized' });
  
  const parkings = db.prepare('SELECT * FROM parking_spaces WHERE owner_id = ?').all(req.user.id) as any[];
  const formatted = parkings.map(p => ({
    ...p,
    facilities: JSON.parse(p.facilities || '[]'),
    images: JSON.parse(p.images || '[]')
  }));
  res.json(formatted);
});

// --- Bookings Routes ---
router.post('/bookings', authenticate, (req: any, res) => {
  const { parking_id, owner_id, date, time_duration, vehicle_type, vehicle_number } = req.body;
  
  const stmt = db.prepare(`
    INSERT INTO bookings (parking_id, user_id, owner_id, date, time_duration, vehicle_type, vehicle_number)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const info = stmt.run(parking_id, req.user.id, owner_id, date, time_duration, vehicle_type, vehicle_number);
  res.status(201).json({ id: info.lastInsertRowid });
});

router.get('/my-bookings', authenticate, (req: any, res) => {
  const isOwner = req.user.role === 'owner';
  const query = isOwner 
    ? `SELECT b.*, p.title as parking_title, u.name as user_name, u.phone as user_phone 
       FROM bookings b 
       JOIN parking_spaces p ON b.parking_id = p.id 
       JOIN users u ON b.user_id = u.id 
       WHERE b.owner_id = ? ORDER BY b.created_at DESC`
    : `SELECT b.*, p.title as parking_title, p.location, u.name as owner_name, u.phone as owner_phone 
       FROM bookings b 
       JOIN parking_spaces p ON b.parking_id = p.id 
       JOIN users u ON b.owner_id = u.id 
       WHERE b.user_id = ? ORDER BY b.created_at DESC`;
       
  const bookings = db.prepare(query).all(req.user.id);
  res.json(bookings);
});

router.patch('/bookings/:id/status', authenticate, (req: any, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ error: 'Unauthorized' });
  
  const { status } = req.body;
  if (!['Accepted', 'Rejected', 'Completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  const stmt = db.prepare('UPDATE bookings SET status = ? WHERE id = ? AND owner_id = ?');
  const info = stmt.run(status, req.params.id, req.user.id);
  
  if (info.changes === 0) return res.status(404).json({ error: 'Booking not found or unauthorized' });
  res.json({ message: 'Status updated' });
});

export default router;

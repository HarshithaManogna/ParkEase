import db from './src/db.js';
import bcrypt from 'bcryptjs';

const seedDatabase = () => {
  console.log('Seeding database...');
  
  // Clear existing data
  db.exec('DELETE FROM bookings');
  db.exec('DELETE FROM parking_spaces');
  db.exec('DELETE FROM users');
  
  // Create users
  const password = bcrypt.hashSync('password123', 10);
  
  const insertUser = db.prepare('INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)');
  
  const owner1 = insertUser.run('Ravi Kumar', 'ravi@example.com', '9876543210', password, 'owner').lastInsertRowid;
  const owner2 = insertUser.run('Sameer Khan', 'sameer@example.com', '9876543211', password, 'owner').lastInsertRowid;
  const owner3 = insertUser.run('Priya Sharma', 'priya@example.com', '9876543212', password, 'owner').lastInsertRowid;
  const driver1 = insertUser.run('Rahul Verma', 'rahul@example.com', '9876543213', password, 'driver').lastInsertRowid;

  // Create parking spaces
  const insertParking = db.prepare(`
    INSERT INTO parking_spaces (title, owner_id, location, lat, lng, price_hourly, price_daily, price_monthly, facilities, images, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const demoParkings = [
    {
      title: 'Green Plaza Parking',
      owner_id: owner1,
      location: 'Banjara Hills, Hyderabad',
      lat: 17.4156, lng: 78.4347,
      price_hourly: 25, price_daily: 150, price_monthly: 3000,
      facilities: ['Covered parking', 'CCTV', 'Security guard'],
      images: ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800'],
      rating: 4.7
    },
    {
      title: 'Metro Mall Basement Parking',
      owner_id: owner2,
      location: 'Andheri, Mumbai',
      lat: 19.1136, lng: 72.8697,
      price_hourly: 30, price_daily: 200, price_monthly: 4000,
      facilities: ['Covered parking', 'CCTV', 'EV charging'],
      images: ['https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=800'],
      rating: 4.5
    },
    {
      title: 'IT Park Secure Parking',
      owner_id: owner3,
      location: 'Whitefield, Bangalore',
      lat: 12.9698, lng: 77.7499,
      price_hourly: 40, price_daily: 250, price_monthly: 5000,
      facilities: ['Covered parking', 'Security guard', 'Gated property'],
      images: ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=800'],
      rating: 4.8
    },
    {
      title: 'City Center Parking',
      owner_id: owner1,
      location: 'Connaught Place, Delhi',
      lat: 28.6304, lng: 77.2177,
      price_hourly: 50, price_daily: 300, price_monthly: 6000,
      facilities: ['CCTV', 'Security guard'],
      images: ['https://images.unsplash.com/photo-1604063155778-002131221b65?auto=format&fit=crop&q=80&w=800'],
      rating: 4.2
    },
    {
      title: 'Residential Covered Parking',
      owner_id: owner2,
      location: 'Wakad, Pune',
      lat: 18.5987, lng: 73.7688,
      price_hourly: 15, price_daily: 100, price_monthly: 2000,
      facilities: ['Covered parking', 'Gated property'],
      images: ['https://images.unsplash.com/photo-1549834125-82d3c48159a3?auto=format&fit=crop&q=80&w=800'],
      rating: 4.9
    },
    {
      title: 'Airport Proximity Parking',
      owner_id: owner3,
      location: 'Shamshabad, Hyderabad',
      lat: 17.2403, lng: 78.4294,
      price_hourly: 60, price_daily: 400, price_monthly: 8000,
      facilities: ['Covered parking', 'CCTV', 'Security guard', 'EV charging'],
      images: ['https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=800'],
      rating: 4.6
    },
    {
      title: 'Downtown Open Space',
      owner_id: owner1,
      location: 'MG Road, Bangalore',
      lat: 12.9716, lng: 77.5946,
      price_hourly: 35, price_daily: 200, price_monthly: 4500,
      facilities: ['Security guard'],
      images: ['https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=800'],
      rating: 4.1
    },
    {
      title: 'Tech Hub Parking',
      owner_id: owner2,
      location: 'Hitec City, Hyderabad',
      lat: 17.4435, lng: 78.3772,
      price_hourly: 45, price_daily: 250, price_monthly: 5500,
      facilities: ['Covered parking', 'CCTV', 'Gated property'],
      images: ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=800'],
      rating: 4.8
    },
    {
      title: 'Beachside Safe Parking',
      owner_id: owner3,
      location: 'Juhu, Mumbai',
      lat: 19.1075, lng: 72.8263,
      price_hourly: 55, price_daily: 350, price_monthly: 7000,
      facilities: ['CCTV', 'Security guard'],
      images: ['https://images.unsplash.com/photo-1604063155778-002131221b65?auto=format&fit=crop&q=80&w=800'],
      rating: 4.4
    },
    {
      title: 'Suburban Garage',
      owner_id: owner1,
      location: 'Kothrud, Pune',
      lat: 18.5074, lng: 73.8077,
      price_hourly: 20, price_daily: 120, price_monthly: 2500,
      facilities: ['Covered parking', 'Gated property'],
      images: ['https://images.unsplash.com/photo-1549834125-82d3c48159a3?auto=format&fit=crop&q=80&w=800'],
      rating: 4.7
    }
  ];

  for (const p of demoParkings) {
    insertParking.run(
      p.title, p.owner_id, p.location, p.lat, p.lng,
      p.price_hourly, p.price_daily, p.price_monthly,
      JSON.stringify(p.facilities), JSON.stringify(p.images), p.rating
    );
  }

  console.log('Database seeded successfully!');
};

seedDatabase();

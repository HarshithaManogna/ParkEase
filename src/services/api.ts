const initialUsers = [
  { id: 1, name: 'Ravi Owner', email: 'ravi@example.com', phone: '9876543210', role: 'owner', password: 'password123' },
  { id: 2, name: 'Rahul Driver', email: 'rahul@example.com', phone: '9876543211', role: 'driver', password: 'password123' }
];

const initialParkings = [
  {
    id: 1,
    owner_id: 1,
    owner_name: 'Ravi Owner',
    owner_phone: '9876543210',
    title: 'Premium IT Park Spot',
    location: 'Whitefield, Bangalore',
    price_hourly: 40,
    price_daily: 200,
    price_monthly: 4000,
    facilities: ['Covered parking', 'CCTV', '24/7 Access'],
    images: ['https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1000'],
    rating: 4.8
  },
  {
    id: 2,
    owner_id: 1,
    owner_name: 'Ravi Owner',
    owner_phone: '9876543210',
    title: 'Secure Basement Parking',
    location: 'Andheri West, Mumbai',
    price_hourly: 50,
    price_daily: 250,
    price_monthly: 5000,
    facilities: ['CCTV', 'Security guard', 'Gated property'],
    images: ['https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&q=80&w=1000'],
    rating: 4.5
  },
  {
    id: 3,
    owner_id: 1,
    owner_name: 'Ravi Owner',
    owner_phone: '9876543210',
    title: 'Open Driveway Space',
    location: 'Koramangala, Bangalore',
    price_hourly: 30,
    price_daily: 150,
    price_monthly: 3000,
    facilities: ['24/7 Access'],
    images: ['https://images.unsplash.com/photo-1604063155778-002131221b65?auto=format&fit=crop&q=80&w=1000'],
    rating: 4.2
  }
];

const initialBookings = [
  {
    id: 1,
    parking_id: 1,
    parking_title: 'Premium IT Park Spot',
    owner_id: 1,
    owner_name: 'Ravi Owner',
    owner_phone: '9876543210',
    user_id: 2,
    user_name: 'Rahul Driver',
    user_phone: '9876543211',
    date: '2026-04-01',
    time_duration: '4 hours',
    vehicle_type: 'Car',
    vehicle_number: 'KA 01 AB 1234',
    status: 'Pending'
  }
];

const getDb = () => {
  const db = localStorage.getItem('parkease_db');
  if (db) return JSON.parse(db);
  const initialDb = { users: initialUsers, parkings: initialParkings, bookings: initialBookings };
  localStorage.setItem('parkease_db', JSON.stringify(initialDb));
  return initialDb;
};

const saveDb = (db: any) => localStorage.setItem('parkease_db', JSON.stringify(db));

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    await delay(500);
    const db = getDb();
    const user = db.users.find((u: any) => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    const { password: _, ...userWithoutPass } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPass));
    return { user: userWithoutPass };
  },
  register: async (userData: any) => {
    await delay(500);
    const db = getDb();
    if (db.users.find((u: any) => u.email === userData.email)) throw new Error('Email already exists');
    const newUser = { id: Date.now(), ...userData };
    db.users.push(newUser);
    saveDb(db);
    const { password: _, ...userWithoutPass } = newUser;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPass));
    return { user: userWithoutPass };
  },
  logout: async () => {
    await delay(200);
    localStorage.removeItem('currentUser');
  },
  getCurrentUser: async () => {
    await delay(200);
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  // Parkings
  getParkings: async () => {
    await delay(300);
    return getDb().parkings;
  },
  getParkingById: async (id: string | number) => {
    await delay(300);
    const parking = getDb().parkings.find((p: any) => p.id === Number(id));
    if (!parking) throw new Error('Not found');
    return parking;
  },
  createParking: async (parkingData: any) => {
    await delay(500);
    const db = getDb();
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const newParking = {
      id: Date.now(),
      owner_id: user.id,
      owner_name: user.name,
      owner_phone: user.phone,
      rating: 5.0,
      ...parkingData
    };
    db.parkings.push(newParking);
    saveDb(db);
    return newParking;
  },
  getMyParkings: async () => {
    await delay(300);
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return getDb().parkings.filter((p: any) => p.owner_id === user.id);
  },

  // Bookings
  createBooking: async (bookingData: any) => {
    await delay(500);
    const db = getDb();
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const parking = db.parkings.find((p: any) => p.id === bookingData.parking_id);
    const newBooking = {
      id: Date.now(),
      user_id: user.id,
      user_name: user.name,
      user_phone: user.phone,
      parking_title: parking.title,
      owner_name: parking.owner_name,
      owner_phone: parking.owner_phone,
      status: 'Pending',
      ...bookingData
    };
    db.bookings.push(newBooking);
    saveDb(db);
    return newBooking;
  },
  getMyBookings: async () => {
    await delay(300);
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const db = getDb();
    if (user.role === 'owner') {
      return db.bookings.filter((b: any) => b.owner_id === user.id);
    } else {
      return db.bookings.filter((b: any) => b.user_id === user.id);
    }
  },
  updateBookingStatus: async (id: number, status: string) => {
    await delay(300);
    const db = getDb();
    const booking = db.bookings.find((b: any) => b.id === id);
    if (booking) {
      booking.status = status;
      saveDb(db);
    }
    return booking;
  }
};

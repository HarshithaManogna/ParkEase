# ParkEase 🚗

A modern, premium marketplace for private parking spaces. Find secure spots instantly or monetize your unused driveway. Built with a sleek, industry-standard UI inspired by top-tier SaaS and marketplace platforms.

![ParkEase Preview](https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1000) *(Representative Image)*

## ✨ Features

*   **Role-Based System:** Two distinct user flows for **Drivers** (booking spaces) and **Owners** (listing spaces).
*   **Premium UI/UX:** High-contrast, minimalist design using Tailwind CSS, Space Grotesk typography, and smooth Framer Motion animations.
*   **Smart Search:** Find parking spaces by location with a clean list and map-style interface.
*   **Seamless Booking:** Select dates, duration, and vehicle details to reserve a spot.
*   **WhatsApp Integration:** Instantly connects drivers and owners via WhatsApp upon booking confirmation.
*   **Owner Dashboard:** Manage active listings and approve/reject incoming booking requests.
*   **Local Persistence:** Uses a mock API with `localStorage` to persist data across reloads without needing a backend database.

## 🛠️ Tech Stack

*   **Framework:** React 19
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS v4
*   **Icons:** Lucide React
*   **Animations:** Motion (Framer Motion)
*   **Routing:** React Router DOM v7
*   **Data Storage:** Mock API via `localStorage` (Vercel-ready SPA)

## 🔐 Demo Data & Test Accounts

The application comes pre-seeded with demo data so you can test it immediately. 

**Owner Account (To manage listings and approve bookings):**
*   **Email:** `ravi@example.com`
*   **Password:** `password123`

**Driver Account (To search and book spaces):**
*   **Email:** `rahul@example.com`
*   **Password:** `password123`

*Note: You can also create a brand new account using the Sign Up page. All new data is saved to your browser's local storage.*

## 🚀 Getting Started (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/parkease.git
   cd parkease
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` (or the port provided in your terminal).

## ☁️ Deployment (Vercel)

This project is configured as a pure Single Page Application (SPA) with local storage persistence, making it 100% ready for Vercel deployment with zero backend configuration.

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Use the following settings:
   *   **Framework Preset:** Vite
   *   **Root Directory:** `./`
   *   **Build Command:** `npm run build`
   *   **Output Directory:** `dist`
5. Click **Deploy**.

## 📂 Project Structure

```text
├── src/
│   ├── components/      # Reusable UI components (Navbar, etc.)
│   ├── context/         # React Context (AuthContext)
│   ├── pages/           # Route components (Home, Search, Dashboard, etc.)
│   ├── services/        # Mock API service (api.ts) handling localStorage
│   ├── App.tsx          # Main application router
│   ├── index.css        # Global styles and Tailwind configuration
│   └── main.tsx         # React entry point
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
└── README.md            # Project documentation
```

## 📄 License

This project is open-source and available under the MIT License.

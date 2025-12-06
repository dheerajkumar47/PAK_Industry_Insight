# PAK Industry Insight 🚀

An investor-grade market intelligence platform designed to track Pakistan's corporate sector, analyze trends, and aggregate real-time news.

## 🌟 Key Features

### 1. **Industry Explorer** (Investor Grade)
- View companies by sector (e.g., Cement, Banking, Technology).
- Drill down into specific company profiles.
- **Data Points**: CEO, Stock Symbol, Net Profit, Market Cap, and more.

### 2. **Real-Time News Engine**
- **Live Aggregation**: Automatically scrapes and displays news from *TechJuice* and *ProPakistani*.
- **Smart Filtering**: Categorizes news by industry relevance.

### 3. **Interactive Dashboard**
- **Search**: Global search for any company or sector.
- **Market Trends**: Visual insights into top performing sectors.

### 4. **User Profile & Settings** (New!)
- **Premium UI**: Clean, modern profile design.
- **Google Integration**: Seamlessly syncs Google Profile Picture and Name.
- **Smart Avatars**: Auto-generates initial avatars for email users.
- **Notifications**: Manage Email and Push notification preferences.
- **Security**: Secure session handling and password protection.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons.
- **Backend**: FastAPI (Python), MongoDB Atlas.
- **Authentication**: JWT & OAuth2 (Google).
- **Deployment**: Ready for standard web servers.

## 🚀 Quick Start

### Backend
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📅 Recent Updates (Phase 5 Complete)
- **Profile Redesign**: Complete overhaul of the user profile for a "Market Standard" look.
- **Auth Polish**: Fixed login loops and synced Google user data.
- **Settings**: Fully functional notification toggles.

---
*Built with ❤️ by the PAK Insight Team*
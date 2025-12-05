# PAK Industry Insight 🏭

A central platform to explore real-time and historical data about industries and companies across Pakistan. This project aims to aggregate data from various sources (News, YouTube, Reports) to provide actionable insights.

## 🚀 Project Status

We are currently in **Phase 3 (Frontend Setup & Integration)**.

### ✅ Completed Phases
**Phase 1: Planning & Setup**
- [x] Defined core features & tech stack (React, FastAPI, MongoDB).
- [x] Set up GitHub repository & folder structure.

**Phase 2: Backend Foundation**
- [x] **API**: Initialized FastAPI with JWT Authentication.
- [x] **Database**: Connected MongoDB Atlas.
- [x] **Models**: Created User, Company, and Industry models.
- [x] **Data Scripting**: Implemented `seed_data.py` to populate the database with initial industry/company data.
- [x] **Security**: Implemented password hashing (bcrypt) and strength validation.

**Phase 3: Frontend Setup**
- [x] **UI/UX**: Built Landing Page, Dashboard, Industry Explorer, and Company Details.
- [x] **Integration**: Connected Frontend to Backend APIs (Auth, Companies, Industries).
- [x] **Search**: Implemented real-time company search in the Navbar.
- [x] **Dynamic Data**: Replaced hardcoded content with data fetched from MongoDB.

### 🚧 In Progress / Next Steps
- [ ] **Phase 4: Data Aggregation**: Integrate NewsAPI and YouTube API for real-time insights.
- [ ] **Forgot Password**: Implement secure password reset flow.
- [ ] **Deployment**: Prepare for production deployment.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Lucide Icons, Axios.
- **Backend**: FastAPI, Python, PyMongo, Pydantic, Passlib (bcrypt), Python-JOSE (JWT).
- **Database**: MongoDB Atlas.

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd PAK_Industry_Insight
```

### 2. Backend Setup
```bash
cd backend
# Create virtual environment
python -m venv venv
# Activate (Windows)
venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
# Run Seed Script (Optional - to populate DB)
python seed_data.py
# Run Server
uvicorn app.main:app --reload
```
*Server runs at `http://localhost:8000`*

### 3. Frontend Setup
```bash
cd frontend
# Install dependencies
npm install
# Run Development Server
npm run dev
```
*App runs at `http://localhost:3000`*

---

## 📝 Latest Updates
- **Sector View**: Industry Explorer now groups companies by sector.
- **Search**: Global search bar added to navigation.
- **Security**: Enhanced password validation rules.
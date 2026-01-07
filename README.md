# PAK Industry Insight 🚀
> **The Investor-Grade Intelligence Platform for Pakistan's Corporate Sector.**

[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 📖 Project Overview

**PAK Industry Insight** is a modern financial technology platform built to bridge the data gap in Pakistan's diverse industrial landscape. It aggregates, enriches, and visualizes real-time market data to provide investors, analysts, and enthusiasts with a crystal-clear view of the corporate sector.

Unlike generic stock trackers, this platform combines **Live Market Data** (yfinance) with a curated **Static Enrichment Layer** to ensure that data often missing for Pakistani companies (CEO names, audited net profits, founding history) is always available.

---

## 🗺️ Project Evolution (Phases)

We have built this platform through five rigorous development phases:

### Phase 1: Foundation & Architecture 🏗️
*   Established the **FastAPI** backend and **MongoDB** schema.
*   Integrated `yfinance` to validate data fetching feasibility for PSX (Pakistan Stock Exchange).
*   Set up the **React + Vite** frontend with a robust folder structure.

### Phase 2: Core Data Engine ⚙️
*   Built the **Hybrid Data Engine**: A smart service that merges live API data with a fallback static dictionary.
*   Implemented **Database Seeding**: Admin endpoints to populate the database with top 15+ companies (Systems Ltd, Engro, HBL, etc.).
*   **API Development**: Created RESTful endpoints for companies, industries, and market trends.

### Phase 3: User Interface & Experience 🎨
*   Designed the **Dashboard**: A command center with search and trend visualizations.
*   **Industry Explorer**: A powerful filtering interface to browse by sector (Cement, Banking, Tech).
*   **Company Detail Pages**: The heart of the app, featuring:
    *   *Key Metrics Cards* (Revenue, Market Cap).
    *   *Leadership Info* (CEO, Headquarters).
    *   *News Aggregation* (Simulated feed from local business sources).

### Phase 4: Authentication & Security 🔐
*   Implemented **JWT Architecture**: Secure, stateless authentication.
*   **Google OAuth**: Seamless generic login integration.
*   **Session Control**: Added "Remember Me" functionality (Local vs Session Storage persistence).
*   **Profile System**: Secure password reset, profile picture syncing, and user preferences.

### Phase 5: Polish & "Investor Grade" Refinement ✨
*   **Video Splash Screen**: Professional cinematic intro.
*   **Context-Aware Navigation**: Smart "Back" buttons that respect user journey.
*   **Dark Mode**: System-wide dark theme support.
*   **Data Completeness**: Enriched 100% of tracked companies with missing CEO/Profit data.

### Phase 6: Live Market Trends & Polish 📊
*   **Live Market Data Engine**: Full integration with `yfinance` to fetch Price, Volume, and Change% for 113+ companies.
*   **Interactive Market Heatmap**: Professional TradingView-style heatmap visualizing the entire PSX (Green/Red blocks).
*   **Smart Search & Filtering**: Advanced search by Ticker/Name and instant sector filtering (Cement, Tech, etc.).
*   **Performance Optimization**: Fixed `307 Temporary Redirect` loop for faster API responses.
*   **Security Patches**: Stability fixes for Authentication (`401` errors handled) and secure Token generation.
*   **Data Source Documentation**: Comprehensive `DATA_SOURCES.md` for transparency and verification.


---

## 🌟 Key Features

### 🔍 For Analysts
*   **Real-Time Market Data**: Live stock prices, volume, and market cap tracking.
*   **Sector Performance**: Aggregated sector-wise performance metrics and rankings.
*   **Currency Monitoring**: USD/PKR exchange rate with change indicators.
*   **Sector Analysis**: Compare companies within the same industry.
*   **Financial Deep Dives**: Revenue, Net Profit, and Growth Tags.

### 👤 For Users
*   **Personalized Profile**: Manage your identity and security.
*   **Custom Dashboard**: Save reports and track favorite industries.
*   **Responsive Design**: Works perfectly on Mobile, Tablet, and Desktop.

---

## 🛠️ Installation & Setup Guide

Designed for developers who want to run the full stack locally.

### Prerequisites
*   **Python 3.9+**
*   **Node.js 16+** (Latest LTS recommended)
*   **MongoDB** (Local instance or Atlas Connection String)

### Step 1: Backend Setup (Python)

1.  **Navigate to the backend directory and create a virtual environment**:
    ```bash
    cd backend
    python -m venv venv
    ```

2.  **Activate the environment**:
    *   **Windows**: `.\venv\Scripts\activate`
    *   **Mac/Linux**: `source venv/bin/activate`

3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Server**:
    ```bash
    uvicorn app.main:app --reload
    ```
    *The API will be live at `http://localhost:8000`*

### Step 2: Frontend Setup (React)

1.  **Navigate to the frontend directory** (in a new terminal):
    ```bash
    cd frontend
    ```

2.  **Install Node Modules**:
    ```bash
    npm install
    ```

3.  **Start the Development Server**:
    ```bash
    npm run dev
    ```
    *The App will be live at `http://localhost:5173`*

### Step 3: Populate Data (Crucial)

To see the app in action, you need data. Run this command in PowerShell while the backend is running:

```powershell
Invoke-RestMethod -Uri "http://localhost:8000/companies/admin/seed" -Method Post
```

This will fetch live data for companies like **SYS.KA, ENGRO.KA, HBL.KA** and populate your local database.

---

## 📚 Documentation

For detailed information about our data sources, verification methods, and company coverage, see:
*   **[DATA_SOURCES.md](DATA_SOURCES.md)**: Complete documentation of Yahoo Finance integration, sector classifications, and data verification process.

---

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a Pull Request.

---
*Built with ❤️ by Dheeraj Kumar and Maaz Siddiqui.*

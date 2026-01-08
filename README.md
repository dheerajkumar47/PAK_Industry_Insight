# PAK Industry Insight 🚀
> **The Investor-Grade Intelligence Platform for Pakistan's Corporate Sector.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://pak-industry-insight.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Active-009688?style=for-the-badge&logo=render)](https://pak-industry-insight.onrender.com/docs)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

---

## 🌟 Mission
**PAK Industry Insight** bridges the gap in Pakistan's financial ecosystem. While generic tickers provide only prices, we provide **intelligence**. By combining real-time market streams with a rich, curated database of company fundamentals (CEOs, History, Audited financials), we give investors the complete picture they need to make smarter decisions.

---

## ⚡ Key Features

### 📊 Live Market Dashboard
*   **Real-Time Tracking**: Instant updates on Price, Volume, and Change% for 113+ top PSX companies.
*   **Sector Heatmaps**: Visualize the entire market's performance at a glance (Red/Green indicators).
*   **Currency Monitor**: Live USD/PKR exchange rate tracking.

### 🤖 AI-Powered Intelligence
*   **Market Pulse**: Daily AI-generated summaries that interpret complex market movements into clear, actionable insights (Powered by **Google Gemini 1.5**).
*   **Instant SWOT Analysis**: Automated Strength, Weakness, Opportunity, and Threat reports for every single listed company.

### 💼 Investor Tools
*   **Watchlists**: "Star" your favorite stocks to track them in a dedicated widgets.
*   **Smart Filtering**: Drill down by Sector (Cement, Textiles, Banks) or search by Ticker.
*   **Dark Mode**: A fully responsive, battery-friendly dark interface for night-time analysis.

---

## 🛠️ Tech Stack

Built with a modern, high-performance architecture:

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | Fast, responsive SPA with Tailwind CSS. |
| **Backend** | ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi) ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) | High-performance Async IO API. |
| **Database** | ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white) | Flexible NoSQL schema for complex company data. |
| **AI Engine** | ![Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=flat&logo=googlebard&logoColor=white) | Generative AI for financial analysis. |
| **Auth** | ![Google](https://img.shields.io/badge/OAuth-4285F4?style=flat&logo=google&logoColor=white) + JWT | Secure stateless authentication. |

---

## 🚀 Quick Start (Local Development)

Want to run this on your machine?

```bash
# 1. Clone the repository
git clone https://github.com/dheerajkumar47/PAK_Industry_Insight.git

# 2. Setup Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# 3. Setup Frontend
cd frontend
npm install
npm run dev
```

---

## 🤝 Contact & Credits

**Built with ❤️ for Pakistan's Investor Community.**
*   **Dheeraj Kumar** - *Lead Developer*
*   **Maaz Siddiqui** - *Project Owner*

For data source verification, please read our [Data Methodology](DATA_SOURCES.md).

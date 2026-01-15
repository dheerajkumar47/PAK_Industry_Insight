# PAK Industry Insight - Project Documentation

## 1. Project Concept 💡

### What is this project?
**PAK Industry Insight** is a real-time financial intelligence platform designed specifically for the **Pakistan Stock Exchange (PSX)**. It aggregates live market data, news, and company profiles into a single, modern dashboard. It goes beyond simple data display by using **Artificial Intelligence (Google Gemini)** to provide automated market summaries and SWOT analysis for companies.

### Why did we make this?
Investors involved in the Pakistani market often struggle with fragmented data.
- **Problem**: Stock prices are on one site (PSX), news on another (Dawn/Tribune), and company details like CEO/Headquarters are scattered on Wikipedia or company sites.
- **Gap**: There was no "Bloomberg Terminal" equivalent for the average Pakistani investor that felt modern, fast, and intelligent.
- **Solution**: We built a centralized hub that brings all this together in a UI that feels 2025, not 2005.

### What are the benefits?
1.  **Time Saving**: View market pulse, top gainers, and sector performance in 5 seconds.
2.  **AI Intelligence**: Instead of reading 10 news articles, the AI reads them for you and gives a 3-sentence summary.
3.  **Modern Experience**: A dark-mode, animated, and responsive interface that works on mobile and desktop.
4.  **One-Stop Shop**: From reliable "Systems Ltd" stock prices to "Textile Sector" analysis, it's all here.

---

## 2. Features Breakdown 🚀

### A. Live Dashboard
- **Real-Time Ticker**: Shows live USD/PKR exchange rates and market status.
- **Bento Grid Layout**: A modern, modular grid showing Highlights, Trending Companies, and Watchlists.
- **Glowing Stats**: Key metrics (Market Cap, Active Companies) displayed in premium glowing cards.

### B. Artificial Intelligence (AI)
- **Market Pulse**: Google Gemini analyzes the top 30 stocks and recent news to write a daily market report.
- **Company SWOT**: On any company profile (e.g., Engro), the AI generates a breakdown of Strengths, Weaknesses, Opportunities, and Threats instantly.

### C. Data Engine
- **Live Stock Prices**: Fetches prices, volume, and percentage change.
- **Sector Analysis**: Automatically calculates which sectors (Cement, Tech, Banks) are performing best today.
- **News Aggregation**: Pulls headlines relevant to the economy.

### D. User System
- **Secure Auth**: Sign up/Login using JWT (JSON Web Tokens) or Google OAuth.
- **Watchlist**: Users can "Star" companies to keep them in a personal quick-access list.
- **Profile Management**: Update avatars and change passwords.

---

## 3. Technology Stack & Frameworks 💻

We used a modern, industry-standard stack to ensure performance and scalability.

### **Frontend (Client-Side)**
| Technology | Purpose | Why we chose it |
| :--- | :--- | :--- |
| **React (Vite)** | Core Framework | Fast development, component-based, and widely used. |
| **TypeScript** | Language | Adds type safety (e.g., ensuring a 'Stock' always has a 'price') to prevent bugs. |
| **Tailwind CSS** | Styling | Utility-first CSS for rapid, custom designs without fighting specificity wars. |
| **Framer Motion** | Animation | Powers the smooth entrance animations and complex layout transitions. |
| **Aceternity UI** | UI Library | Provides the "Hero Highlight", "Shooting Stars", and "Glowing Card" components. |
| **Lucide React** | Icons | Clean, lightweight SVG icons used throughout the app. |

### **Backend (Server-Side)**
| Technology | Purpose | Why we chose it |
| :--- | :--- | :--- |
| **Python 3.10+** | Language | The best language for AI and Data processing. |
| **FastAPI** | Web Framework | Extremely fast (Async), auto-generates API docs (Swagger), and easy to use. |
| **Motor (MongoDB)** | Database Driver | Asynchronous driver to talk to MongoDB non-blockingly. |
| **Pydantic** | Data Validation | Ensures data sent to/from the API is always in the correct format. |
| **YFinance** | Data Source | Python library to fetch historical and real-time market data. |
| **Google Generative AI** | AI SDK | Official SDK to interact with the Gemini Model. |

### **Infrastructure & Tools**
- **Git & GitHub**: Version control.
- **Vercel**: (Planned) Frontend deployment.
- **Render**: (Planned) Backend deployment.
- **MongoDB Atlas**: Cloud database hosting.

---

## 4. How We Built It (Development Process) 🛠️

We followed a professional **Agile Development** workflow, divided into "Phases".

1.  **Phase 1: Planning**: We defined the data models (Company, User, Industry) and chose the tech stack (FastAPI + React).
2.  **Phase 2: Backend Core**: We built the API first. We created the logic to store companies in MongoDB and fetch data using Python.
3.  **Phase 3: Frontend Foundation**: We set up React (Vite) and built the basic components (Navbar, Sidebar).
4.  **Phase 4: Real-Time Engine**: We integrated `yfinance` to strip live data from Yahoo Finance and feed it to our app.
5.  **Phase 5: AI Integration**: We connected Google Gemini API to "read" our data and output text.
6.  **Phase 6-10: UI Modernization**: The final step was applying "Aceternity UI" to give it the start-up look (Glowing cards, Shooting stars background).

---

## 4. File Structure & Distribution 📂

The project is split into two main folders: **Frontend** (what users see) and **Backend** (logic & data).

### Backend (`/backend`)
*   **`app/main.py`**: The entry point. This starts the server.
*   **`app/services/`**: The "Brain" of the backend.
    *   `ai_service.py`: Talk to Google Gemini.
    *   `market_service.py`: Validates logic to fetch stock prices.
    *   `data_engine.py`: Merges static data (JSON) with live data.
*   **`app/routes/`**: The API endpoints (URLs).
    *   `auth_routes.py`: Handle Login/Register.
    *   `company_routes.py`: Get company details.
    *   `market_routes.py`: Get live trends.
*   **`app/models/`**: Defines what a "User" or "Company" looks like in the database.

### Frontend (`/frontend`)
*   **`src/components/`**: The detailed building blocks.
    *   `LandingPage.tsx`: The first screen (Shooting stars, Hero section).
    *   `Dashboard.tsx`: The main screen (Charts, Grid).
    *   `Navbar.tsx`: The top bar with Search and Login.
*   **`src/services/`**: The bridge to the backend.
    *   `api.ts`: Functions to call `fetch('http://backend...')`.
*   **`src/components/ui/`**: Special fancy components (Aceternity UI) like `glowing-card`, `bento-grid`.

---

## 5. External Resources & APIs 🌐

We didn't invent everything from scratch. We connected to powerful existing tools:

1.  **Yahoo Finance (yfinance)**:
    *   *Purpose*: Get live stock prices for free.
    *   *Why*: Efficient and reliable for PSX data.
2.  **Google Gemini (GenAI)**:
    *   *Purpose*: The "Intelligence" layer.
    *   *Why*: Fast, supports huge context windows, and easy Python SDK.
3.  **MongoDB Atlas**:
    *   *Purpose*: Cloud Database.
    *   *Why*: It stores our User accounts and Company settings securely in the cloud.
4.  **Aceternity UI / Tailwind CSS**:
    *   *Purpose*: Design System.
    *   *Why*: Provides the "Glowing" and "Animated" effects without writing complex CSS from scratch.

---

## 6. How to Start / Run the Project ▶️

### Prerequisites
- Node.js (for Frontend)
- Python 3.10+ (for Backend)
- MongoDB Connection String

### Step 1: Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
*Runs on localhost:8000*

### Step 2: Frontend
```bash
cd frontend
npm install
npm run dev
```
*Runs on localhost:5173*

---

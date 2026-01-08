# Deployment Guide 🚀

Since your app has a **Background Scheduler** (for daily stock updates) and a **Database**, the best strategy is a **Split Deployment**:

1.  **Frontend** → **Vercel** (Global CDN, fast, optimized for React).
2.  **Backend** → **Render** (Support for Python, Background Tasks, and Persistent connections).

---

## Part 1: Deploy Backend (Render)
**Do this first so you have the API URL.**

1.  Create an account at [render.com](https://render.com).
2.  Click **"New + "** -> **"Web Service"**.
3.  Connect your GitHub repository.
4.  **Settings**:
    *   **Root Directory**: `backend`
    *   **Runtime**: `Python 3`
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5.  **Environment Variables** (Click "Advanced" > "Add Environmental Variable"):
    *   `MONGODB_URI`: (Your MongoDB Atlas connection string)
    *   `SECRET_KEY`: (Any random long string for security)
    *   `GEMINI_API_KEY`: (Your Google Gemini Key)
    *   `GOOGLE_CLIENT_ID`: (Your Google OAuth ID)
6.  Click **"Create Web Service"**.
7.  **Copy the URL**: Once deployed, Render will give you a URL like `https://pak-industry-insight.onrender.com`. **Copy this.**

---

## Part 2: Deploy Frontend (Vercel)

1.  Create an account at [vercel.com](https://vercel.com).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository.
4.  **Project Settings**:
    *   **Framework Preset**: Vite
    *   **Root Directory**: Click "Edit" and select `frontend`.
    *   **Build Command**: `npm run build` (Default)
    *   **Output Directory**: `dist` (Default Vite output).
5.  **Environment Variables**:
    *   Name: `VITE_API_URL`
    *   Value: (Paste your Render Backend URL here, e.g., `https://pak-industry-insight.onrender.com`) - **No trailing slash**.
6.  Click **"Deploy"**.

---

## 🏁 Verification
1.  Open your Vercel URL.
2.  Check the "Live Market" dashboard. It should pull data from your Render backend.
3.  Test "Login" and "AI Insights".

**Note**: The free tier of Render "spins down" after inactivity. The first request might take 30-50 seconds. This is normal for free hosting.

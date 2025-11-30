# PAK Industry Insight

A central platform to explore real-time and historical data about industries and companies across Pakistan.

## Features
- **Authentication**: Secure Login & Signup with JWT.
- **Industry Data**: Explore industries and companies.
- **Modern UI**: Built with React, Vite, and Tailwind CSS.

## 🚀 How to Run (For Developers)

### 1. Prerequisites
- **MongoDB**: You must have MongoDB installed and running.
    - [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
- **Python 3.8+**
- **Node.js 16+**

### 2. Backend Setup
1.  Navigate to `backend` folder:
    ```bash
    cd backend
    ```
2.  Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure Environment:
    - Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
    - (The default `MONGODB_URI` in `.env.example` works for local MongoDB).
5.  Run the Server:
    ```bash
    uvicorn app.main:app --reload
    ```
    Server will start at `http://localhost:8000`.

### 3. Frontend Setup
1.  Navigate to `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the Development Server:
    ```bash
    npm run dev
    ```
    App will start at `http://localhost:3000`.

## Troubleshooting
- **500 Internal Server Error**: Ensure MongoDB is running.
- **CORS Issues**: The frontend is configured to proxy requests to backend. Ensure both servers are running.
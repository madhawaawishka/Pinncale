# Pinnacle - Deployment Guide (Render.com Free Tier)

This guide walks you through deploying the complete Pinnacle Fullstack application (**Backend API**, **Client Frontend**, and **Admin Dashboard**) to **Render.com** for **100% free** without using Vercel.

---

## Architecture Overview

```
                      +-----------------------------+
                      |   MongoDB Atlas (Cloud DB)   |
                      +--------------+--------------+
                                     ^
                                     |
                                     v
                      +-----------------------------+
                      |   Backend Web Service       |
                      |   (pinnacle-server)         |
                      |   Node.js / Express API     |
                      +-------+--------------+------+
                              ^              ^
         Cross-Origin (HTTPS) |              | Cross-Origin (HTTPS)
                              |              |
           +------------------+--+        +--+------------------+
           | Client Frontend     |        | Admin Dashboard     |
           | (pinnacle-client)   |        | (pinnacle-admin)    |
           | React SPA (Static)  |        | React SPA (Static)  |
           +---------------------+        +---------------------+
```

---

## Method 1: 1-Click Deployment via Render Blueprint (Recommended)

Because we have added `render.yaml` to the root of the repository, Render can automatically create and link all 3 services for you in **one step**!

### Steps:
1. **Push the changes to GitHub:**
   Your local repository has already been configured and committed. Push to your GitHub repository:
   ```bash
   git push origin main
   ```

2. **Log in to Render:**
   - Go to [https://dashboard.render.com](https://dashboard.render.com).
   - Sign up or log in using your **GitHub account**.

3. **Deploy with Blueprint:**
   - On the top right of your Render dashboard, click **"New +"** and choose **"Blueprint"** (or visit [https://dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)).
   - Connect your repository: `madhawaawishka/Pinncale`.
   - Name your Blueprint project (e.g. `pinnacle-app`).
   - Render will read `render.yaml` and show the 3 services:
     - `pinnacle-server` (Web Service)
     - `pinnacle-client` (Static Site)
     - `pinnacle-admin` (Static Site)
   - Click **"Apply"**.

4. **Done!**
   - Render will install dependencies, build the applications, and assign live HTTPS URLs to each service!

---

## Method 2: Manual Setup on Render (Step-by-Step)

If you prefer to configure each service individually on the Render dashboard:

### 1. Deploy the Backend Web Service (`server`)
1. In Render Dashboard, click **New +** > **Web Service**.
2. Connect your `Pinncale` GitHub repository.
3. Configure the service settings:
   - **Name:** `pinnacle-server` (or your choice)
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Instance Type:** `Free`
4. Expand **Advanced** and add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: `mongodb+srv://pinnacleitp:pinnacle123@crud.vsshiuj.mongodb.net/?retryWrites=true&w=majority&appName=crud`
5. Click **Create Web Service**.
6. Once deployed, copy your backend URL (e.g. `https://pinnacle-server-xxxx.onrender.com`).

---

### 2. Deploy the Client Frontend (`pinnacle`)
1. In Render Dashboard, click **New +** > **Static Site**.
2. Connect your `Pinncale` GitHub repository.
3. Configure the site settings:
   - **Name:** `pinnacle-client` (or your preferred portfolio name)
   - **Root Directory:** `pinnacle`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
4. Expand **Advanced** and add Environment Variables:
   - `REACT_APP_API_URL`: Your backend URL from Step 1 (e.g. `https://pinnacle-server-xxxx.onrender.com`)
   - `CI`: `false`
5. Under **Redirects/Rewrites**:
   - Add a rewrite:
     - **Source:** `/*`
     - **Destination:** `/index.html`
     - **Action:** `Rewrite`
   *(Note: `_redirects` file is also pre-included in the repository for automatic SPA routing)*
6. Click **Create Static Site**.
7. Once finished, copy your live frontend URL (e.g. `https://pinnacle-client.onrender.com`). **This is your live portfolio URL for your resume!**

---

### 3. Deploy the Admin Dashboard (`admin`) *(Optional)*
1. In Render Dashboard, click **New +** > **Static Site**.
2. Connect your `Pinncale` GitHub repository.
3. Configure the site settings:
   - **Name:** `pinnacle-admin`
   - **Root Directory:** `admin`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
4. Expand **Advanced** and add Environment Variables:
   - `REACT_APP_API_URL`: Your backend URL from Step 1 (e.g. `https://pinnacle-server-xxxx.onrender.com`)
   - `CI`: `false`
5. Click **Create Static Site**.

---

## Important Free Tier Notes

- **Spin-down Behavior:** On Render's Free tier, the backend web service spins down after 15 minutes of inactivity to save resources. When someone visits the frontend after a period of inactivity, the first API request may take ~30–45 seconds while the backend wakes up. Subsequent requests are instant.
- **MongoDB Atlas:** The database is hosted in MongoDB Atlas cloud and runs 24/7 without interruption.
- **Dynamic API Switching:** In local development, the frontends continue connecting to `http://localhost:3001` automatically. When hosted, they dynamically switch to `REACT_APP_API_URL`.

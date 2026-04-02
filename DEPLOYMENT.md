# Food Street - Deployment Guide

## Step 1: Setup MongoDB Atlas (Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Login to your account
3. Click **"Create" → "Build a Database"**
4. Choose **"Free" tier**
5. Select region (closest to your location)
6. Wait for cluster to be created
7. Click **"Connect"**
8. Choose **"Drivers"** → **"Node.js"** → version **4.1 or later**
9. Copy the connection string: `mongodb+srv://username:password@cluster.mongodb.net/foodstreet`
10. Replace `username`, `password`, and database name with your credentials

---

## Step 2: Setup Backend on Render

### 2.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub account (recommended)
3. Authorize GitHub access

### 2.2 Deploy Backend
1. Push your code to GitHub
2. Go to Render Dashboard
3. Click **"New +" → "Web Service"**
4. Select your GitHub repo (`vc_web`)
5. Fill in details:
   - **Name:** `foodstreet-api`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Branch:** `main`

### 2.3 Add Environment Variables on Render
Click **"Environment"** and add:

| Key | Value |
|---|---|
| `MONGO_URI` | `mongodb+srv://username:password@cluster.mongodb.net/foodstreet` |
| `JWT_SECRET` | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `PORT` | `5000` |
| `CLIENT_URL` | Will add after Vercel deployment |

Click **"Deploy"** and wait for deployment to complete.

**Note:** Your backend URL will be like: `https://foodstreet-api.onrender.com`

---

## Step 3: Setup Frontend on Vercel

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub account
3. Authorize GitHub access

### 3.2 Deploy Frontend
1. Go to Vercel Dashboard
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repo
4. Framework: **"Other"** (or Vite)
5. Fill in:
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 3.3 Add Environment Variables on Vercel
Click **"Environment Variables"** and add:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://foodstreet-api.onrender.com` |

Click **"Deploy"** and wait for completion.

**Your frontend URL will be like:** `https://foodstreet-production.vercel.app`

---

## Step 4: Update Backend with Frontend URL

Go back to **Render Dashboard**:
1. Click your `foodstreet-api` service
2. Click **"Environment"**
3. Update `CLIENT_URL` to your Vercel URL: `https://foodstreet-production.vercel.app`
4. Click **"Save"** → Service redeploys automatically

---

## Step 5: Final Configuration

### 5.1 Update MongoDB Atlas Network Access
1. Go to MongoDB Atlas
2. Click **"Network Access"**
3. Click **"+ Add IP Address"**
4. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **"Confirm"**

### 5.2 Test the Application
1. Open: `https://foodstreet-production.vercel.app`
2. Register a new user
3. Fill out the inspection form
4. Submit
5. Check admin dashboard at `/admin` to see submissions

---

## Deployment Checklist

- [ ] MongoDB Atlas database created with connection string
- [ ] Backend deployed on Render with all env vars
- [ ] Frontend deployed on Vercel with VITE_API_URL
- [ ] Backend `CLIENT_URL` updated with Vercel URL
- [ ] MongoDB Atlas Network Access allows all IPs
- [ ] User registration works
- [ ] Form submission works
- [ ] Admin dashboard receives real-time updates
- [ ] Multiple submissions work without deletion

---

## Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` is correct on Vercel
- Check CORS is enabled on backend
- Check backend is running (green "Active" on Render)

### MongoDB connection fails
- Verify connection string in `MONGO_URI`
- Check username/password are correct
- Verify Network Access allows your IP in MongoDB Atlas
- Check database name in connection string matches

### Real-time updates not working
- Check Socket.io connection URL matches backend URL
- Verify WebSocket is enabled (enabled by default on Render)

---

## Git Push for Deployment

Push your code to trigger automatic deployments:

```bash
git add .
git commit -m "Final deployment ready"
git push origin main
```

Both Render and Vercel watch your GitHub repo and auto-deploy on push!

---

## Environment Variables Summary

### Backend (Render)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/foodstreet
JWT_SECRET=<64-character hex string>
PORT=5000
CLIENT_URL=https://foodstreet-production.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://foodstreet-api.onrender.com
```

---

**Done!** Your Food Street app is now live! 🚀

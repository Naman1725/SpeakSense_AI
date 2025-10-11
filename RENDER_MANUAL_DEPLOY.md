# Manual Render Deployment Guide for SpeakSense AI

Since Blueprint has YAML format issues, let's deploy manually. It's actually easier!

## Step 1: Deploy Backend (Python Web Service)

1. **Go to Render Dashboard** → Click **"New +"** → Select **"Web Service"**

2. **Connect Repository**: Select `Naman1725/SpeakSense_AI`

3. **Configure Service**:
   - **Name**: `speaksense-ai-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn --bind 0.0.0.0:$PORT --timeout 120 app:app`
   - **Plan**: `Free`

4. **Environment Variables** (click "Advanced" then "Add Environment Variable"):
   - `HF_API_KEY` = `your_huggingface_api_key_here`
   - `FLASK_ENV` = `production`
   - `CORS_ORIGINS` = (leave empty for now, we'll add after frontend)

5. **Click "Create Web Service"**

6. **IMPORTANT**: Copy your backend URL (e.g., `https://speaksense-ai-backend.onrender.com`)

---

## Step 2: Deploy Frontend (Static Site)

1. **Go to Render Dashboard** → Click **"New +"** → Select **"Static Site"**

2. **Connect Repository**: Select `Naman1725/SpeakSense_AI` (same repo)

3. **Configure Service**:
   - **Name**: `speaksense-ai-frontend`
   - **Region**: Same as backend
   - **Branch**: `main`
   - **Root Directory**: Leave blank
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`

4. **Environment Variables**:
   - `REACT_APP_API_URL` = `https://speaksense-ai-backend.onrender.com/api`
   - (Replace with your actual backend URL from Step 1.6)

5. **Click "Create Static Site"**

6. **Copy your frontend URL** (e.g., `https://speaksense-ai-frontend.onrender.com`)

---

## Step 3: Update Backend CORS

Now that you have the frontend URL:

1. Go back to **speaksense-ai-backend** service
2. Click **"Environment"** tab on the left
3. Click **"Add Environment Variable"**
4. Add:
   - Key: `CORS_ORIGINS`
   - Value: `https://speaksense-ai-frontend.onrender.com` (your actual frontend URL)
5. Click **"Save Changes"**
6. Backend will automatically redeploy

---

## Step 4: Test Your App! 🎉

1. Visit your frontend URL: `https://speaksense-ai-frontend.onrender.com`
2. Click "Start Live Analysis" or upload a video
3. Start speaking and watch the AI analyze in real-time!

---

## Troubleshooting

### Backend shows "Application failed to respond"
- Check logs in Render dashboard
- Verify `HF_API_KEY` is set correctly
- Make sure `opencv-python-headless` is in requirements.txt

### Frontend can't connect to backend
- Check browser console for errors
- Verify `REACT_APP_API_URL` has `/api` at the end
- Make sure `CORS_ORIGINS` in backend matches your frontend URL

### First load is slow (30-60 seconds)
- This is normal for free tier - services spin down after 15 minutes of inactivity
- After first wake-up, it will be fast

---

## Your Live URLs

Once deployed:
- **Frontend**: `https://speaksense-ai-frontend.onrender.com`
- **Backend API**: `https://speaksense-ai-backend.onrender.com`

Share the frontend URL with anyone to use your app!

# SpeakSense AI - Render Deployment Guide

This guide will walk you through deploying SpeakSense AI public speaking analyzer to Render.

## Prerequisites

1. A GitHub account
2. A Render account (sign up at https://render.com)
3. Your code pushed to a GitHub repository

## Step 1: Push Code to GitHub

If you haven't already, initialize a git repository and push your code:

```bash
cd "c:\Users\Naman Sharma\Desktop\NegGes_AI"
git init
git add .
git commit -m "Initial commit - SpeakSense AI public speaking analyzer"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/speaksense-ai.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Using render.yaml (Recommended)

### Option A: Automatic Deployment with Blueprint

1. Log in to your Render dashboard
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click "Apply" to create both services

### Option B: Manual Service Creation

If automatic detection doesn't work, create services manually:

#### Deploy Backend Service

1. Go to Render Dashboard → "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `speaksense-ai-backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn --bind 0.0.0.0:$PORT --timeout 120 app:app`
   - **Plan**: Free
4. Add Environment Variables:
   - `HF_API_KEY` = `your_huggingface_api_key`
   - `FLASK_ENV` = `production`
   - `CORS_ORIGINS` = (leave empty for now, will update after frontend deployment)
5. Click "Create Web Service"
6. **Copy the backend URL** (e.g., `https://speaksense-ai-backend.onrender.com`)

#### Deploy Frontend Service

1. Go to Render Dashboard → "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `speaksense-ai-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
4. Add Environment Variables:
   - `REACT_APP_API_URL` = `https://speaksense-ai-backend.onrender.com/api` (use your actual backend URL from step 6 above)
5. Click "Create Static Site"
6. **Copy the frontend URL** (e.g., `https://speaksense-ai-frontend.onrender.com`)

## Step 3: Update CORS Settings

After both services are deployed:

1. Go back to your **backend service** on Render
2. Go to "Environment" tab
3. Update the `CORS_ORIGINS` variable:
   - Value: `https://speaksense-ai-frontend.onrender.com` (use your actual frontend URL)
4. Click "Save Changes"
5. The backend will automatically redeploy

## Step 4: Test Your Deployment

1. Visit your frontend URL (e.g., `https://speaksense-ai-frontend.onrender.com`)
2. Click "Start Live Analysis" or upload a video
3. The application should work exactly like it does locally

## Important Notes

### Free Tier Limitations

- **Backend**: May spin down after 15 minutes of inactivity. First request after inactivity will take 30-60 seconds to wake up.
- **Frontend**: Always available instantly (static site)
- **Build time**: Initial deployment may take 5-10 minutes

### Troubleshooting

#### Backend shows "Application Error"
- Check logs in Render dashboard
- Verify all environment variables are set correctly
- Ensure `opencv-python-headless` is in requirements.txt (not `opencv-python`)

#### Frontend can't connect to backend
- Check that `REACT_APP_API_URL` includes `/api` at the end
- Verify CORS_ORIGINS in backend includes your frontend URL
- Check browser console for CORS errors

#### Build failures
- For backend: Check that `gunicorn` and `requests` are in `backend/requirements.txt`
- For frontend: Ensure all npm packages are in `frontend/package.json`

### Environment Variables Summary

**Backend Service:**
```
HF_API_KEY=your_huggingface_api_key
FLASK_ENV=production
CORS_ORIGINS=https://your-frontend-url.onrender.com
```

**Frontend Service:**
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

## Sharing Your Application

Once deployed, share your **frontend URL** with anyone:
- Example: `https://negges-ai-frontend.onrender.com`
- No authentication required
- Works on any device with a camera and microphone

## Monitoring and Logs

- View logs: Render Dashboard → Select Service → "Logs" tab
- Monitor metrics: "Metrics" tab shows CPU, memory, and request stats
- Check deployment status: "Events" tab shows deployment history

## Updating Your Application

To deploy updates:

1. Make changes to your local code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. Render will automatically detect the push and redeploy both services

## Custom Domain (Optional)

To use your own domain:

1. Go to your frontend service → "Settings" → "Custom Domain"
2. Add your domain (e.g., `app.yourdomain.com`)
3. Update DNS records as instructed by Render
4. Update backend `CORS_ORIGINS` to include your custom domain

## Support

- Render Documentation: https://render.com/docs
- Check Render Community: https://community.render.com
- View deployment logs for detailed error messages

---

**Your application is now live and accessible to anyone via the frontend URL!**

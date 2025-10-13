# Render Deployment Guide for Planning Poker

## 🚀 Quick Deployment Steps

### Prerequisites
- GitHub account with your Planning Poker repository
- Render account (free signup at render.com)

### Deployment Process

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Create Render Service**
   - Go to [render.com](https://render.com) and sign up
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your Planning-Poker repository

3. **Configure Service Settings**
   - **Name**: `planning-poker` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (uses repository root)
   - **Build Command**: `npm run build` (Render will auto-detect)
   - **Start Command**: `npm start` (Render will auto-detect)

4. **Environment Variables (Optional)**
   Render automatically sets:
   - `PORT` (dynamically assigned)
   - `RENDER_EXTERNAL_URL` (your app's URL)
   - `NODE_ENV` (automatically set to `production`)

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically detect Node.js and build
   - Wait for deployment to complete (usually 3-7 minutes)

## 🔧 What We Changed

1. **Updated `package.json`**:
   - **Fixed start command**: Now uses `cd backend && npm start` 
   - **Added postinstall script**: Automatically installs frontend/backend dependencies
   - **Simplified build process**: Uses standard `npm run build` command
   - **Added Node.js version requirements**: Ensures compatibility

2. **Updated `backend/server.js`**:
   - **Added dynamic CORS configuration**: Works with Render URLs automatically
   - **Uses `RENDER_EXTERNAL_URL`**: Environment variable for production URLs
   - **Enhanced network-info endpoint**: Deployment platform aware

3. **Removed `render.yaml`**:
   - **Auto-detection works better**: Render automatically detects Node.js apps
   - **Simplified deployment**: No complex configuration needed
   - **Standard npm scripts**: Uses package.json scripts directly

4. **Fixed Copy Link functionality**:
   - **Production URLs**: Uses actual deployment URL instead of dev tunnel
   - **Platform agnostic**: Works on any deployment platform

## 🌐 Access Your App

After deployment:
- Your app will be available at: `https://your-app-name.onrender.com`
- The URL will be shown in your Render dashboard
- SSL certificate is automatically provided

## 🔧 Post-Deployment

1. **Test Real-time Features**:
   - Open multiple browser tabs
   - Create a game room
   - Test voting functionality

2. **Monitor Performance**:
   - Check Render dashboard for logs
   - Monitor response times
   - Check for any WebSocket connection issues

## 💰 Render Pricing

- **Free Tier**: 
  - 750 hours per month
  - Apps spin down after 15 minutes of inactivity
  - Good for testing and small projects

- **Paid Plans**: 
  - Start at $7/month
  - Always-on instances
  - Better performance
  - Custom domains

## 🐛 Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check build logs in Render dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

2. **WebSocket Issues**:
   - Render fully supports WebSocket connections
   - Check browser console for connection errors
   - Verify CORS settings in server.js

3. **App Not Loading**:
   - Check if frontend build completed successfully
   - Verify start command is correct
   - Check server logs for errors

### Debugging Commands:
```bash
# Local testing before deployment
npm run install:all
npm run build:frontend
npm run start:backend
```

## 🔄 Automatic Deployments

- Render automatically redeploys when you push to your main branch
- You can disable auto-deploy if needed
- Manual deploys available in dashboard

## 🌟 Benefits of Render for Your App

1. ✅ **Full WebSocket Support** - Socket.IO works perfectly
2. ✅ **Zero Configuration** - Works with your current setup
3. ✅ **Automatic HTTPS** - SSL certificates provided
4. ✅ **Git Integration** - Auto-deploy on push
5. ✅ **Free Tier Available** - Great for testing
6. ✅ **Scalable** - Easy to upgrade as you grow

Your Planning Poker app is now ready for production deployment on Render! 🎉
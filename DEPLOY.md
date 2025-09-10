# Deploy Personal Activity Tracker to Vercel

## Quick Deploy Steps

### Option 1: One-Click Deploy (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/haotiany-cmu-F25/f25-pat-A-haotiany)

### Option 2: Manual Deploy

1. **Fork/Clone this repository to your GitHub account**

2. **Set up MongoDB Atlas (Free Tier)**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a free account
   - Create a new cluster (M0 Sandbox - FREE)
   - Create a database user
   - Get your connection string

3. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Sign in with your GitHub account
   - Click "New Project"
   - Import your repository
   - Add environment variable:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
   - Deploy!

4. **Your app will be live at: `https://your-app-name.vercel.app`**

## Environment Variables for Production

Add these to your Vercel project settings:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/activity_tracker?retryWrites=true&w=majority
NODE_ENV=production
```

## Features

- ✅ **Globally Accessible**: Anyone can visit your website
- ✅ **Real Database**: Uses MongoDB Atlas (not local SQLite)
- ✅ **Serverless**: Automatically scales to handle traffic
- ✅ **Free Hosting**: Both Vercel and MongoDB Atlas offer free tiers
- ✅ **Custom Domain**: You can add your own domain later

## API Endpoints

Once deployed, your API will be available at:

- `POST https://your-app.vercel.app/api/activities` - Add activities
- `GET https://your-app.vercel.app/api/activities` - Get activities
- `GET https://your-app.vercel.app/` - Activity Monitor
- `GET https://your-app.vercel.app/trend` - Activity Trends

## Local Development

```bash
npm install
npm start
# Local: http://localhost:3000
```

# Deploying SafeSpeak to Render

## Prerequisites
- GitHub account (to connect your repository)
- Render account (free at [render.com](https://render.com))
- Firebase project credentials

## Deployment Steps

### 1. Push Code to GitHub
If you haven't already, push your code to a GitHub repository:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Set Up Environment Variables in Render
Before deploying, you'll need to add your Firebase credentials as environment variables in Render:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Create a new Static Site
3. Connect your GitHub repository
4. Configure the following settings:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Branch**: `main` (or your default branch)

5. Add environment variables in the "Environment" section:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_DATABASE_URL`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### 3. Deploy
Click "Create Static Site" and Render will automatically build and deploy your application.

### 4. Custom Domain (Optional)
You can add a custom domain in the Render dashboard under Settings > Custom Domain.

## Automatic Deployments
Render will automatically redeploy your site whenever you push changes to your connected GitHub repository.

## Configuration Files
- `render.yaml`: Contains the deployment configuration for Render
- This file ensures proper routing for your React SPA

## Troubleshooting
- **Build fails**: Check that all dependencies are listed in `package.json`
- **Blank page after deploy**: Verify environment variables are set correctly
- **404 errors on refresh**: The `render.yaml` rewrite rule should handle this

## Support
- [Render Documentation](https://render.com/docs/static-sites)
- [Render Community Forum](https://community.render.com)

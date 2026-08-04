# Deployment Guide

Complete guide for deploying the Background Remover app to Vercel (frontend) and Railway (backend).

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Vercel account (for frontend)
- Railway account (for backend)

---

## Frontend Deployment (Vercel)

### Option 1: Deploy via Vercel Dashboard

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository
   - Select the repository

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app
   VITE_USE_MOCK_API=false
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - Get your URL: `https://your-app.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

---

## Backend Deployment (Railway)

### Option 1: Deploy via Railway Dashboard

1. **Push to Git**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create New Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Service**
   - **Root Directory**: `backend`
   - Railway auto-detects Python and uses `requirements.txt`

4. **Environment Variables** (Optional)
   Add in Railway dashboard:
   ```
   ENVIRONMENT=production
   ALLOWED_ORIGINS=https://your-app.vercel.app
   ```

5. **Deploy**
   - Railway automatically deploys
   - Get your URL: `https://your-backend.railway.app`

### Option 2: Deploy via Railway CLI

```bash
cd backend
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## Post-Deployment Configuration

### 1. Update Frontend Environment Variables

In Vercel dashboard, update:
```
VITE_API_BASE_URL=https://your-backend.railway.app
```

Redeploy frontend to apply changes.

### 2. Update Backend CORS (Recommended for Production)

In Railway dashboard, add environment variable:
```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-preview.vercel.app
ENVIRONMENT=production
```

This restricts API access to only your frontend domains.

### 3. Test the Deployment

1. Visit your Vercel URL
2. Upload an image
3. Verify background removal works
4. Check browser console for errors

---

## Troubleshooting

### Frontend Issues

**Build fails:**
```bash
cd frontend
npm install
npm run build
```
Fix any errors locally first.

**API not connecting:**
- Check `VITE_API_BASE_URL` is correct
- Verify `VITE_USE_MOCK_API=false`
- Check browser console for CORS errors

### Backend Issues

**Deployment fails:**
- Verify `requirements.txt` is correct
- Check Railway logs for errors
- Ensure Python version compatibility

**CORS errors:**
- Add frontend URL to `ALLOWED_ORIGINS` env variable
- Set `ENVIRONMENT=production`

**Slow processing:**
- Railway free tier may have limited resources
- Consider upgrading plan for production use

---

## Railway Configuration Files

### `railway.toml`
Already created in `backend/` folder. Configures:
- Build process
- Start command
- Restart policy

### `Procfile`
Already created in `backend/` folder. Specifies:
- Web process command

### `runtime.txt`
Already created in `backend/` folder. Specifies:
- Python version

---

## Vercel Configuration

### `vercel.json`
Already created in `frontend/` folder. Configures:
- Build settings
- Routing (SPA support)

---

## Monitoring

### Vercel
- View deployments: Vercel Dashboard → Your Project
- Check logs: Deployment → Functions → Logs
- Analytics: Built-in

### Railway
- View deployments: Railway Dashboard → Your Service
- Check logs: Real-time logs in dashboard
- Metrics: CPU, Memory, Network usage

---

## Custom Domains

### Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

### Backend (Railway)
1. Go to Service Settings → Networking
2. Click "Generate Domain" or add custom domain
3. Update DNS if using custom domain

---

## Cost Estimates

### Vercel
- **Free Tier**: Unlimited deployments, 100GB bandwidth/month
- Perfect for this project

### Railway
- **Free Trial**: $5 credit
- **Hobby Plan**: ~$5-10/month for this app
- **Usage-based**: CPU, Memory, Network

---

## Security Recommendations

1. **Update CORS in production:**
   - Set specific frontend URL in `ALLOWED_ORIGINS`
   - Don't use wildcard `*` in production

2. **Rate limiting:**
   - Consider adding rate limiting middleware
   - Protect against abuse

3. **File size limits:**
   - Already set to 10MB
   - Adjust based on needs

4. **Environment secrets:**
   - Never commit `.env` files
   - Use platform-specific secret management

---

## Continuous Deployment

Both Vercel and Railway support automatic deployments:

- **Push to `main`** → Auto-deploy to production
- **Push to other branches** → Create preview deployments
- **Pull Requests** → Automatic preview URLs

---

## Rollback

### Vercel
- Go to Deployments
- Click on previous deployment
- Click "Promote to Production"

### Railway
- Go to Deployments
- Click on previous deployment
- Click "Redeploy"

---

## Support

For deployment issues:
- Email: sgandrew290@gmail.com
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app

---

## Checklist

Before deploying:

**Frontend:**
- [ ] `npm run build` works locally
- [ ] No console errors
- [ ] Environment variables set in Vercel
- [ ] Root directory set to `frontend`

**Backend:**
- [ ] All dependencies in `requirements.txt`
- [ ] CORS configured properly
- [ ] Root directory set to `backend`
- [ ] Environment variables set in Railway

**Post-Deployment:**
- [ ] Frontend can reach backend API
- [ ] Image upload works
- [ ] Background removal works
- [ ] Download works
- [ ] No CORS errors in browser console

---

## Author

**Andrew San Antonio**  
Email: sgandrew290@gmail.com

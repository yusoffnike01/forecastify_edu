# 🚀 Cloudflare Pages Deployment Guide

## Prerequisites

1. **Cloudflare Account** - Sign up at [cloudflare.com](https://cloudflare.com)
2. **GitHub Repository** - Push your code to GitHub
3. **Node.js & npm** - For local development

## 📋 Deployment Steps

### Method 1: Cloudflare Dashboard (Recommended)

1. **Login to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to "Pages" in the sidebar

2. **Create New Project**
   - Click "Create a project"
   - Select "Connect to Git"
   - Choose your GitHub repository

3. **Configure Build Settings**
   ```
   Project name: forecastify-edu
   Production branch: main (or your default branch)
   Framework preset: None
   Build command: npm run build
   Build output directory: dist
   Root directory: / (leave empty)
   ```

4. **Environment Variables** (if needed)
   - Add any environment variables in the "Environment variables" section
   - For this project, no environment variables are required

5. **Deploy**
   - Click "Save and Deploy"
   - Wait for build to complete (usually 2-3 minutes)

### Method 2: Wrangler CLI

1. **Install Wrangler**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**
   ```bash
   wrangler login
   ```

3. **Deploy**
   ```bash
   npm run build
   wrangler pages deploy dist --project-name=forecastify-edu
   ```

## 🔧 Configuration Files

### `public/_headers`
Handles MIME types and security headers:
```txt
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-XSS-Protection: 1; mode=block

/*.js
  Content-Type: application/javascript

/*.jsx
  Content-Type: application/javascript
```

### `public/_redirects`
Handles SPA routing:
```txt
/*    /index.html   200
```

### `vite.config.js`
Optimized for Cloudflare:
```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
```

## 🐛 Troubleshooting

### Error: "text/jsx is not a valid JavaScript MIME type"

**Solution**: The `_headers` file fixes this by setting proper MIME types.

### Error: "Page not found" on refresh

**Solution**: The `_redirects` file handles SPA routing.

### Error: Build fails

**Check**:
1. All dependencies are in `package.json`
2. Build command is correct: `npm run build`
3. Output directory is `dist`

### Error: Assets not loading

**Check**:
1. All assets are in the `public` folder
2. Paths in code are relative to `public`
3. `_headers` file includes proper MIME types

## 📊 Performance Optimization

### Bundle Size
- Current bundle is ~1.1MB (large due to Recharts)
- Consider code splitting for better performance
- Use dynamic imports for heavy components

### Caching
- Cloudflare automatically caches static assets
- Add cache headers in `_headers` if needed

### CDN
- Cloudflare provides global CDN
- Assets are served from edge locations

## 🔒 Security

### Headers Set
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer info
- `X-XSS-Protection: 1; mode=block` - XSS protection

### HTTPS
- Cloudflare automatically provides SSL certificates
- All traffic is encrypted

## 📱 Custom Domain

1. **Add Custom Domain**
   - Go to your Pages project
   - Click "Custom domains"
   - Add your domain

2. **DNS Configuration**
   - Cloudflare will provide DNS records
   - Add them to your domain registrar

## 🔄 Continuous Deployment

### Automatic Deployments
- Every push to main branch triggers deployment
- Preview deployments for pull requests
- Automatic rollback on build failures

### Manual Deployments
- Use Cloudflare Dashboard
- Use Wrangler CLI
- Use GitHub Actions (advanced)

## 📈 Monitoring

### Analytics
- Cloudflare provides built-in analytics
- View in Pages dashboard

### Error Tracking
- Check build logs in dashboard
- Monitor runtime errors in browser console

## 🚀 Post-Deployment

### Verify Deployment
1. Check all pages load correctly
2. Test all functionality
3. Verify PDF export works
4. Test responsive design

### Performance Check
1. Run Lighthouse audit
2. Check Core Web Vitals
3. Monitor bundle size

---

**Need Help?** Check Cloudflare documentation or create an issue in the repository. 
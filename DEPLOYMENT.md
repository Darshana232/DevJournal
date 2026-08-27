# DevJournal - Deployment Guide

Complete instructions for deploying DevJournal to production environments.

## Table of Contents
1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Vercel Deployment](#vercel-deployment)
4. [GitHub Pages](#github-pages)
5. [Self-Hosted VPS](#self-hosted-vps)
6. [Environment Configuration](#environment-configuration)

---

## Local Development

### Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/DevJournal.git
cd DevJournal

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Add your API keys to .env.local
# VITE_GROQ_API_KEY=your_key
# VITE_SUPABASE_URL=your_url
# VITE_SUPABASE_ANON_KEY=your_key

# Start development server
npm run dev
```

Access at: http://localhost:5173

### Getting API Keys

**Groq API:**
1. Visit https://console.groq.com
2. Sign up or log in
3. Create new API key
4. Copy to `.env.local`

**Supabase (Optional):**
1. Visit https://supabase.com
2. Create project
3. Get URL and Anon Key from Settings → API
4. Add to `.env.local`

---

## Docker Deployment

### Build Docker Image

```bash
# Build image
docker build -t devjournal:latest .

# Or use docker-compose
docker-compose build
```

### Run Docker Container

```bash
# Single container
docker run -d \
  -p 3000:80 \
  --name devjournal \
  --restart unless-stopped \
  devjournal:latest

# Or with docker-compose
docker-compose up -d
```

### Docker Environment Variables

API keys are built into the frontend (client-side), so no server-side environment setup needed. The app handles API calls from the browser.

### Health Check

```bash
curl http://localhost:3000/health
# Response: healthy
```

### View Logs

```bash
# Single container
docker logs devjournal

# Docker Compose
docker-compose logs -f devjournal
```

### Stop & Clean Up

```bash
# Stop container
docker stop devjournal
docker rm devjournal

# Or with docker-compose
docker-compose down
```

---

## Vercel Deployment (Recommended)

Vercel is the easiest way to deploy Vite React apps with zero configuration.

### Step 1: Push to GitHub

```bash
git push origin main
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel auto-detects Vite configuration
4. Click "Deploy"

### Step 3: Set Environment Variables

1. Go to **Project Settings** → **Environment Variables**
2. Add these variables:
   - `VITE_GROQ_API_KEY`: Your Groq API key
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

3. Deploy again: **Deployments** → **Redeploy**

### Step 4: Configure Custom Domain (Optional)

1. **Settings** → **Domains**
2. Add your custom domain
3. Point DNS records to Vercel

### Automatic Deployments

Vercel automatically deploys on every push to `main`:
```bash
git push origin main  # Triggers production deploy
git push origin develop  # Triggers preview deploy (if branch configured)
```

---

## GitHub Pages

Deploy directly from GitHub with automatic builds.

### Step 1: Update package.json

```json
{
  "homepage": "https://yourusername.github.io/DevJournal",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.0.0"
  }
}
```

### Step 2: Install & Deploy

```bash
npm install --save-dev gh-pages
npm run deploy
```

### Step 3: Enable GitHub Pages

1. Go to repository **Settings**
2. Scroll to **GitHub Pages**
3. Set source to `gh-pages` branch
4. Custom domain: Add `CNAME` file with your domain

### Update React Router

Since GitHub Pages uses subpaths, update Router:

```jsx
<BrowserRouter basename="/DevJournal">
  {/* routes */}
</BrowserRouter>
```

---

## Self-Hosted VPS

Deploy to your own server (AWS, DigitalOcean, Linode, etc).

### Prerequisites

- Ubuntu 20.04+ or similar Linux
- SSH access to server
- Domain name pointing to server IP

### Step 1: Install Dependencies

```bash
# SSH into server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt-get install -y nginx

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Step 2: Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/DevJournal.git
cd DevJournal

# Install dependencies
npm install

# Build for production
npm run build

# Create .env file (for PM2 to load)
cp .env.example .env
# Edit .env with your API keys
nano .env

# Start with PM2
pm2 start "npm run preview" --name devjournal
pm2 startup
pm2 save
```

### Step 3: Configure Nginx

Create `/etc/nginx/sites-available/devjournal`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /home/user/DevJournal/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/devjournal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: Enable HTTPS (Let's Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Maintenance

```bash
# View logs
pm2 logs devjournal

# Restart app
pm2 restart devjournal

# Update app
git pull
npm install
npm run build
pm2 restart devjournal
```

---

## Environment Configuration

### Required Variables

```
VITE_GROQ_API_KEY         # Groq API key (REQUIRED for AI features)
```

### Optional Variables

```
VITE_SUPABASE_URL         # Supabase URL (for cloud storage)
VITE_SUPABASE_ANON_KEY    # Supabase anon key
```

### App Behavior Without Keys

| Key Missing | Behavior |
|------------|----------|
| `VITE_GROQ_API_KEY` | AI features show error, journaling still works |
| `VITE_SUPABASE_URL` | Uses LocalStorage only, no cloud sync |
| Both | Full app works with LocalStorage |

---

## Monitoring & Maintenance

### Health Checks

```bash
# Check if app is running
curl https://your-domain.com/health

# Expected response: 200 OK with "healthy" text
```

### Performance Monitoring

Monitor these metrics:
- Page load time
- API response times
- Groq API rate limits
- Supabase connection status

### Backup Strategy

```bash
# Backup user data (if using Supabase)
pg_dump -h db.supabase.co -U postgres devjournal > backup.sql
```

### Update Process

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install

# Build
npm run build

# Restart (if using PM2)
pm2 restart devjournal

# Or rebuild Docker
docker build -t devjournal:latest .
docker run -d -p 3000:80 devjournal:latest
```

---

## Troubleshooting

### App won't load

```bash
# Check browser console for errors
# Check network tab for failed requests
# Verify API keys are set correctly
```

### AI features not working

```bash
# Verify VITE_GROQ_API_KEY is set
# Check Groq account for rate limits
# Verify API key has not expired
```

### Slow performance

```bash
# Check bundle size: npm run build
# Monitor API response times
# Check Groq/Supabase quotas
```

### Database connection issues

```bash
# Verify VITE_SUPABASE_URL is correct
# Check Supabase project is active
# Verify network connectivity
```

---

## Security Checklist

- [ ] API keys are in `.env.local`, not in code
- [ ] `.env.local` is in `.gitignore`
- [ ] HTTPS is enabled (SSL certificate)
- [ ] Security headers are configured in Nginx
- [ ] CORS is properly configured
- [ ] Regular backups are scheduled

---

## Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build -- --analyze

# Results show in `/dist` folder
```

### Caching Strategy

- Static assets: 30 days
- API responses: 5 minutes
- Entry data: Real-time sync

### Lazy Loading

Insights page is lazy-loaded by default (Recharts is ~200KB).

---

## Support

- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Groq Support:** https://console.groq.com/docs
- **Supabase Support:** https://supabase.com/docs

---

**Last Updated:** 2024
**Maintained by:** Darshana

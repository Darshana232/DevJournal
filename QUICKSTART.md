# DevJournal - Quick Start Guide

Get DevJournal running in 5 minutes.

## Prerequisites

- Node.js 18+ ([download](https://nodejs.org))
- A Groq API key ([get one free](https://console.groq.com))
- Optional: Supabase account ([sign up](https://supabase.com))

## Step 1: Clone & Install (2 min)

```bash
git clone https://github.com/yourusername/DevJournal.git
cd DevJournal
npm install
```

## Step 2: Get API Keys (2 min)

### Groq API Key (Required)

1. Go to https://console.groq.com
2. Sign in (free account)
3. Click "API Keys"
4. Copy your API key

### Supabase Keys (Optional, for cloud storage)

1. Go to https://supabase.com
2. Create a project
3. Go to Settings → API
4. Copy Project URL and Anon Key

## Step 3: Configure Environment (1 min)

```bash
cp .env.example .env.local
nano .env.local
```

Paste your keys:

```
VITE_GROQ_API_KEY=gsk_your_key_here

# Optional:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_key_here
```

Save and close.

## Step 4: Start Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser. Done! 🎉

## Common Issues

### "Cannot find module" error
```bash
rm -rf node_modules
npm install
npm run dev
```

### API key not working
- Double-check the key is pasted correctly in `.env.local`
- Restart dev server after editing `.env.local`
- Verify key is active on https://console.groq.com

### Blank screen
Check browser console for errors (F12). Most common cause is missing API key.

## Next Steps

- Create an account and write your first entry
- Explore the dashboard and analytics
- Check out [PRODUCTION_README.md](PRODUCTION_README.md) for features
- Read [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to production

## Need Help?

- Check [DEVELOPMENT.md](DEVELOPMENT.md) for development guidelines
- See [Groq Documentation](https://console.groq.com/docs)
- Check [GitHub Issues](https://github.com/yourusername/DevJournal/issues)

---

**Enjoy journaling! 📔**

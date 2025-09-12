# 🔐 Environment Variables Setup Guide

## 📋 Overview

Environment variables are **NOT** stored in GitHub. They are set in:
1. **Local Development**: `.env.local` file (on your computer)
2. **Production**: Vercel Dashboard (in the cloud)

## 🏠 Local Development Setup

### Step 1: Create Local Environment File
```bash
# Copy the example file
cp .env.example .env.local

# Edit with your actual values
# (This file is ignored by Git and won't be uploaded)
```

### Step 2: Your `.env.local` File Should Look Like:
```env
# NextAuth Configuration (REQUIRED)
NEXTAUTH_SECRET=your-actual-secret-key-here-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000

# Database (REQUIRED)
DATABASE_URL="file:./dev.db"

# Email Configuration (Optional - for magic links)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-actual-email@gmail.com
EMAIL_SERVER_PASSWORD=your-actual-app-password
EMAIL_FROM=noreply@localhub.com
```

## ☁️ Production Setup (Vercel)

### Step 1: Deploy to Vercel First
1. Push your code to GitHub
2. Connect GitHub to Vercel
3. Deploy your project

### Step 2: Set Environment Variables in Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. Add each variable:

#### **Required Variables:**
```
Name: DATABASE_URL
Value: postgresql://username:password@host:port/database
Environment: Production, Preview, Development

Name: NEXTAUTH_URL
Value: https://your-project-name.vercel.app
Environment: Production, Preview, Development

Name: NEXTAUTH_SECRET
Value: your-super-secret-key-here-minimum-32-characters
Environment: Production, Preview, Development
```

#### **Email Variables (if using email auth):**
```
Name: EMAIL_SERVER_HOST
Value: smtp.gmail.com
Environment: Production, Preview, Development

Name: EMAIL_SERVER_PORT
Value: 587
Environment: Production, Preview, Development

Name: EMAIL_SERVER_USER
Value: your-email@gmail.com
Environment: Production, Preview, Development

Name: EMAIL_SERVER_PASSWORD
Value: your-gmail-app-password
Environment: Production, Preview, Development

Name: EMAIL_FROM
Value: your-email@gmail.com
Environment: Production, Preview, Development
```

### Step 3: Redeploy After Adding Variables
1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

## 🔒 Security Best Practices

### ✅ DO:
- Use `.env.example` as a template (safe to upload to GitHub)
- Set real values in `.env.local` (local development)
- Set real values in Vercel dashboard (production)
- Use strong, unique secrets
- Keep your `.env.local` file private

### ❌ DON'T:
- Upload `.env` or `.env.local` to GitHub
- Share your actual environment variables
- Use weak or common secrets
- Put secrets in your source code

## 🚀 Complete Workflow

### 1. Development:
```bash
# Create local environment file
cp .env.example .env.local
# Edit .env.local with your values
npm run dev
```

### 2. GitHub Upload:
```bash
git add .
git commit -m "Initial commit"
git push origin main
# .env.local is automatically ignored
```

### 3. Production Deployment:
1. Connect GitHub to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically

## 🆘 Common Issues

### Issue: "Environment variable not found"
**Solution:** Make sure you've set the variable in Vercel dashboard and redeployed

### Issue: "Database connection failed"
**Solution:** Check your `DATABASE_URL` in Vercel matches your production database

### Issue: "Authentication not working"
**Solution:** Verify `NEXTAUTH_URL` matches your Vercel domain exactly

## 📝 Summary

- **GitHub**: Only stores `.env.example` (template)
- **Local**: Use `.env.local` for development
- **Production**: Set variables in Vercel dashboard
- **Security**: Never commit real secrets to Git

Your environment variables are safe and properly configured! 🔐





# 📊 Copy Local Data to Production Database

## 🎯 Goal
Copy your local SQLite data to your production PostgreSQL database so people can see your content.

## 📋 Prerequisites
- ✅ Your app is deployed to Vercel
- ✅ Production database is set up (PostgreSQL)
- ✅ Environment variables are configured in Vercel

## 🔄 Method 1: Using Seed Scripts (Recommended)

### Step 1: Export Your Local Data
```bash
# Run this to see what data you have locally
npx tsx -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function checkData() {
  const deals = await prisma.deal.count();
  const posts = await prisma.post.count();
  const users = await prisma.user.count();
  console.log('Local data:', { deals, posts, users });
  await prisma.$disconnect();
}
checkData();
"
```

### Step 2: Update Production Database Schema
```bash
# Connect to your production database
# Set DATABASE_URL to your production database (include ?pgbouncer=true&connection_limit=1)
npx prisma db push
```

### Step 3: Seed Production Database
```bash
# This will create the same data in production
npx tsx prisma/seed-users-with-passwords.ts
npx tsx prisma/seed-platforms.ts
npx tsx prisma/seed-news.ts
npx tsx prisma/seed-deals.ts
```

## 🔄 Method 2: Manual Data Export/Import

### Step 1: Export Local Data to JSON
```bash
# Create export script
npx tsx -e "
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

async function exportData() {
  const data = {
    deals: await prisma.deal.findMany(),
    posts: await prisma.post.findMany(),
    users: await prisma.user.findMany(),
    platforms: await prisma.platform.findMany()
  };
  
  fs.writeFileSync('exported-data.json', JSON.stringify(data, null, 2));
  console.log('Data exported to exported-data.json');
  await prisma.$disconnect();
}
exportData();
"
```

### Step 2: Import to Production
```bash
# Set your production DATABASE_URL (include ?pgbouncer=true&connection_limit=1)
# Then run import script
npx tsx -e "
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();

async function importData() {
  const data = JSON.parse(fs.readFileSync('exported-data.json', 'utf8'));
  
  // Import platforms first
  for (const platform of data.platforms) {
    await prisma.platform.upsert({
      where: { id: platform.id },
      update: platform,
      create: platform
    });
  }
  
  // Import users
  for (const user of data.users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: user,
      create: user
    });
  }
  
  // Import deals
  for (const deal of data.deals) {
    await prisma.deal.upsert({
      where: { id: deal.id },
      update: deal,
      create: deal
    });
  }
  
  // Import posts
  for (const post of data.posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: post,
      create: post
    });
  }
  
  console.log('Data imported successfully!');
  await prisma.$disconnect();
}
importData();
"
```

## 🔄 Method 3: Direct Database Migration

### Step 1: Install Database Migration Tool
```bash
npm install -g @prisma/migrate
```

### Step 2: Create Migration
```bash
# This creates a migration file
npx prisma migrate dev --name copy-local-data
```

### Step 3: Apply to Production
```bash
# Set production DATABASE_URL (include ?pgbouncer=true&connection_limit=1)
npx prisma migrate deploy
```

## 🚀 Quick Setup Script

Create this script to automate the process:

```bash
# save as copy-to-production.sh
#!/bin/bash

echo "🔄 Copying local data to production..."

# Check if production DATABASE_URL is set (should include ?pgbouncer=true&connection_limit=1)
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Please set DATABASE_URL to your production database with ?pgbouncer=true&connection_limit=1"
  exit 1
fi

# Push schema to production
echo "📊 Pushing schema to production database..."
npx prisma db push

# Seed with your data
echo "🌱 Seeding production database..."
npx tsx prisma/seed-users-with-passwords.ts
npx tsx prisma/seed-platforms.ts
npx tsx prisma/seed-news.ts
npx tsx prisma/seed-deals.ts

echo "✅ Data copied to production successfully!"
echo "🌐 Your app is now live with your data at: https://your-app.vercel.app"
```

## 🎯 What Gets Copied

- ✅ **Deals**: All your product deals with images and affiliate links
- ✅ **News**: All your news articles with rich content
- ✅ **Users**: Admin and demo users for testing
- ✅ **Platforms**: Amazon, Flipkart, etc. platform data
- ✅ **Clicks**: Analytics data (if any)

## 🔍 Verify Data is Copied

After copying, check your production app:
1. Go to `https://your-app.vercel.app`
2. Check the deals page
3. Check the news page
4. Sign in with admin credentials
5. Verify all your content is there

## 🆘 Troubleshooting

### Issue: "Database connection failed"
**Solution**: Make sure your production `DATABASE_URL` is correct and includes `?pgbouncer=true&connection_limit=1`

### Issue: "Data not showing"
**Solution**: Check if the seed scripts ran successfully

### Issue: "Images not loading"
**Solution**: Make sure image URLs are accessible from production

## 📝 Summary

1. **Deploy your app** to Vercel first
2. **Set up production database** (PostgreSQL)
3. **Copy your local data** using seed scripts
4. **Verify** your content is live
5. **Share** your live app with people!

Your local data will now be visible to everyone on your live website! 🎉


# Fix Vercel Environment Variables

## Current Issues:
1. `NEXTAUTH_URL` has an extra `@` symbol
2. Database connection is failing

## Steps to Fix:

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project: `localhub` or similar
- Go to Settings → Environment Variables

### 2. Update Environment Variables

**Current (WRONG):**
```
NEXTAUTH_URL@https://www.localhub.space/
```

**Should be (CORRECT):**
```
NEXTAUTH_URL=https://www.localhub.space/
```

### 3. Complete Environment Variables List

Make sure you have these exact variables:

```bash
DATABASE_URL=postgresql://postgres.hhcovjrhmmyogyzwucoq:Krishna%40123@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=disable&pgbouncer=true&connect_timeout=30

DIRECT_URL=postgresql://postgres:Krishna%40123@db.hhcovjrhmmyogyzwucoq.supabase.co:5432/postgres?sslmode=disable&connect_timeout=30

NEXTAUTH_URL=https://www.localhub.space/

NEXTAUTH_SECRET=govandi-hub-secret-key-2025
```

### 4. After Updating
1. Save the environment variables
2. Redeploy your project
3. The database connection should work

### 5. Alternative: Use Vercel CLI
If you prefer command line:

```bash
# Remove the wrong one
vercel env rm NEXTAUTH_URL

# Add the correct one
vercel env add NEXTAUTH_URL
# Enter: https://www.localhub.space/

# Redeploy
vercel --prod
```

## Expected Result:
- Database connection should work
- No more "Can't reach database server" errors
- Your WhatsApp integration should work properly

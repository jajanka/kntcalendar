# Supabase Setup Guide for kuntcalend.ar

This guide will help you fix the 401 unauthorized errors and get your app working properly.

## 🔧 **Step 1: Fix Authentication Issues**

### **Problem**: 401 Unauthorized when posting to `/rest/v1/entries`

**Root Cause**: The app was using an unauthenticated Supabase client for database operations.

**Solution**: ✅ **FIXED** - Updated the code to use authenticated clients.

## 🔧 **Step 2: Configure Supabase Authentication**

### **2.1 Enable Email Authentication**

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Providers**
3. Make sure **Email** is enabled
4. **Optional**: Disable "Confirm email" for easier testing:
   - Go to **Authentication** → **Settings**
   - Turn off "Enable email confirmations"

### **2.2 Configure OAuth Providers (Optional)**

#### **Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set **Authorized redirect URIs** to:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
6. Copy **Client ID** and **Client Secret**
7. In Supabase Dashboard → **Authentication** → **Providers** → **Google**:
   - Toggle **Enable**
   - Add your **Client ID** and **Client Secret**

#### **GitHub OAuth:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Set **Authorization callback URL** to:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
4. Copy **Client ID** and **Client Secret**
5. In Supabase Dashboard → **Authentication** → **Providers** → **GitHub**:
   - Toggle **Enable**
   - Add your **Client ID** and **Client Secret**

## 🔧 **Step 3: Set Up Database Schema**

### **3.1 Run the Migration**

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the SQL from `supabase/migrations/20240101000000_initial_schema.sql`
4. Click **Run**

### **3.2 Verify RLS Policies**

Make sure these policies are created:

```sql
-- Users can only view own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Users can view own entries
CREATE POLICY "Users can view own entries" ON public.entries
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert own entries
CREATE POLICY "Users can insert own entries" ON public.entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update own entries
CREATE POLICY "Users can update own entries" ON public.entries
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete own entries
CREATE POLICY "Users can delete own entries" ON public.entries
    FOR DELETE USING (auth.uid() = user_id);
```

## 🔧 **Step 4: Environment Variables**

Make sure your `.env.local` has the correct values:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

## 🔧 **Step 5: Test the Setup**

### **5.1 Test Email Authentication**

1. Start your app: `npm run dev`
2. Click **"Sign In"** in the header
3. Choose **"Don't have an account? Sign Up"**
4. Enter your email and password
5. If email confirmation is enabled, check your email
6. Sign in and try to add a calendar entry

### **5.2 Test OAuth (if configured)**

1. Click **"Sign In"** in the header
2. Click **"Continue with Google"** or **"Continue with GitHub"**
3. Complete the OAuth flow
4. Try to add a calendar entry

### **5.3 Debug Authentication**

Open your browser's developer console and look for:
- Authentication state changes
- User ID when signed in
- Any error messages

## 🔧 **Step 6: Common Issues & Solutions**

### **Issue 1: "User not authenticated" error**
**Solution**: Make sure you're signed in. Check the browser console for authentication logs.

### **Issue 2: 401 Unauthorized on API calls**
**Solution**: The user session might have expired. Try signing out and back in.

### **Issue 3: OAuth providers not working**
**Solution**: 
1. Check that providers are enabled in Supabase Dashboard
2. Verify redirect URIs are correct
3. Check that Client ID and Secret are properly configured

### **Issue 4: Email confirmation required**
**Solution**: 
1. Check your email (including spam folder)
2. Or disable email confirmation in Supabase Dashboard for testing

### **Issue 5: RLS policies blocking access**
**Solution**: 
1. Verify the migration SQL was run successfully
2. Check that RLS is enabled on tables
3. Verify policies are created correctly

## 🔧 **Step 7: Production Deployment**

### **7.1 Update OAuth Redirect URIs**

When deploying to production, update your OAuth redirect URIs:

**Google OAuth:**
```
https://your-domain.vercel.app/api/auth/supabase
```

**GitHub OAuth:**
```
https://your-domain.vercel.app/api/auth/supabase
```

### **7.2 Environment Variables**

Set these in your production environment:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ✅ **Verification Checklist**

- [ ] Email authentication works
- [ ] OAuth providers configured (optional)
- [ ] Database schema created
- [ ] RLS policies in place
- [ ] Environment variables set
- [ ] Can sign up and sign in
- [ ] Can add calendar entries
- [ ] No 401 errors in console

## 🆘 **Need Help?**

If you're still getting 401 errors:

1. **Check the browser console** for detailed error messages
2. **Verify your Supabase project URL** and anon key
3. **Make sure you're signed in** before trying to save entries
4. **Check that RLS policies are created** in your database
5. **Try signing out and back in** to refresh the session

The app now includes detailed logging to help debug authentication issues. Check the browser console for helpful messages! 
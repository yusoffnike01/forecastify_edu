# Quick Fix: Admin Session Preservation

## Problem
When you create a new user (like "tengkuyusoff"), it automatically logs you in as that user instead of keeping you logged in as the admin.

## Solution
You need to deploy Firebase Cloud Functions to fix this issue properly.

## Quick Deployment Steps

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. Deploy Cloud Functions
```bash
cd /Users/tengkuyusofftengkuibrahimshukrillah/freelance/forecastify
firebase deploy --only functions
```

### 3. Set Admin Claims (First Time Only)
```bash
# Go to Firebase Console > Authentication > Users
# Click on your admin user
# Go to "Custom Claims" tab
# Add: {"admin": true}
```

## What This Fixes
- ✅ Admin stays logged in when creating new users
- ✅ New users are created without affecting current session
- ✅ No more automatic login as newly created user

## Alternative Quick Fix (Temporary)
If you can't deploy Cloud Functions right now, here's a temporary workaround:

1. **Before creating a user**: Take note of your admin email
2. **Create the user** (you'll be logged out)
3. **Log back in** with your admin credentials
4. **Continue working** as normal

## Why This Happens
Firebase's `createUserWithEmailAndPassword` automatically signs in the newly created user. This is Firebase's default behavior and can only be bypassed using:
- Firebase Admin SDK (Cloud Functions) ✅ **Recommended**
- Complex session restoration (unreliable)

## Verification
After deploying Cloud Functions:
1. Login as admin
2. Create a new user
3. Check that you're still logged in as admin
4. ✅ Success!

## Need Help?
If deployment fails, check:
- Firebase CLI is installed: `firebase --version`
- You're logged in: `firebase login`
- Project is initialized: `firebase list`
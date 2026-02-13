# Setup Guide

## Prerequisites
- Node.js 18+ installed
- Firebase account
- Flutterwave account (test/live)
- Git

## Step 1: Clone & Install
```bash
git clone <repository-url>
cd collective-advantage
npm install
```

## Step 2: Firebase Setup

### Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Name it "collective-advantage" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Enable Authentication
1. In Firebase Console, go to Authentication
2. Click "Get started"
3. Enable "Email/Password" provider
4. Enable "Google" provider (add your app domain)

### Create Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Start in "production mode"
4. Choose location (us-central1 recommended)

### Deploy Security Rules
```bash
npm install -g firebase-tools
firebase login
firebase init firestore
# Select existing project
# Use default files (firestore.rules, firestore.indexes.json)
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

### Get Firebase Credentials
1. Project Settings > General
2. Copy Web API Key, Project ID, etc.
3. Project Settings > Service Accounts
4. Click "Generate new private key"
5. Download JSON file (keep secure!)

## Step 3: Flutterwave Setup

1. Sign up at https://flutterwave.com/ug
2. Verify your account
3. Go to Settings > API
4. Copy Public Key (FLWPUBK_TEST-...)
5. Copy Secret Key (FLWSECK_TEST-...)

## Step 4: Environment Variables

Create `.env.local`:
```bash
# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=collective-advantage.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=collective-advantage
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=collective-advantage.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin - Paste ENTIRE service account JSON as one line
FIREBASE_ADMIN_SDK_KEY={"type":"service_account","project_id":"..."}

# Flutterwave
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-xxxxx
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-xxxxx

# Admin UIDs (add your Firebase user UID after signup)
ADMIN_UIDS=

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 5: First Admin User

1. Start dev server: `npm run dev`
2. Sign up at http://localhost:3000/signup
3. Check Firebase Console > Authentication for your UID
4. Go to Firestore > users > [your-uid]
5. Add field: `is_admin: true`
6. OR add your UID to `.env.local` ADMIN_UIDS

## Step 6: Test Payments

### Flutterwave Test Cards
```
Card: 4187427415564246
CVV: 828
Expiry: 09/32
PIN: 3310
OTP: 12345
```

### MTN MoMo Test
```
Number: 256772000000
```

## Step 7: Webhook Configuration

### Development (ngrok)
```bash
ngrok http 3000
# Copy HTTPS URL: https://abc123.ngrok.io
```

### Flutterwave Webhook
1. Go to Flutterwave Settings > Webhooks
2. Set URL: `https://abc123.ngrok.io/api/webhooks/flutterwave`
3. OR for production: `https://yourdomain.com/api/webhooks/flutterwave`

## Step 8: Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel
# Follow prompts
```

### Add Environment Variables in Vercel
1. Go to Vercel Dashboard > Settings > Environment Variables
2. Add ALL variables from `.env.local`
3. Deploy: `vercel --prod`

### Update Flutterwave Webhook
Update webhook URL to production domain

## Verification Checklist

- [ ] Firebase project created
- [ ] Authentication enabled (Email + Google)
- [ ] Firestore database created
- [ ] Security rules deployed
- [ ] Service account key downloaded
- [ ] Flutterwave account created
- [ ] Environment variables configured
- [ ] First admin user created
- [ ] Test payment completed
- [ ] Webhook configured
- [ ] Deployed to Vercel

## Common Issues

### "Permission denied" in Firestore
- Check security rules are deployed
- Verify user is authenticated
- Check admin status in user document

### Webhook not working
- Verify signature verification
- Check Flutterwave webhook URL is correct
- Use ngrok for local testing
- Check server logs for errors

### Payment not updating user status
- Check webhook received successfully
- Verify tx_ref is unique
- Check Firestore for transaction record
- Look for errors in server logs

## Support
For issues, check logs:
- Browser console (client errors)
- Terminal/Vercel logs (server errors)
- Firebase Console > Firestore (data issues)

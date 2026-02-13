# Collective Advantage

Fractional Investment & Savings Platform for Uganda

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Firebase (Auth + Firestore)
- Flutterwave Payments

## Setup

### 1. Firebase Project
1. Create project at https://console.firebase.google.com
2. Enable Authentication (Email/Password + Google)
3. Create Firestore database
4. Deploy security rules: `firebase deploy --only firestore:rules`
5. Generate service account key (Project Settings > Service Accounts)

### 2. Flutterwave
1. Sign up at https://flutterwave.com
2. Get API keys from Settings > API

### 3. Environment Variables
Copy `.env.example` to `.env.local` and fill in:
```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (paste entire service account JSON)
FIREBASE_ADMIN_SDK_KEY={"type":"service_account"...}

# Flutterwave
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-

# Admin UIDs (comma-separated)
ADMIN_UIDS=your-firebase-uid

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Install & Run
```bash
npm install
npm run dev
```

### 5. Webhook Configuration
Set Flutterwave webhook URL to: `https://yourdomain.com/api/webhooks/flutterwave`

## Deployment (Vercel)
```bash
vercel --prod
```

Add all environment variables in Vercel dashboard.

## Features
- Email/Google authentication
- Referral system (10% bonus)
- Project marketplace
- Investment tracking
- Admin panel
- Mobile-first UI
- Dark mode support

## Security
- Firestore rules enforce data access
- Webhook signature verification
- Server-side payment validation
- Token-based API authentication

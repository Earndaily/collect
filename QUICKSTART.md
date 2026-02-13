# Quick Start (5 minutes)

## 1. Install Dependencies
```bash
npm install
```

## 2. Firebase Setup (2 min)
```bash
# Create project at https://console.firebase.google.com
# Enable Email/Password + Google Auth
# Create Firestore database
# Download service account key
```

## 3. Flutterwave Setup (1 min)
```bash
# Sign up at https://flutterwave.com/ug
# Get test API keys from Settings > API
```

## 4. Environment Variables (1 min)
```bash
cp .env.example .env.local
# Fill in Firebase + Flutterwave credentials
```

## 5. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

## 6. Create First Admin
```bash
# Sign up at http://localhost:3000/signup
# Get your UID from Firebase Console > Authentication
# Add to Firestore: users/[uid] > is_admin: true
```

## 7. Test Payment (ngrok required)
```bash
# Terminal 1
npm run dev

# Terminal 2
ngrok http 3000
# Copy https URL to Flutterwave webhook settings

# Use test card:
# 4187427415564246, CVV: 828, Expiry: 09/32
```

## Deploy to Production
```bash
vercel --prod
# Add environment variables in Vercel dashboard
# Update Flutterwave webhook to production URL
```

Done! 🚀

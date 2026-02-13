# Production Deployment Checklist

## Pre-Deployment

### Firebase
- [ ] Production Firebase project created
- [ ] Authentication providers enabled (Email/Password, Google)
- [ ] Firestore database created in production mode
- [ ] Security rules deployed (`firebase deploy --only firestore:rules`)
- [ ] Indexes deployed (`firebase deploy --only firestore:indexes`)
- [ ] Service account key generated and secured
- [ ] Firebase project billing enabled (if needed)

### Flutterwave
- [ ] Production Flutterwave account verified
- [ ] Business KYC completed
- [ ] Live API keys obtained
- [ ] Settlement account configured
- [ ] Webhook URL configured (will update after Vercel deploy)

### Code
- [ ] All environment variables documented
- [ ] TypeScript errors fixed (`npm run build`)
- [ ] ESLint warnings addressed
- [ ] Test payments verified in development
- [ ] Admin panel tested
- [ ] Referral system tested
- [ ] Investment flow tested end-to-end

## Deployment

### Vercel Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Environment Variables in Vercel
Add these in Vercel Dashboard > Settings > Environment Variables:

```
Production Values:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- FIREBASE_ADMIN_SDK_KEY (entire JSON as string)
- NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY (live key)
- FLUTTERWAVE_SECRET_KEY (live secret)
- ADMIN_UIDS (comma-separated production admin UIDs)
- NEXT_PUBLIC_APP_URL (https://yourdomain.com)
```

### Post-Deployment

- [ ] Update Flutterwave webhook to: `https://yourdomain.com/api/webhooks/flutterwave`
- [ ] Test signup flow in production
- [ ] Test Google OAuth
- [ ] Test activation payment with real money (small amount)
- [ ] Verify webhook receives payment events
- [ ] Test referral link generation
- [ ] Test investment payment
- [ ] Verify admin panel access
- [ ] Check all API routes return correct responses
- [ ] Test mobile responsiveness on real devices
- [ ] Configure custom domain (optional)

## Security

- [ ] Environment variables not committed to Git
- [ ] Firebase service account key secured
- [ ] Firestore security rules tested
- [ ] API routes require authentication where needed
- [ ] Admin-only routes properly protected
- [ ] Webhook signature verification working
- [ ] HTTPS enforced on all routes
- [ ] No sensitive data in client-side code
- [ ] Error messages don't leak sensitive info

## Monitoring

- [ ] Vercel analytics enabled
- [ ] Firebase Console monitoring setup
- [ ] Error tracking configured
- [ ] Payment success/failure logs reviewed
- [ ] Set up alerts for failed webhooks

## User Acceptance

- [ ] Create test admin account
- [ ] Create test user account
- [ ] Complete full user journey:
  - [ ] Signup with referral link
  - [ ] Pay activation fee
  - [ ] Browse projects
  - [ ] Make investment
  - [ ] Check dashboard
  - [ ] Verify referral bonus credited
- [ ] Test on multiple browsers (Chrome, Safari, Firefox)
- [ ] Test on iOS and Android devices

## Go Live

- [ ] Announce launch
- [ ] Monitor first transactions closely
- [ ] Have rollback plan ready
- [ ] Support channels ready (email, phone)
- [ ] User documentation available

## Post-Launch (First Week)

- [ ] Daily monitoring of transactions
- [ ] Check webhook success rate
- [ ] Review user feedback
- [ ] Monitor Firebase usage and costs
- [ ] Check Flutterwave settlement
- [ ] Address any bugs immediately

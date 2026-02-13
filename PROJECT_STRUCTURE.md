# Project Structure

```
collective-advantage/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── api/                      # API Routes
│   │   │   ├── investments/          # User investments API
│   │   │   │   └── route.ts
│   │   │   ├── projects/             # Projects CRUD API
│   │   │   │   └── route.ts
│   │   │   ├── referrals/            # Referral stats API
│   │   │   │   └── route.ts
│   │   │   ├── transactions/         # Transaction history API
│   │   │   │   └── route.ts
│   │   │   ├── users/
│   │   │   │   └── create/           # User creation API
│   │   │   │       └── route.ts
│   │   │   └── webhooks/
│   │   │       └── flutterwave/      # Payment webhook handler
│   │   │           └── route.ts
│   │   ├── admin/                    # Admin panel page
│   │   │   └── page.tsx
│   │   ├── dashboard/                # User dashboard
│   │   │   └── page.tsx
│   │   ├── login/                    # Login page
│   │   │   └── page.tsx
│   │   ├── pay-activation/           # Activation payment page
│   │   │   └── page.tsx
│   │   ├── projects/                 # Projects marketplace
│   │   │   └── page.tsx
│   │   ├── signup/                   # Signup page
│   │   │   └── page.tsx
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   ├── components/                   # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Loading.tsx
│   │   ├── Modal.tsx
│   │   ├── Navbar.tsx
│   │   ├── Payment.tsx               # Flutterwave integration
│   │   ├── ProjectCard.tsx
│   │   └── Toast.tsx
│   ├── contexts/                     # React contexts
│   │   └── AuthContext.tsx           # Authentication context
│   ├── hooks/                        # Custom React hooks
│   │   └── useProtectedRoute.ts
│   ├── lib/                          # Utilities and configs
│   │   ├── api-utils.ts              # API auth helpers
│   │   ├── constants.ts              # App constants
│   │   ├── firebase-admin.ts         # Firebase Admin SDK
│   │   └── firebase.ts               # Firebase client SDK
│   └── types/                        # TypeScript types
│       └── index.ts
├── .env.example                      # Environment variables template
├── .eslintrc.json                    # ESLint config
├── .gitignore                        # Git ignore rules
├── DEPLOYMENT.md                     # Deployment checklist
├── firebase.json                     # Firebase config
├── firestore.indexes.json            # Firestore indexes
├── firestore.rules                   # Security rules
├── next.config.js                    # Next.js config
├── package.json                      # Dependencies
├── postcss.config.js                 # PostCSS config
├── QUICKSTART.md                     # Quick start guide
├── README.md                         # Main documentation
├── SETUP.md                          # Detailed setup guide
├── tailwind.config.js                # Tailwind config
├── tsconfig.json                     # TypeScript config
└── vercel.json                       # Vercel deployment config

## Key Files

### Configuration
- `package.json` - All dependencies and scripts
- `tsconfig.json` - TypeScript strict mode config
- `tailwind.config.js` - Tailwind theme with dark mode
- `next.config.js` - Next.js configuration
- `firebase.json` - Firebase project config
- `firestore.rules` - Database security rules
- `firestore.indexes.json` - Query optimization indexes

### Authentication
- `src/contexts/AuthContext.tsx` - Global auth state management
- `src/lib/firebase.ts` - Client-side Firebase
- `src/lib/firebase-admin.ts` - Server-side Firebase
- `src/hooks/useProtectedRoute.ts` - Route protection

### API Routes
- `src/app/api/users/create/route.ts` - Create user document
- `src/app/api/webhooks/flutterwave/route.ts` - Payment webhook (CRITICAL)
- `src/app/api/projects/route.ts` - CRUD for projects
- `src/app/api/investments/route.ts` - User investments
- `src/app/api/transactions/route.ts` - Transaction history
- `src/app/api/referrals/route.ts` - Referral stats

### Pages
- `src/app/page.tsx` - Landing page
- `src/app/signup/page.tsx` - Registration with referral
- `src/app/login/page.tsx` - Login page
- `src/app/pay-activation/page.tsx` - Activation payment
- `src/app/dashboard/page.tsx` - User dashboard
- `src/app/projects/page.tsx` - Investment marketplace
- `src/app/admin/page.tsx` - Admin panel

### Components
- `src/components/Payment.tsx` - Flutterwave integration
- `src/components/ProjectCard.tsx` - Project display
- `src/components/Navbar.tsx` - Navigation
- `src/components/Modal.tsx` - Modal dialogs
- `src/components/Button.tsx` - Styled button
- `src/components/Card.tsx` - Card container

### Utilities
- `src/lib/api-utils.ts` - Auth verification helpers
- `src/lib/constants.ts` - App-wide constants
- `src/types/index.ts` - TypeScript interfaces

## Database Schema

### Collections
1. **users** - User accounts
2. **projects** - Investment projects
3. **transactions** - Payment records
4. **user_investments** - User-project relationships

## Security Features

1. Firestore Security Rules - Server-enforced access control
2. API Token Verification - All protected routes verify JWT
3. Webhook Signature - Flutterwave payment verification
4. Admin Role Checks - Server-side admin validation
5. Input Validation - Type checking on all API routes

## Payment Flow

1. User pays via Flutterwave inline checkout
2. Flutterwave sends webhook to `/api/webhooks/flutterwave`
3. Server verifies webhook signature
4. Server checks for duplicate transaction
5. Server updates user status / creates investment
6. Server credits referral bonus if applicable
7. Transaction recorded in Firestore

## Key Features Implemented

✅ Email/Password + Google OAuth
✅ Referral system (10% bonus)
✅ Registration fee (20,000 UGX)
✅ Project marketplace
✅ Investment tracking
✅ Admin panel
✅ Flutterwave integration
✅ Mobile-first responsive UI
✅ Dark mode support
✅ Firestore security rules
✅ Webhook handling
✅ Transaction history
✅ Referral stats
✅ Portfolio dashboard

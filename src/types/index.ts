export interface User {
  uid: string;
  email: string;
  phone: string | null;
  referrer_uid: string | null;
  is_active: boolean;
  wallet_balance: number;
  joined_at: number;
  is_admin?: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  target_amount: number;
  amount_raised: number;
  slots_available: number;
  slot_price: number;
  roi_percentage: number;
  status: 'open' | 'closed';
  created_at: number;
  admin_verified: boolean;
  image_url?: string;
}

export interface Transaction {
  id?: string;
  tx_ref: string;
  user_uid: string;
  amount: number;
  payment_type: 'reg_fee' | 'investment' | 'referral_bonus' | 'dividend';
  status: 'completed' | 'pending' | 'failed';
  created_at: number;
  flutterwave_id?: string;
  project_id?: string;
}

export interface UserInvestment {
  id?: string;
  user_uid: string;
  project_id: string;
  slots_owned: number;
  investment_date: number;
  status: 'active' | 'completed' | 'cancelled';
  total_invested: number;
}

export interface ReferralBonus {
  id?: string;
  referrer_uid: string;
  referred_uid: string;
  amount: number;
  created_at: number;
  status: 'credited';
}

export interface PaymentMetadata {
  user_uid: string;
  payment_type: 'reg_fee' | 'investment';
  project_id?: string;
  slots?: number;
  referrer_uid?: string;
}

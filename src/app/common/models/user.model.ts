export interface UserProfile {
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
}

export interface UserWallet {
  id: string;
  currency: string;
  balance: number;
}

// Added for KYC status tracking
export interface UserKyc {
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  level: number;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'investor';
  is_verified: boolean;
  created_at: string;
  full_name: string;     // Matches backend mapping
  profile: UserProfile | null;
  wallet?: UserWallet;    // Optional if not fetched in list
  kyc?: UserKyc | null;  // Matches backend mapping
}

export interface LoginResponse {
  access_token: string;
  user: User; // Changed from any to User for better type safety
}
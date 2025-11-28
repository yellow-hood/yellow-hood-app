export type User = {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  theme: string;
  vitrin_connected: boolean;
  vitrin_user_id?: string;
};

export type Transaction = {
  id: string;
  type: "reward" | "swap" | "system";
  amount: number;
  source?: string;
  status: string;
  date: Date;
};

export type Game = {
  id: string;
  title: string;
  thumbnail_url: string;
  category: string;
  external_url: string;
};

export type Wallet = {
  id: string;
  user_id: string;
  balance: number;
};

export type Session = {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
};


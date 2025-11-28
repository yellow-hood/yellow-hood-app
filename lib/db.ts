import type { User, Wallet, Session, Transaction } from "@/types";

// Define the database structure
interface Database {
  users: User[];
  wallets: Wallet[];
  sessions: Session[];
  transactions: Transaction[];
}

// Singleton pattern using globalThis to persist data during hot-reload
const globalForDb = globalThis as unknown as {
  db: Database | undefined;
};

// Initialize the database if it doesn't exist
if (!globalForDb.db) {
  globalForDb.db = {
    users: [],
    wallets: [],
    sessions: [],
    transactions: [],
  };
}

const db = globalForDb.db;

// Helper function to generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// User functions
export function findUser(email?: string, id?: string): User | undefined {
  if (id) {
    return db.users.find((user) => user.id === id);
  }
  if (email) {
    return db.users.find((user) => user.email === email);
  }
  return undefined;
}

export function createUser(userData: Omit<User, "id">): User {
  const newUser: User = {
    id: generateId(),
    ...userData,
  };
  db.users.push(newUser);

  // Create a wallet for the new user
  const newWallet: Wallet = {
    id: generateId(),
    user_id: newUser.id,
    balance: 0,
  };
  db.wallets.push(newWallet);

  return newUser;
}

// Session functions
export function createSession(userId: string, token: string, expiresInHours: number = 24): Session {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  const newSession: Session = {
    id: generateId(),
    user_id: userId,
    token,
    expires_at: expiresAt,
    created_at: new Date(),
  };

  db.sessions.push(newSession);
  return newSession;
}

export function findSession(token: string): Session | undefined {
  const session = db.sessions.find((s) => s.token === token);
  
  // Check if session is expired
  if (session && session.expires_at < new Date()) {
    // Remove expired session
    db.sessions = db.sessions.filter((s) => s.id !== session.id);
    return undefined;
  }
  
  return session;
}

// Wallet functions
export function getWallet(userId: string): Wallet | undefined {
  return db.wallets.find((wallet) => wallet.user_id === userId);
}

export function updateBalance(userId: string, amount: number): Wallet | null {
  const wallet = getWallet(userId);
  if (!wallet) {
    return null;
  }

  wallet.balance += amount;
  return wallet;
}

// Transaction functions
export function addTransaction(
  userId: string,
  transactionData: Omit<Transaction, "id" | "date">
): Transaction {
  const newTransaction: Transaction = {
    id: generateId(),
    date: new Date(),
    ...transactionData,
  };

  db.transactions.push(newTransaction);
  return newTransaction;
}

export function getTransactions(userId: string): Transaction[] {
  // Assuming transactions are linked to users via wallet or user_id
  // You may need to adjust this based on your transaction structure
  return db.transactions.filter((tx) => {
    // This is a placeholder - adjust based on how transactions are linked to users
    return true; // For now, return all transactions
  });
}

// Export the database for direct access if needed (use with caution)
export function getDb(): Database {
  return db;
}


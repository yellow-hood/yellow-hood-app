import type { User, Wallet, Session, Transaction } from "@/types";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

// User functions
export async function findUser(email?: string, id?: string): Promise<User | undefined> {
  if (id) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { wallet: true },
    });
    if (!user) return undefined;
    return mapPrismaUserToUser(user);
  }
  if (email) {
    // Normalize email to lowercase for case-insensitive lookup
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: { wallet: true },
    });
    if (!user) return undefined;
    return mapPrismaUserToUser(user);
  }
  return undefined;
}

export async function findUserByVitrinId(vitrinUserId: string): Promise<User | undefined> {
  const user = await prisma.user.findFirst({
    where: { vitrin_user_id: vitrinUserId },
    include: { wallet: true },
  });
  if (!user) return undefined;
  return mapPrismaUserToUser(user);
}

export async function createUser(
  userData: Omit<User, "id">,
  password: string
): Promise<User> {
  // Create user with wallet in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create user
    const newUser = await tx.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        avatar_url: userData.avatar_url,
        theme: userData.theme,
        vitrin_connected: userData.vitrin_connected,
        vitrin_user_id: userData.vitrin_user_id,
        password: await bcrypt.hash(password, 10), // bcryptjs: hash before storing
      },
    });

    // Create wallet for the user
    await tx.wallet.create({
      data: {
        user_id: newUser.id,
        balance: 0,
      },
    });

    return newUser;
  });

  // Fetch the created user with wallet
  const user = await prisma.user.findUnique({
    where: { id: result.id },
    include: { wallet: true },
  });

  if (!user) throw new Error("Failed to create user");
  return mapPrismaUserToUser(user);
}

export async function verifyPassword(userId: string, password: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });
  if (!user) {
    console.error("User not found for password verification");
    return false;
  }

  // Check if password is already a bcrypt-style hash (starts with $2a$, $2b$, or $2y$)
  const isBcryptHash = /^\$2[aby]\$/.test(user.password);

  if (isBcryptHash) {
    // Compare password with stored hash (bcryptjs compatible with bcrypt hashes)
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.error("Password comparison failed for user:", userId);
    }
    return isValid;
  } else {
    // Legacy plain text password (for backward compatibility)
    // In production, you should migrate all plain text passwords to hashed
    console.warn("Using plain text password comparison for user:", userId);
    return user.password === password;
  }
}

export async function updateUser(
  userId: string,
  updates: Partial<Omit<User, "id">>
): Promise<User | null> {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      email: updates.email,
      username: updates.username,
      avatar_url: updates.avatar_url,
      theme: updates.theme,
      vitrin_connected: updates.vitrin_connected,
      vitrin_user_id: updates.vitrin_user_id,
    },
    include: { wallet: true },
  });
  return mapPrismaUserToUser(updatedUser);
}

// Session functions
export async function createSession(
  userId: string,
  token: string,
  expiresInHours: number = 24
): Promise<Session> {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  const newSession = await prisma.session.create({
    data: {
      user_id: userId,
      token,
      expires_at: expiresAt,
    },
  });

  return mapPrismaSessionToSession(newSession);
}

export async function findSession(token: string): Promise<Session | undefined> {
  const session = await prisma.session.findUnique({
    where: { token },
  });

  if (!session) return undefined;

  // Check if session is expired
  if (session.expires_at < new Date()) {
    // Remove expired session
    await prisma.session.delete({
      where: { id: session.id },
    });
    return undefined;
  }

  return mapPrismaSessionToSession(session);
}

export async function deleteSession(token: string): Promise<boolean> {
  const result = await prisma.session.deleteMany({
    where: { token },
  });
  return result.count > 0;
}

// Wallet functions
export async function getWallet(userId: string): Promise<Wallet | undefined> {
  const wallet = await prisma.wallet.findUnique({
    where: { user_id: userId },
  });
  if (!wallet) return undefined;
  return mapPrismaWalletToWallet(wallet);
}

export async function updateBalance(userId: string, amount: number): Promise<Wallet | null> {
  const wallet = await prisma.wallet.update({
    where: { user_id: userId },
    data: {
      balance: {
        increment: amount,
      },
    },
  });
  return mapPrismaWalletToWallet(wallet);
}

// Transaction functions
export async function addTransaction(
  userId: string,
  transactionData: Omit<Transaction, "id" | "date">
): Promise<Transaction> {
  const newTransaction = await prisma.transaction.create({
    data: {
      user_id: userId,
      type: transactionData.type,
      amount: transactionData.amount,
      source: transactionData.source,
      status: transactionData.status,
      date: new Date(),
    },
  });

  return mapPrismaTransactionToTransaction(newTransaction);
}

export async function getTransactions(userId: string): Promise<Transaction[]> {
  const transactions = await prisma.transaction.findMany({
    where: { user_id: userId },
    orderBy: { date: "desc" },
  });

  return transactions.map(mapPrismaTransactionToTransaction);
}

// Helper functions to map Prisma types to application types
function mapPrismaUserToUser(user: any): User {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    avatar_url: user.avatar_url,
    theme: user.theme,
    vitrin_connected: user.vitrin_connected,
    vitrin_user_id: user.vitrin_user_id || undefined,
  };
}

function mapPrismaWalletToWallet(wallet: any): Wallet {
  return {
    id: wallet.id,
    user_id: wallet.user_id,
    balance: wallet.balance,
  };
}

function mapPrismaSessionToSession(session: any): Session {
  return {
    id: session.id,
    user_id: session.user_id,
    token: session.token,
    expires_at: session.expires_at,
    created_at: session.created_at,
  };
}

function mapPrismaTransactionToTransaction(transaction: any): Transaction {
  return {
    id: transaction.id,
    type: transaction.type as "reward" | "swap" | "system",
    amount: transaction.amount,
    source: transaction.source || undefined,
    status: transaction.status,
    date: transaction.date,
  };
}

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getWallet, updateBalance, addTransaction } from "@/lib/db";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";

// Simulate external Vit-Rin API call
async function simulateVitrinSwap(
  userId: string,
  amount: number
): Promise<{ success: boolean; error?: string }> {
  // Simulate 1 second wait
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate random success/failure (90% success rate for testing)
  const success = Math.random() > 0.1;

  if (!success) {
    return {
      success: false,
      error: "Vit-Rin API error: External service unavailable",
    };
  }

  return { success: true };
}

export const POST = withRouteErrorBoundary(async (request: Request) => {
  // Get current user from session
  const authResult = await getCurrentUser(request);
  if (authResult.error) {
    return authResult.error;
  }

  const { user } = authResult;

  // Check if user is vitrin_connected
  if (!user.vitrin_connected) {
    return NextResponse.json(
      { error: "Vit-Rin account not connected" },
      { status: 403 }
    );
  }

  // Parse request body
  const body = await request.json();
  const { amount } = body;

  // Validate input
  if (!amount || typeof amount !== "number" || amount <= 0) {
    return NextResponse.json(
      { error: "Valid amount is required" },
      { status: 400 }
    );
  }

  // Get wallet
  const wallet = await getWallet(user.id);
  if (!wallet) {
    return NextResponse.json(
      { error: "Wallet not found" },
      { status: 404 }
    );
  }

  // Check if user has enough balance
  if (wallet.balance < amount) {
    return NextResponse.json(
      { error: "Insufficient balance" },
      { status: 400 }
    );
  }

  // ATOMIC TRANSACTION: Debit Y-COIN immediately
  const debitResult = await updateBalance(user.id, -amount);
  if (!debitResult) {
    return NextResponse.json(
      { error: "Failed to update balance" },
      { status: 500 }
    );
  }

  // Simulate external API call to Vit-Rin
  const vitrinResult = await simulateVitrinSwap(user.id, amount);

  if (!vitrinResult.success) {
    // ROLLBACK: Credit Y-COIN back on failure
    await updateBalance(user.id, amount);

    return NextResponse.json(
      { error: vitrinResult.error || "Swap failed" },
      { status: 500 }
    );
  }

  // SUCCESS: Record swap transaction
  await addTransaction(user.id, {
    type: "swap",
    amount: -amount, // Negative because it's a debit
    status: "completed",
    source: "vitrin_swap",
  });

  return NextResponse.json(
    {
      message: "Swap completed successfully",
      newBalance: debitResult.balance,
    },
    { status: 200 }
  );
});


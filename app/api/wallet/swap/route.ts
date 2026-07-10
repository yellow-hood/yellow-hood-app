import { getCurrentUser } from "@/lib/auth";
import { getWallet, updateBalance, addTransaction } from "@/lib/db";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ApiErrorCode } from "@/lib/api-error-codes";

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
    return apiError("Vit-Rin account not connected", ApiErrorCode.VITRIN_NOT_CONNECTED, 403);
  }

  // Parse request body
  const body = await request.json();
  const { amount } = body;

  // Validate input
  if (!amount || typeof amount !== "number" || amount <= 0) {
    return apiError("Valid amount is required", ApiErrorCode.VALIDATION_ERROR, 400);
  }

  // Get wallet
  const wallet = await getWallet(user.id);
  if (!wallet) {
    return apiError("Wallet not found", ApiErrorCode.WALLET_NOT_FOUND, 404);
  }

  // Check if user has enough balance
  if (wallet.balance < amount) {
    return apiError("Insufficient balance", ApiErrorCode.INSUFFICIENT_BALANCE, 400);
  }

  // ATOMIC TRANSACTION: Debit Y-COIN immediately
  const debitResult = await updateBalance(user.id, -amount);
  if (!debitResult) {
    return apiError("Failed to update balance", ApiErrorCode.UPDATE_FAILED, 500);
  }

  // Simulate external API call to Vit-Rin
  const vitrinResult = await simulateVitrinSwap(user.id, amount);

  if (!vitrinResult.success) {
    // ROLLBACK: Credit Y-COIN back on failure
    await updateBalance(user.id, amount);

    return apiError(vitrinResult.error || "Swap failed", ApiErrorCode.SWAP_FAILED, 500);
  }

  // SUCCESS: Record swap transaction
  await addTransaction(user.id, {
    type: "swap",
    amount: -amount, // Negative because it's a debit
    status: "completed",
    source: "vitrin_swap",
  });

  return apiSuccess({
    message: "Swap completed successfully",
    newBalance: debitResult.balance,
  });
});


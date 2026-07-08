import { findUserByVitrinId, updateBalance, addTransaction } from "@/lib/db";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ApiErrorCode } from "@/lib/api-error-codes";

export const POST = withRouteErrorBoundary(async (request: Request) => {
  // Parse request body
  const body = await request.json();
  const { user_id, amount, source } = body;

  // Validate input
  if (!user_id || typeof user_id !== "string") {
    return apiError("user_id is required", ApiErrorCode.VALIDATION_ERROR, 400);
  }

  if (!amount || typeof amount !== "number" || amount <= 0) {
    return apiError("Valid amount is required", ApiErrorCode.VALIDATION_ERROR, 400);
  }

  // Find user by vitrin_user_id (webhook sends vitrin_user_id)
  const user = await findUserByVitrinId(user_id);

  if (!user) {
    return apiError("User not found", ApiErrorCode.USER_NOT_FOUND, 404);
  }

  // Credit balance
  const wallet = await updateBalance(user.id, amount);
  if (!wallet) {
    return apiError("Failed to update wallet", ApiErrorCode.UPDATE_FAILED, 500);
  }

  // Record reward transaction
  await addTransaction(user.id, {
    type: "reward",
    amount: amount,
    status: "completed",
    source: source || "vitrin_reward",
  });

  return apiSuccess({
    message: "Reward processed successfully",
    userId: user.id,
    newBalance: wallet.balance,
  });
});


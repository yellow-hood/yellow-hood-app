import { getCurrentUser } from "@/lib/auth";
import { getWallet } from "@/lib/db";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ApiErrorCode } from "@/lib/api-error-codes";

export const GET = withRouteErrorBoundary(async (request: Request) => {
  // Get current user from session
  const authResult = await getCurrentUser(request);
  if (authResult.error) {
    return authResult.error;
  }

  const { user } = authResult;

  // Get wallet for user
  const wallet = await getWallet(user.id);

  if (!wallet) {
    return apiError("Wallet not found", ApiErrorCode.WALLET_NOT_FOUND, 404);
  }

  return apiSuccess({ balance: wallet.balance });
});


import { getCurrentUser } from "@/lib/auth";
import { getTransactions } from "@/lib/db";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";
import { apiSuccess } from "@/lib/api-response";

export const GET = withRouteErrorBoundary(async (request: Request) => {
  // Get current user from session
  const authResult = await getCurrentUser(request);
  if (authResult.error) {
    return authResult.error;
  }

  const { user } = authResult;

  // Get transactions for user (already sorted by date desc)
  const transactions = await getTransactions(user.id);

  return apiSuccess({ transactions });
});


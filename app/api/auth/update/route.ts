import { getCurrentUser } from "@/lib/auth";
import { updateUser } from "@/lib/db";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ApiErrorCode } from "@/lib/api-error-codes";

export const PUT = withRouteErrorBoundary(async (request: Request) => {
  // Get current user from session
  const authResult = await getCurrentUser(request);
  if (authResult.error) {
    return authResult.error;
  }

  const { user } = authResult;
  const body = await request.json();
  const { username, theme } = body;

  // Update user
  const updates: Partial<{ username: string; theme: string }> = {};
  if (username !== undefined) {
    updates.username = username;
  }
  if (theme !== undefined) {
    updates.theme = theme;
  }

  const updatedUser = await updateUser(user.id, updates);

  if (!updatedUser) {
    return apiError("Failed to update user", ApiErrorCode.UPDATE_FAILED, 500);
  }

  return apiSuccess({ user: updatedUser });
});


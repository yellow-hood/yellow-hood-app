import { getCurrentUser } from "@/lib/auth";
import { updateUser } from "@/lib/db";
import { randomBytes } from "crypto";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ApiErrorCode } from "@/lib/api-error-codes";

export const POST = withRouteErrorBoundary(async (request: Request) => {
  // Get current user from session
  const authResult = await getCurrentUser(request);
  if (authResult.error) {
    return authResult.error;
  }

  const { user } = authResult;

  // Parse request body
  const body = await request.json();
  const { code } = body;

  // Validate input
  if (!code || typeof code !== "string") {
    return apiError("OAuth code is required", ApiErrorCode.VALIDATION_ERROR, 400);
  }

  // Simulate exchanging code for vitrin_user_id
  // In a real implementation, you would call Vit-Rin's OAuth token exchange endpoint
  // For now, we'll generate a mock vitrin_user_id
  const vitrinUserId = `vitrin_${randomBytes(8).toString("hex")}`;

  // Update user: set vitrin_connected = true and vitrin_user_id
  const updatedUser = await updateUser(user.id, {
    vitrin_connected: true,
    vitrin_user_id: vitrinUserId,
  });

  if (!updatedUser) {
    return apiError("Failed to update user", ApiErrorCode.UPDATE_FAILED, 500);
  }

  return apiSuccess({
    message: "Vit-Rin account connected successfully",
    user: updatedUser,
  });
});


import { getCurrentUser } from "@/lib/auth";
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

  // Check if already connected
  if (user.vitrin_connected) {
    return apiError("Vit-Rin account already connected", ApiErrorCode.VITRIN_ALREADY_CONNECTED, 400);
  }

  // Generate mock OAuth code
  const oauthCode = randomBytes(16).toString("hex");
  const redirectUrl = `https://vitrin.example.com/oauth/authorize?code=${oauthCode}&state=${user.id}`;

  // In a real implementation, you would store this code temporarily
  // For now, we'll just return the redirect URL

  return apiSuccess({
    message: "OAuth flow initiated",
    redirectUrl,
    code: oauthCode, // For testing purposes
  });
});


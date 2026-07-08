import { deleteSession } from "@/lib/db";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ApiErrorCode } from "@/lib/api-error-codes";

export const POST = withRouteErrorBoundary(async (request: Request) => {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return apiError("Authorization token required", ApiErrorCode.UNAUTHORIZED, 401);
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  // Delete session
  const deleted = await deleteSession(token);

  if (!deleted) {
    return apiError("Session not found", ApiErrorCode.SESSION_NOT_FOUND, 404);
  }

  // Create response and clear auth cookie
  const response = apiSuccess({ message: "Logged out successfully" });
  
  // Clear auth cookie using same path as login so browser removes it reliably
  response.cookies.set("auth_token", "", { path: "/", maxAge: 0 });

  return response;
});


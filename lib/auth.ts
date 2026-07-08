import { findSession, findUser } from "./db";
import { apiError } from "./api-response";
import { ApiErrorCode } from "./api-error-codes";

export async function getCurrentUser(request: Request): Promise<{ user: any; error?: never } | { user?: never; error: Response }> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      error: apiError("Authorization token required", ApiErrorCode.UNAUTHORIZED, 401),
    };
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix
  const session = await findSession(token);

  if (!session) {
    return {
      error: apiError("Invalid or expired session", ApiErrorCode.SESSION_EXPIRED, 401),
    };
  }

  const user = await findUser(undefined, session.user_id);

  if (!user) {
    return {
      error: apiError("User not found", ApiErrorCode.USER_NOT_FOUND, 404),
    };
  }

  return { user };
}


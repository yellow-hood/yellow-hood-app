import { findUser, createUser } from "@/lib/db";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ApiErrorCode } from "@/lib/api-error-codes";

export const POST = withRouteErrorBoundary(async (request: Request) => {
  const body = await request.json();
  const { email, username, password } = body;

  // Validate input
  if (!email || !username || !password) {
    return apiError("Email, username, and password are required", ApiErrorCode.VALIDATION_ERROR, 400);
  }

  // Check if user already exists
  const existingUser = await findUser(email);
  if (existingUser) {
    return apiError("User with this email already exists", ApiErrorCode.USER_EXISTS, 409);
  }

  // Create new user
  const newUser = await createUser(
    {
      email,
      username,
      avatar_url: null,
      theme: "dark",
      vitrin_connected: false,
    },
    password
  );

  // Return user object (without password) — kept flat at the top level, matching legacy shape
  return apiSuccess(newUser, 201);
});


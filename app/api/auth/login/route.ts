import { findUser, verifyPassword, createSession } from "@/lib/db";
import { randomBytes } from "crypto";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";
import { apiSuccess, apiError } from "@/lib/api-response";
import { ApiErrorCode } from "@/lib/api-error-codes";

export const POST = withRouteErrorBoundary(async (request: Request) => {
  const body = await request.json();
  const { email, password } = body;

  // Validate input
  if (!email || !password) {
    return apiError("Email and password are required", ApiErrorCode.VALIDATION_ERROR, 400);
  }

  // Find user (trim email to handle whitespace)
  const trimmedEmail = email.trim().toLowerCase();
  const user = await findUser(trimmedEmail);
  if (!user) {
    console.error("User not found for email:", trimmedEmail);
    return apiError("Invalid email or password", ApiErrorCode.INVALID_CREDENTIALS, 401);
  }

  // Verify password
  const isValidPassword = await verifyPassword(user.id, password);
  if (!isValidPassword) {
    console.error(
      "Password verification failed for email:",
      trimmedEmail,
      "user ID:",
      user.id
    );
    return apiError("Invalid email or password", ApiErrorCode.INVALID_CREDENTIALS, 401);
  }

  // Generate session token
  const token = randomBytes(32).toString("hex");

  // Create session
  await createSession(user.id, token, 24); // 24 hours expiration

  // Create response with token and user
  const response = apiSuccess({ token, user });

  // Set auth token cookie (24 hours expiration)
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60, // 24 hours in seconds
    path: "/",
  });

  return response;
});


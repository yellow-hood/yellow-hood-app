import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { updateUser } from "@/lib/db";
import { randomBytes } from "crypto";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";

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
    return NextResponse.json(
      { error: "OAuth code is required" },
      { status: 400 }
    );
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
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "Vit-Rin account connected successfully",
      user: updatedUser,
    },
    { status: 200 }
  );
});


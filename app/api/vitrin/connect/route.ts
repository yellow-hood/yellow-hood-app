import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { randomBytes } from "crypto";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";

export const POST = withRouteErrorBoundary(async (request: Request) => {
  // Get current user from session
  const authResult = await getCurrentUser(request);
  if (authResult.error) {
    return authResult.error;
  }

  const { user } = authResult;

  // Check if already connected
  if (user.vitrin_connected) {
    return NextResponse.json(
      { error: "Vit-Rin account already connected" },
      { status: 400 }
    );
  }

  // Generate mock OAuth code
  const oauthCode = randomBytes(16).toString("hex");
  const redirectUrl = `https://vitrin.example.com/oauth/authorize?code=${oauthCode}&state=${user.id}`;

  // In a real implementation, you would store this code temporarily
  // For now, we'll just return the redirect URL

  return NextResponse.json(
    {
      message: "OAuth flow initiated",
      redirectUrl,
      code: oauthCode, // For testing purposes
    },
    { status: 200 }
  );
});


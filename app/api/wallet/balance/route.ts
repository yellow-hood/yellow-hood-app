import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getWallet } from "@/lib/db";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";

export const GET = withRouteErrorBoundary(async (request: Request) => {
  // Get current user from session
  const authResult = await getCurrentUser(request);
  if (authResult.error) {
    return authResult.error;
  }

  const { user } = authResult;

  // Get wallet for user
  const wallet = await getWallet(user.id);

  if (!wallet) {
    return NextResponse.json(
      { error: "Wallet not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { balance: wallet.balance },
    { status: 200 }
  );
});


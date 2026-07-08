import { NextResponse } from "next/server";
import { findUserByVitrinId, updateBalance, addTransaction } from "@/lib/db";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";

export const POST = withRouteErrorBoundary(async (request: Request) => {
  // Parse request body
  const body = await request.json();
  const { user_id, amount, source } = body;

  // Validate input
  if (!user_id || typeof user_id !== "string") {
    return NextResponse.json(
      { error: "user_id is required" },
      { status: 400 }
    );
  }

  if (!amount || typeof amount !== "number" || amount <= 0) {
    return NextResponse.json(
      { error: "Valid amount is required" },
      { status: 400 }
    );
  }

  // Find user by vitrin_user_id (webhook sends vitrin_user_id)
  const user = await findUserByVitrinId(user_id);

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  // Credit balance
  const wallet = await updateBalance(user.id, amount);
  if (!wallet) {
    return NextResponse.json(
      { error: "Failed to update wallet" },
      { status: 500 }
    );
  }

  // Record reward transaction
  await addTransaction(user.id, {
    type: "reward",
    amount: amount,
    status: "completed",
    source: source || "vitrin_reward",
  });

  return NextResponse.json(
    {
      message: "Reward processed successfully",
      userId: user.id,
      newBalance: wallet.balance,
    },
    { status: 200 }
  );
});


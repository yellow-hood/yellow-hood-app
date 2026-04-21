import { NextResponse } from "next/server";
import { findUser, createUser } from "@/lib/db";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";

export const POST = withRouteErrorBoundary(async (request: Request) => {
  const body = await request.json();
  const { email, username, password } = body;

  // Validate input
  if (!email || !username || !password) {
    return NextResponse.json(
      { error: "Email, username, and password are required" },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existingUser = await findUser(email);
  if (existingUser) {
    return NextResponse.json(
      { error: "User with this email already exists" },
      { status: 409 }
    );
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

  // Return user object (without password)
  return NextResponse.json(newUser, { status: 201 });
});


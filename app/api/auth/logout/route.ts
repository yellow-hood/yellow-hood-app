import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Delete session
    const deleted = await deleteSession(token);
    
    if (!deleted) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Create response and clear auth cookie
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
    
    // Clear auth cookie using same path as login so browser removes it reliably
    response.cookies.set("auth_token", "", { path: "/", maxAge: 0 });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


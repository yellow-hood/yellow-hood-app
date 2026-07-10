import { NextResponse } from "next/server";

// Response normalization wrapper. Strictly additive: every legacy field a
// route already returns stays exactly as-is (same key, same value, same
// status code) — these helpers only add new fields (`success`, and for
// errors `message`/`code`) so existing frontend consumers never break.

export function apiSuccess<T extends Record<string, unknown>>(
  data: T,
  status: number = 200
): NextResponse {
  return NextResponse.json({ ...data, success: true }, { status });
}

export function apiError(
  message: string,
  code: string,
  status: number = 500,
  extra?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    { error: message, message, code, success: false, ...extra },
    { status }
  );
}

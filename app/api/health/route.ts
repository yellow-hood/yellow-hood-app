import { NextResponse } from "next/server";
import { checkDbConnection } from "@/lib/db";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";

// Must be evaluated per-request, not cached at build time — otherwise it would
// freeze whatever DB/env state existed during the Docker build forever.
export const dynamic = "force-dynamic";

export const GET = withRouteErrorBoundary(async () => {
  const envOk = Boolean(process.env.DATABASE_URL);
  const dbOk = envOk && (await checkDbConnection());

  const checks = {
    db: dbOk ? "ok" : "error",
    env: envOk ? "ok" : "error",
  } as const;

  const healthy = dbOk && envOk;

  return NextResponse.json(
    { status: healthy ? "ok" : "degraded", checks },
    { status: healthy ? 200 : 503 }
  );
});

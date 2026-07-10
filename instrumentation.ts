// Runs once when the Node.js server process starts. This is non-blocking
// diagnostic logging only — it must never throw or call process.exit(),
// so a missing/invalid env var degrades the app instead of crashing boot.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    if (!process.env.DATABASE_URL) {
      console.warn(
        "[instrumentation] DATABASE_URL is not set — DB-dependent routes will fail until it is configured."
      );
    }
  }
}

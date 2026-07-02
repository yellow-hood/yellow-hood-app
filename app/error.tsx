"use client";

import { Button } from "@qpub/qui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Something went wrong.</h1>
      <Button color="primary" size="lg" onClick={() => reset()} className="font-semibold">
        Try again
      </Button>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-7xl font-black text-foreground">Something went wrong.</h1>
      <Button color="primary" size="lg" onClick={() => reset()} className="font-semibold">
        Try again
      </Button>
    </div>
  );
}

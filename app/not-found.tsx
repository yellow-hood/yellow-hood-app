import Link from "next/link";

export default function NotFound() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Not Found</h1>
      <p className="text-default-500">This page doesn&apos;t exist.</p>
      <Link
        href="/"
        className="inline-block text-primary hover:text-primary/80 font-medium transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}


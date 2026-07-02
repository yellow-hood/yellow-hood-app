"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@qpub/qui";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Input } from "@/components/ui/Input";
import { LogIn } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error, isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) router.replace("/home");
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast.success("Welcome back!");
      router.push("/home");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center gap-2 pb-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 rounded-full bg-primary/20">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-center">Sign In</h1>
          <p className="text-sm text-default-500 text-center">
            Sign in with your email and password.
          </p>
        </CardHeader>
        <CardContent className="gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onValueChange={setEmail}
              isRequired
              variant="bordered"
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onValueChange={setPassword}
              isRequired
              variant="bordered"
            />

            {error && (
              <p className="text-danger text-sm text-center">{error}</p>
            )}

            <AnimatedButton
              type="submit"
              color="primary"
              size="lg"
              isLoading={isLoading}
              className="mt-2"
              fullWidth
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </AnimatedButton>
          </form>

          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-divider">
            <span className="text-sm text-default-500">
              Don&apos;t have an account?
            </span>
            <Link href="/register" className="text-sm font-semibold text-primary">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

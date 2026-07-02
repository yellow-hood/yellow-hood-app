"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@qpub/qui";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Input } from "@/components/ui/Input";
import { UserPlus } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register, login, isLoading, error } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, username, password });
      toast.success("Account created successfully!");
      await login({ email, password });
      toast.success("Welcome to Yellow Hood!");
      router.push("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center gap-2 pb-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 rounded-full bg-primary/20">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-center">Create Account</h1>
          <p className="text-sm text-default-500 text-center">
            Enter your details to create an account.
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
              type="text"
              label="Username"
              placeholder="Choose a username"
              value={username}
              onValueChange={setUsername}
              isRequired
              variant="bordered"
            />
            <Input
              type="password"
              label="Password"
              placeholder="Create a password"
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
              {isLoading ? "Creating account..." : "Sign Up"}
            </AnimatedButton>
          </form>

          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-divider">
            <span className="text-sm text-default-500">
              Already have an account?
            </span>
            <Link href="/login" className="text-sm font-semibold text-primary">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

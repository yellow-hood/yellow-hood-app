"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Link as NextUILink,
} from "@nextui-org/react";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login({ email, password });
      toast.success("Welcome back!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-content1/80 backdrop-blur-lg border border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader className="flex flex-col gap-2 pb-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 rounded-full bg-primary/20 border border-primary/30 shadow-lg shadow-primary/20">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Sign In
          </h1>
          <p className="text-sm text-default-500 text-center">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardBody className="gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onValueChange={setEmail}
              startContent={<Mail className="w-4 h-4 text-default-400" />}
              isRequired
              variant="bordered"
              classNames={{
                input: "text-foreground",
                label: "text-foreground",
                inputWrapper: "border-default-200 hover:border-primary/50 focus-within:border-primary",
              }}
            />
            <Input
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onValueChange={setPassword}
              startContent={<Lock className="w-4 h-4 text-default-400" />}
              isRequired
              variant="bordered"
              classNames={{
                input: "text-foreground",
                label: "text-foreground",
                inputWrapper: "border-default-200 hover:border-primary/50 focus-within:border-primary",
              }}
            />
            
            {error && (
              <div className="text-danger text-sm text-center p-2 rounded-lg bg-danger/10 border border-danger/20">
                {error}
              </div>
            )}

            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={isLoading}
              className="font-semibold mt-2 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-divider">
            <span className="text-sm text-default-500">
              Don't have an account?
            </span>
            <NextUILink
              as={Link}
              href="/register"
              className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Sign Up
            </NextUILink>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}


"use client";

import { Button, Avatar, AvatarImage, AvatarFallback, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@qpub/qui";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { MoonLinearIcon, SunLinearIcon } from "@/components/ui/icons";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch {
      toast.error("Couldn't sign out. Please try again.");
      router.push("/");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
            <Image
              src="/Yellow-hood-light-icon.svg"
              alt="Yellow Hood Logo"
              width={32}
              height={32}
              className="object-contain dark:hidden"
            />
            <Image
              src="/Yellow-hood-dark-icon.svg"
              alt="Yellow Hood Logo"
              width={32}
              height={32}
              className="hidden object-contain dark:block"
            />
          </div>
          <span className="text-xl font-bold">Yellow Hood</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            variant="light"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === "dark" ? <SunLinearIcon size={20} /> : <MoonLinearIcon size={20} />
            ) : (
              <SunLinearIcon size={20} />
            )}
          </Button>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarImage src={user.avatar_url || undefined} alt={user.username} />
                  <AvatarFallback>{user.username?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <p className="font-semibold">Signed in as</p>
                  <p className="text-sm text-default-500">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-error focus:text-error">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="flat" color="primary" size="sm">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

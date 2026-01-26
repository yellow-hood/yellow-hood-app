"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Link as NextUILink,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Home, Wallet, Gamepad2, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent hydration mismatch
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

  // TODO: Home href "/" causes redirect to /home; using "/home" would avoid extra hop
  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Wallet", href: "/wallet", icon: Wallet },
    { label: "Games", href: "/games", icon: Gamepad2 },
  ];

  return (
    <NextUINavbar
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      className="bg-background/80 backdrop-blur-md border-b border-divider"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-black font-bold text-sm">YH</span>
          </div>
          <span className="font-bold text-xl text-foreground">Yellow Hood</span>
        </Link>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navItems.map((item) => (
          <NavbarItem key={item.href}>
            <NextUILink
              as={Link}
              href={item.href}
              className="text-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </NextUILink>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {/* Theme Switcher */}
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>
        </NavbarItem>

        {/* User Menu */}
        {isAuthenticated && user ? (
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  src={user.avatar_url || undefined}
                  name={user.username}
                  size="sm"
                  className="cursor-pointer"
                  showFallback
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu" variant="flat">
                <DropdownItem
                  key="profile"
                  textValue="Profile"
                  className="h-14 gap-2"
                >
                  <p className="font-semibold">Signed in as</p>
                  <p className="text-sm text-default-500">{user.email}</p>
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  startContent={<Settings className="w-4 h-4" />}
                  onPress={() => router.push("/settings")}
                >
                  Settings
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  startContent={<LogOut className="w-4 h-4" />}
                  onPress={handleLogout}
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <NavbarItem>
            <Button
              as={Link}
              href="/login"
              variant="flat"
              color="primary"
              size="sm"
            >
              Login
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavbarMenuItem key={`${item.href}-${index}`}>
              <NextUILink
                as={Link}
                href={item.href}
                className="w-full flex items-center gap-2 text-foreground"
                size="lg"
                onPress={() => setIsMenuOpen(false)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NextUILink>
            </NavbarMenuItem>
          );
        })}
        {isAuthenticated && (
          <>
            <NavbarMenuItem>
              <NextUILink
                as={Link}
                href="/settings"
                className="w-full flex items-center gap-2 text-foreground"
                size="lg"
                onPress={() => setIsMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                Settings
              </NextUILink>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <Button
                className="w-full justify-start"
                variant="light"
                color="danger"
                startContent={<LogOut className="w-5 h-5" />}
                onPress={handleLogout}
              >
                Logout
              </Button>
            </NavbarMenuItem>
          </>
        )}
      </NavbarMenu>
    </NextUINavbar>
  );
}


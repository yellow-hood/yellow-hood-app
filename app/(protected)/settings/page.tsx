"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [username, setUsername] = useState(user?.username || "");
  const [selectedTheme, setSelectedTheme] = useState(theme || "dark");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setSelectedTheme(user.theme || theme || "dark");
    }
  }, [user, theme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.put("/auth/update", {
        username,
        theme: selectedTheme,
      });

      // Update auth store with new user data
      useAuthStore.setState({ user: response.data.user });

      // Update theme if changed
      if (selectedTheme !== theme) {
        setTheme(selectedTheme);
      }

      toast.success("Settings updated successfully!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Couldn't update settings. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Settings</h1>

      <Card className="bg-content1 border border-default-200">
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Username"
              placeholder="Enter your username"
              value={username}
              onValueChange={setUsername}
              variant="bordered"
              classNames={{
                input: "text-foreground",
                label: "text-foreground",
                inputWrapper: "border-default-200 hover:border-primary/50 focus-within:border-primary",
              }}
            />

            <Select
              label="Theme"
              selectedKeys={[selectedTheme]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSelectedTheme(selected);
              }}
              variant="bordered"
              classNames={{
                trigger: "border-default-200 hover:border-primary/50",
                label: "text-foreground",
              }}
            >
              <SelectItem key="dark" value="dark">
                Dark
              </SelectItem>
              <SelectItem key="light" value="light">
                Light
              </SelectItem>
            </Select>

            <div className="flex gap-4">
              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={isLoading}
                className="font-semibold"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card className="bg-content1 border border-default-200">
        <CardBody className="p-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Account</h2>
            <Button
              color="danger"
              variant="flat"
              onPress={handleLogout}
              className="font-semibold"
            >
              Logout
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}


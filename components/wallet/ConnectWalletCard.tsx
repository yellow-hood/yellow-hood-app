"use client";

import { useState } from "react";
import { CardContent } from "@qpub/qui";
import { Card } from "@/components/ui/Card";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Link2, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/services/api";
import { toast } from "sonner";

export default function ConnectWalletCard() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { user } = useAuthStore();

  const handleConnect = async () => {
    if (!user) return;
    setIsConnecting(true);
    try {
      const connectResponse = await api.post("/vitrin/connect");
      const { code } = connectResponse.data;
      const oauthResponse = await api.post("/vitrin/oauth", { code });
      const { user: updatedUser } = oauthResponse.data;
      useAuthStore.setState({ user: updatedUser });
      toast.success("Vit-Rin account connected successfully!");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Couldn't connect. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Link2 className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Connect Vit-Rin Account</h3>
            <p className="text-sm text-default-500 max-w-md">
              Connect your Vit-Rin account to swap Y-COIN.
            </p>
          </div>

          <div className="flex items-center gap-2 text-primary text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Required for Y-COIN swaps.</span>
          </div>

          <AnimatedButton
            color="primary"
            size="lg"
            onClick={handleConnect}
            isLoading={isConnecting}
            startContent={<Link2 className="w-5 h-5" />}
            className="mt-2"
          >
            Connect Vit-Rin
          </AnimatedButton>
        </div>
      </CardContent>
    </Card>
  );
}

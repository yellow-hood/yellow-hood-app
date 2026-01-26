"use client";

import { useState } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
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
      // Step 1: Initiate OAuth connection
      const connectResponse = await api.post("/vitrin/connect");
      const { code } = connectResponse.data;

      // Step 2: Exchange code for vitrin_user_id
      const oauthResponse = await api.post("/vitrin/oauth", { code });
      const { user: updatedUser } = oauthResponse.data;

      // Update auth store with new user data
      useAuthStore.setState({ user: updatedUser });

      toast.success("Vit-Rin account connected successfully!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Couldn't connect. Please try again."
      );
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 shadow-xl shadow-primary/20">
      <CardBody className="p-6">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center shadow-lg shadow-primary/30">
            <Link2 className="w-8 h-8 text-primary" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">
              Connect Vit-Rin Account
            </h3>
            <p className="text-sm text-default-500 max-w-md">
              Connect your Vit-Rin account to swap Y-COIN.
            </p>
          </div>

          <div className="flex items-center gap-2 text-primary/80 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Required for Y-COIN swaps.</span>
          </div>

          <Button
            color="primary"
            size="lg"
            onPress={handleConnect}
            isLoading={isConnecting}
            className="mt-2 font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all min-w-[200px]"
            startContent={!isConnecting && <Link2 className="w-5 h-5" />}
          >
            {isConnecting ? "Connecting..." : "Connect Vit-Rin"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}


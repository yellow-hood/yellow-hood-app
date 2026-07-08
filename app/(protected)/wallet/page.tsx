"use client";

import { useAuthStore } from "@/store/useAuthStore";
import ConnectWalletCard from "@/components/wallet/ConnectWalletCard";
import WalletDashboard from "@/components/wallet/WalletDashboard";

export default function WalletPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <h1 className="text-7xl font-black text-foreground">Wallet</h1>
      {!user?.vitrin_connected ? (
        <ConnectWalletCard />
      ) : (
        <WalletDashboard />
      )}
    </div>
  );
}


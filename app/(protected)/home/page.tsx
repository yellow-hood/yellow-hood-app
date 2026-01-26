"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@nextui-org/react";
import { Coins, Gamepad2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useWalletStore } from "@/store/useWalletStore";
import gameService from "@/services/gameService";
import GameCard from "@/components/games/GameCard";
import { toast } from "sonner";
import type { Game } from "@/types";

export default function HomePage() {
  const { user } = useAuthStore();
  const { balance, fetchBalance } = useWalletStore();
  const [featuredGame, setFeaturedGame] = useState<Game | null>(null);

  useEffect(() => {
    fetchBalance().catch((err) => {
      toast.error(
        err?.response?.data?.error || "Couldn't load balance. Please try again."
      );
    });
    gameService
      .getGames()
      .then((response) => {
        if (response.games && response.games.length > 0) {
          setFeaturedGame(response.games[0]);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.error || "Couldn't load games. Please try again."
        );
      });
  }, [fetchBalance]);

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30 shadow-xl shadow-primary/20">
        <CardBody className="p-6">
          <h1 className="text-3xl font-bold text-foreground">
            Hello, {user?.username || "User"}
          </h1>
        </CardBody>
      </Card>

      {/* Balance Preview */}
      <Card className="bg-content1 border border-default-200">
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-default-500 text-sm">
                <Coins className="w-4 h-4" />
                <span>Balance</span>
              </div>
              {/* TODO: On fetchBalance error, show message; else 0.00 can look like real balance */}
              <h2 className="text-3xl font-bold text-foreground">
                {balance.toFixed(2)} Y-COIN
              </h2>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Featured Game */}
      {featuredGame && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Featured Game</h2>
          </div>
          <div className="max-w-md">
            <GameCard game={featuredGame} />
          </div>
        </div>
      )}
    </div>
  );
}


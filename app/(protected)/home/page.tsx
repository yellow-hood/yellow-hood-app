"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@qpub/qui";
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
      toast.error(err?.response?.data?.error || "Couldn't load balance. Please try again.");
    });
    gameService
      .getGames()
      .then((response) => {
        if (response.games && response.games.length > 0) {
          setFeaturedGame(response.games[0]);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.error || "Couldn't load games. Please try again.");
      });
  }, [fetchBalance]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold">
            Hello, {user?.username || "User"}
          </h1>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-default-500 text-sm mb-2">
            <Coins className="w-4 h-4" />
            <span>Balance</span>
          </div>
          <h2 className="text-3xl font-bold">{balance.toFixed(2)} Y-COIN</h2>
        </CardContent>
      </Card>

      {featuredGame && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Featured Game</h2>
          </div>
          <div className="max-w-md">
            <GameCard game={featuredGame} />
          </div>
        </div>
      )}
    </div>
  );
}

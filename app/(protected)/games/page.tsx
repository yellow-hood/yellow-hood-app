"use client";

import { useEffect, useState } from "react";
import gameService from "@/services/gameService";
import GameCard from "@/components/games/GameCard";
import { toast } from "sonner";
import type { Game } from "@/types";

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    gameService
      .getGames()
      .then((response) => {
        setGames(response.games || []);
        setIsLoading(false);
      })
      .catch((error) => {
        toast.error(
          error?.response?.data?.error || "Couldn't load games. Please try again."
        );
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-7xl font-black text-foreground">Games</h1>
        <div className="text-center py-12 text-default-500">Loading…</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-7xl font-black text-foreground">Games</h1>
      {games.length === 0 ? (
        <div className="text-center py-12 text-default-500">
          No games yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}


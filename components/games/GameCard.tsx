"use client";

import { Card, CardContent } from "@qpub/qui";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { Play, Gamepad2 } from "lucide-react";
import type { Game } from "@/types";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const handlePlay = () => {
    window.open(game.external_url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card>
      <div className="relative aspect-video overflow-hidden rounded-t-lg">
        <Image
          src={game.thumbnail_url}
          alt={game.title}
          fill
          className="object-cover"
        />
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-lg font-bold line-clamp-1">{game.title}</h3>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4 text-primary" />
            <span className="text-sm text-default-500">{game.category}</span>
          </div>
        </div>

        <Button
          color="primary"
          variant="solid"
          size="lg"
          onClick={handlePlay}
          className="w-full"
        >
          <span className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Play Now
          </span>
        </Button>
      </CardContent>
    </Card>
  );
}

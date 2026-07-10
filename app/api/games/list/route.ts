import type { Game } from "@/types";
import { withRouteErrorBoundary } from "@/lib/route-error-boundary";
import { apiSuccess } from "@/lib/api-response";

// Static game data
const games: Game[] = [
  {
    id: "game-1",
    title: "Epic Quest Adventure",
    thumbnail_url:
      "https://via.placeholder.com/300x200/FFD12D/000000?text=Epic+Quest",
    category: "RPG",
    external_url: "https://example.com/games/epic-quest",
  },
  {
    id: "game-2",
    title: "Racing Champions",
    thumbnail_url:
      "https://via.placeholder.com/300x200/FFD12D/000000?text=Racing+Champions",
    category: "Racing",
    external_url: "https://example.com/games/racing-champions",
  },
  {
    id: "game-3",
    title: "Puzzle Master",
    thumbnail_url:
      "https://via.placeholder.com/300x200/FFD12D/000000?text=Puzzle+Master",
    category: "Puzzle",
    external_url: "https://example.com/games/puzzle-master",
  },
  {
    id: "game-4",
    title: "Battle Arena",
    thumbnail_url:
      "https://via.placeholder.com/300x200/FFD12D/000000?text=Battle+Arena",
    category: "Action",
    external_url: "https://example.com/games/battle-arena",
  },
  {
    id: "game-5",
    title: "Strategy Empire",
    thumbnail_url:
      "https://via.placeholder.com/300x200/FFD12D/000000?text=Strategy+Empire",
    category: "Strategy",
    external_url: "https://example.com/games/strategy-empire",
  },
  {
    id: "game-6",
    title: "Arcade Legends",
    thumbnail_url:
      "https://via.placeholder.com/300x200/FFD12D/000000?text=Arcade+Legends",
    category: "Arcade",
    external_url: "https://example.com/games/arcade-legends",
  },
];

export const GET = withRouteErrorBoundary(async () => {
  return apiSuccess({ games });
});

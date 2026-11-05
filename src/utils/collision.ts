import type { PlayerPos, Zone } from "../types/game";
import { MAP_CONFIG } from "../constants/game";

/**
 * Memeriksa apakah pemain berada di dalam atau dekat dengan zona interaktif
 * menggunakan formula AABB (Axis-Aligned Bounding Box) dengan buffer 15px.
 */
export function isNearZone(
  player: PlayerPos,
  zone: Zone,
  buffer: number = MAP_CONFIG.PROXIMITY_BUFFER,
  playerSize: number = MAP_CONFIG.PLAYER_SIZE
): boolean {
  return (
    player.x < zone.x + zone.width + buffer &&
    player.x + playerSize > zone.x - buffer &&
    player.y < zone.y + zone.height + buffer &&
    player.y + playerSize > zone.y - buffer
  );
}

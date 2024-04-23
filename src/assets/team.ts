// Team type
export interface Team {
  team_id: number;
  team_name: string;
  rounds: number;
  progress: number;
  speed: number;
  acceleration: number;
  timestamp: number;
  show: boolean;
  // Last time the round data was changed by loxsi
  updatedAt: number;
  // Last 30 rounds
  lastRounds: number[];
}

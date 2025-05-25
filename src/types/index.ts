export type PrizeStructure = {
  max_players: number;
  prizes: Prize[];
};

export type Prize = {
  id: number;
  percentaje: number;
};

export type Level = {
  sb: number;
  bb: number;
  ante: number;
  time: number;
};

export type Winner = {
  id: number;
  name: string;
  place: number;
  prize: number;
};

export type Game = {
  id: number;
  name: string;
  entry: number;
  fee: number;
  bubble: number;
  bounty?: number; // Bounty por eliminación en torneos bounty
  points: string;
  extrapot: number; // Bote extra añadido al prize pool
  addon_price: number;
  addon_points: number;
  double_addon_price: number;
  double_addon_points: number;
  punctuality_bonus?: number; // Bono de puntualidad
  prize_structures: PrizeStructure[];
  levels: Level[];
  playing: boolean;
  started: Date;
  elapsed: number;
  players: number;
  total_players: number;
  entries: number;
  addons: number;
  doubleaddons: number;
  current_level: Level;
  next_level: Level;
  final: {
    total_pot: number;
    fee: number;
    players: number;
    prizes: Prize[];
  };
};

export type GameTemplate = {
  id: number;
  name: string;
  entry: number;
  fee: number;
  bubble: number;
  bounty?: number; // Bounty por eliminación en torneos bounty
  points: string;
  extrapot: number; // Bote extra añadido al prize pool
  addon_price: number;
  addon_points: number;
  double_addon_price: number;
  double_addon_points: number;
  punctuality_bonus?: number;
  levels: Level[];
  prize_structures: PrizeStructure[];
};

export type TournamentHistory = {
  id: number;
  name: string;
  template_name: string;
  date_started: Date;
  date_completed: Date;
  duration_minutes: number;
  total_players: number;
  entries: number;
  addons: number;
  doubleaddons: number;
  total_pot: number;
  fee: number;
  real_pot: number;
  extrapot: number;
  bounty?: number;
  punctuality_bonus?: number;
  bubble?: number;
  winners: Winner[];
  final_level: {
    sb: number;
    bb: number;
    ante: number;
  };
  statistics: {
    avg_stack: number;
    levels_played: number;
    addon_percentage: number;
    double_addon_percentage: number;
  };
};

export type TournamentStats = {
  total_tournaments: number;
  total_players: number;
  total_prize_pool: number;
  avg_duration: number;
  avg_players_per_tournament: number;
  most_popular_template: string;
  biggest_tournament: {
    name: string;
    players: number;
    prize_pool: number;
  };
  recent_activity: {
    tournaments_this_month: number;
    tournaments_this_week: number;
  };
};

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
  points: string;
  extrapot: number;
  addon_price: number;
  addon_points: number;
  double_addon_price: number;
  double_addon_points: number;
  prize_structures: PrizeStructure[];
  levels: Level[];
  playing: boolean;
  started: Date;
  elapsed: number;
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
  points: string;
  extrapot: number;
  addon_price: number;
  addon_points: number;
  double_addon_price: number;
  double_addon_points: number;
  levels: Level[];
  prize_structures: PrizeStructure[];
};

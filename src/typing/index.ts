export type Player = {
  id: string;
  username: string;
  email: string;
  elo: number;
};

export type Game = {
  id: string;
  players: string[];
  winners: string[];
  loosers: string[];
  date: string;
  delta: number;
};

export type GameIn = Pick<Game, 'winners' | 'loosers'>

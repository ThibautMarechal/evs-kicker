export type Player = {
  id: string;
  username: string;
  email: string;
  elo: number;
  numberOfGames: number;
};

export type PlayerIn = Pick<Player, 'username' | 'email'>;

export type Game = {
  id: string;
  players: string[];
  winners: string[];
  loosers: string[];
  date: string;
  delta: number;
  loosersScore: number;
};

export type GameIn = Pick<Game, 'winners' | 'loosers' | 'loosersScore'>;

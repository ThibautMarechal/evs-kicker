export type Player = {
  id: string;
  username: string;
  email: string;
};

export type Game = {
  id: string;
  players: string[];
  teamA: string[];
  teamB: string[];
  winners: string[];
  loosers: string[];
  date: string;
};

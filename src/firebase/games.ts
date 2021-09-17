import { firestore } from '.';
import { Game } from '../typing';

const gamesCollection = process.env.NODE_ENV === 'development' ? 'games' : 'games';

export async function getGames(): Promise<Game[]> {
  const query = await firestore.collection(gamesCollection).orderBy('date').limit(100).get();
  return query.docs.map((doc) => ({
    id: doc.id,
    players: doc.get('players'),
    teamA: doc.get('teamA'),
    teamB: doc.get('teamB'),
    winners: doc.get('winners'),
    loosers: doc.get('loosers'),
    date: doc.get('date').toDate().toISOString(),
  }));
}

export async function deleteGame(id: string): Promise<void> {
  return firestore.collection(gamesCollection).doc(id).delete();
}

export async function createGame(game: Omit<Game, 'id'>): Promise<void> {
  await firestore.collection(gamesCollection).add({
    players: game.players,
    teamA: game.teamA,
    teamB: game.teamB,
    winners: game.winners,
    loosers: game.loosers,
    date: game.date,
  });
}

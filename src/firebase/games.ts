import { collection, query, getDocs, orderBy, limit, doc, deleteDoc, addDoc, Timestamp, where } from '@firebase/firestore';
import { firestore } from '.';
import { Game, GameIn, Player } from '../typing';
import { getPlayer, updatePlayerElo } from './players';
import { calculateEloDelta } from '../utils/elo';

const gamesCollection = collection(firestore, process.env.NODE_ENV === 'development' ? 'games' : 'games');

export async function getGames(): Promise<Game[]> {
  const q = await getDocs(query(gamesCollection, orderBy('date', 'desc')));
  return q.docs.map((doc) => ({
    id: doc.id,
    players: doc.get('players'),
    winners: doc.get('winners'),
    loosers: doc.get('loosers'),
    date: doc.get('date').toDate().toISOString(),
    delta: doc.get('delta'),
    loosersScore: doc.get('loosersScore')
  }));
}

export async function deleteGame(id: string): Promise<void> {
  const q = await getDocs(query(gamesCollection, orderBy('date', 'desc'), limit(1)));
  if (q.docs.length !== 1) {
    throw new Error('404');
  }
  if (q.docs[0].id !== id) {
    throw new Error('422');
  }
  const [docToDelete] = q.docs;
  const deletedDelta = docToDelete.get('delta');
  const winners = docToDelete.get('winners');
  const loosers = docToDelete.get('loosers');

  const winnerPlayers: Player[] = [];
  for (const winner of winners) {
    winnerPlayers.push(await getPlayer(winner));
  }

  const looserPlayers: Player[] = [];
  for (const looser of loosers) {
    looserPlayers.push(await getPlayer(looser));
  }
  await Promise.all([
    ...winnerPlayers.map((winner) => updatePlayerElo(winner.id, winner.elo - deletedDelta, true, true)),
    ...looserPlayers.map((looser) => updatePlayerElo(looser.id, looser.elo + deletedDelta, false, true)),
  ]);
  await deleteDoc(doc(gamesCollection, id));
}

export async function createGame(game: GameIn): Promise<void> {
  if (!game.loosers.length || !game.winners.length) {
    throw new Error('422');
  }
  for (const winner of game.winners) {
    for (const looser of game.loosers) {
      if (winner === looser) {
        throw new Error('422');
      }
    }
  }

  if(game.loosersScore < 0 || game.loosersScore > 10){
    throw new Error('422');
  }

  const winnerPlayers: Player[] = [];
  for (const winner of game.winners) {
    winnerPlayers.push(await getPlayer(winner));
  }

  const looserPlayers: Player[] = [];
  for (const looser of game.loosers) {
    looserPlayers.push(await getPlayer(looser));
  }
  
  const delta = calculateEloDelta(winnerPlayers.map(w => w.elo), looserPlayers.map(l => l.elo), game.loosersScore)

  await Promise.all([
    ...winnerPlayers.map((winner) => updatePlayerElo(winner.id, winner.elo + delta, true, false)),
    ...looserPlayers.map((looser) => updatePlayerElo(looser.id, looser.elo - delta, false, false)),
  ]);

  await addDoc(gamesCollection, {
    players: [...game.winners, ...game.loosers],
    winners: game.winners,
    loosers: game.loosers,
    loosersScore: game.loosersScore,
    date: Timestamp.now(),
    delta,
  });
}

export async function getPlayerGames(playerId: string) {
  const q = await getDocs(query(gamesCollection, orderBy('date', 'desc'), where('players', 'array-contains', playerId)));
  return q.docs.map((doc) => ({
    id: doc.id,
    players: doc.get('players'),
    winners: doc.get('winners'),
    loosers: doc.get('loosers'),
    date: doc.get('date').toDate().toISOString(),
    delta: doc.get('delta'),
  }));
}

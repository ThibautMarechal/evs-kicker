import { getDoc, getDocs, query, collection, orderBy, doc, addDoc, updateDoc, increment } from '@firebase/firestore';
import { firestore } from '.';
import { Player, PlayerIn } from '../typing';

const playersCollection = collection(firestore, process.env.NODE_ENV === 'development' ? 'players' : 'players');

export async function getPlayers(): Promise<Player[]> {
  const q = await getDocs(query(playersCollection, orderBy('elo', 'desc'), orderBy('numberOfGames', 'desc')));
  return q.docs.map((doc) => ({
    id: doc.id,
    username: doc.get('username'),
    email: doc.get('email'),
    elo: doc.get('elo'),
    numberOfGames: doc.get('numberOfGames'),
    looses: doc.get('looses') ?? 0,
    wins: doc.get('wins') ?? 0
  }));
}

export async function getPlayer(id: string): Promise<Player> {
  const playerDoc = await getDoc(doc(playersCollection, id));
  return {
    id: playerDoc.id,
    username: playerDoc.get('username'),
    email: playerDoc.get('email'),
    elo: playerDoc.get('elo'),
    numberOfGames: playerDoc.get('numberOfGames'),
    looses: playerDoc.get('looses') ?? 0,
    wins: playerDoc.get('wins') ?? 0
  };
}

export async function createPlayer(player: PlayerIn): Promise<void> {
  await addDoc(playersCollection, {
    username: player.username,
    email: player.email,
    elo: Number.parseInt(process.env.NEXT_PUBLIC_INITIAL_ELO as string),
    numberOfGames: 0,
    looses: 0,
    wins: 0
  });
}

export async function updatePlayerElo(playerId: string, elo: number, win: boolean, rollback: boolean) {
  await updateDoc(doc(playersCollection, playerId), {
    elo,
    wins: increment(win ? rollback ? -1 : 1 : 0),
    looses: increment(!win ? rollback ? -1 : 1 : 0),
    numberOfGames: increment(rollback ? -1 : 1)
  })
}

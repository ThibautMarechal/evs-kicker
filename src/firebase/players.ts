import { getDoc, getDocs, query, collection, orderBy, doc, addDoc, updateDoc } from '@firebase/firestore';
import { firestore } from '.';
import { Player, PlayerIn } from '../typing';

const playersCollection = collection(firestore, process.env.NODE_ENV === 'development' ? 'players' : 'players');

export async function getPlayers(): Promise<Player[]> {
  const q = await getDocs(query(playersCollection, orderBy('elo', 'desc')));
  return q.docs.map((doc) => ({
    id: doc.id,
    username: doc.get('username'),
    email: doc.get('email'),
    elo: doc.get('elo'),
  }));
}

export async function getPlayer(id: string): Promise<Player> {
  const playerDoc = await getDoc(doc(playersCollection, id));
  return {
    id: playerDoc.id,
    username: playerDoc.get('username'),
    email: playerDoc.get('email'),
    elo: playerDoc.get('elo'),
  };
}

export async function createPlayer(player: PlayerIn): Promise<void> {
  await addDoc(playersCollection, {
    username: player.username,
    email: player.email,
    elo: Number.parseInt(process.env.INITIAL_ELO as string),
  });
}

export async function updatePlayerElo(playerId: string, elo: number) {
  await updateDoc(doc(playersCollection, playerId), { elo });
}

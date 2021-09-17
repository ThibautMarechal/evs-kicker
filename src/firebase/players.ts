import { firestore } from '.';
import { Player } from '../typing';

const playersCollection = process.env.NODE_ENV === 'development' ? 'players' : 'players';

export async function getPlayers(): Promise<Player[]> {
  const query = await firestore.collection(playersCollection).orderBy('username').limit(100).get();
  return query.docs.map((doc) => ({
    id: doc.id,
    username: doc.get('username'),
    email: doc.get('email'),
  }));
}

export async function getPlayer(id: string): Promise<Player> {
  const doc = await firestore.collection(playersCollection).doc(id).get();
  return {
    id: doc.id,
    username: doc.get('username'),
    email: doc.get('email'),
  };
}

export async function createPlayer(player: Omit<Player, 'id'>): Promise<void> {
  await firestore.collection(playersCollection).add({
    username: player.username,
    email: player.email,
  });
}

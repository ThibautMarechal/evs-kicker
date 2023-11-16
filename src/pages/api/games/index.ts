import type { NextApiRequest, NextApiResponse } from 'next';
import { createGame, getGames } from '../../../firebase/games';
import { authOptions } from '../auth/[...nextauth]';
import { getServerSession } from 'next-auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(403).end();
  } else if (req.method === 'GET') {
    return res.status(200).json(await getGames());
  } else if (req.method === 'POST') {
    await createGame(req.body);
    return res.status(204).end();
  }
  return res.status(405).end();
}

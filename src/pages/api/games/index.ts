import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { createGame, getGames } from '../../../firebase/games';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(403).end();
  } else if (req.method === 'GET') {
    return res.status(200).json(await getGames());
  } else if (req.method === 'POST') {
    await createGame(req.body);
    return res.status(405).end();
  }
  return res.status(405).end();
}

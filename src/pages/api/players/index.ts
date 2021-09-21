import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { createPlayer, getPlayers } from '../../../firebase/players';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(403).end();
  } else if (req.method === 'GET') {
    return res.status(200).json(await getPlayers());
  } else if (req.method === 'POST') {
    await createPlayer(req.body);
    return res.status(204).end();
  }
  return res.status(405).end();
}

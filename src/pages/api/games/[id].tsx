import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { deleteGame } from '../../../firebase/games';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(403).end();
  } else if (req.method === 'DELETE') {
    await deleteGame(req.query.id as string);
    return res.status(204).end();
  }
  return res.status(405).end();
}

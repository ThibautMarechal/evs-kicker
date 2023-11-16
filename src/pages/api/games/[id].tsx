import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { deleteGame } from '../../../firebase/games';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(403).end();
  } else if (req.method === 'DELETE') {
    try{
      await deleteGame(req.query.id as string);
    } catch(e) {
      return res.status(500).end();
    }
    return res.status(204).end();
  }
  return res.status(405).end();
}

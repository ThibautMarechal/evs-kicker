import type { NextApiRequest, NextApiResponse } from 'next';
import { getPlayer } from '../../../../firebase/players';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(403).end();
  } else if (req.method === 'GET') {
    return res.status(200).json(await getPlayer(req.query.id as string));
  }
  return res.status(405).end();
}

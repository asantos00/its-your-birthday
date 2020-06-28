import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return get(req, res);
  }

  if (req.method === 'DELETE') {
    return remove(req, res);
  }
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  const contributor = await prisma.contributor.findOne({
    where: { id: parseInt(req.query.id as string, 10) }
  })

  res.json(contributor);

  await prisma.disconnect()
}

async function remove(req: NextApiRequest, res: NextApiResponse) {
  const contributor = await prisma.contributor.delete({
    where: { id: parseInt(req.query.id as string, 10) }
  })

  res.json(contributor);

  await prisma.disconnect()
}

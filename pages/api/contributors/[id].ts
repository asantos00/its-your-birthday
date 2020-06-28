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
  const contributor = await prisma.contributor.findOne({
    where: { id: parseInt(req.query.id as string, 10) }
  })

  res.json(contributor);

  await prisma.disconnect()
}

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
  console.log(req.url, req.query, req.method)
  const birthday = await prisma.birthday.findOne({
    where: { id: parseInt(req.query.id as string, 10) },
    include: {
      contributors: true,
      gifts: true
    }
  });

  res.json(birthday)

  await prisma.disconnect()
}

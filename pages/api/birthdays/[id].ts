import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const birthday = await prisma.birthday.findOne({
    where: { id: parseInt(req.query.id as string, 10) }
  });

  res.json(birthday)
}

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
  const createdBirthday = await prisma.birthday.create({
    data: {
      person: req.body.name,
    }
  })

  res.json(createdBirthday);
}

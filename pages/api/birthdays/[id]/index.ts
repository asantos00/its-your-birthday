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
  try {
    const birthday = await prisma.birthday.findOne({
      where: { id: req.query.id as string },
      include: {
        contributors: {
          orderBy: {
            createdAt: 'asc'
          }
        },
        gifts: {
          include: {
            upvotedBy: true,
            suggestor: true
          }
        },
      }
    });

    if (birthday) {
      res.json(birthday)
    } else {
      res.status(404).json({ message: 'Could not find this birthday' });
    }
  } catch (e) {
    res.status(400).json({ message: e });
  }

  await prisma.disconnect()
}

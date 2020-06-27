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
      where: { id: parseInt(req.query.id as string, 10) },
      include: {
        contributors: {
          orderBy: {
            createdAt: 'asc'
          }
        },
        gifts: {
          include: {
            upvotedBy: true
          }
        },
      }
    });

    if (birthday) {
      res.json(birthday)
    } else {
      res.status(404).end();
    }
  } catch (e) {
    res.status(400).end();
  }

  await prisma.disconnect()
}

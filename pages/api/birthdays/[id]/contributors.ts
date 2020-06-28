import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

async function patch(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return post(req, res);
  }

  const birthday = await prisma.birthday.update({
    where: { id: req.query.id as string },
    data: {
      contributors: {
        set: [req.body]
      }
    }
  });

  res.json(birthday)

  await prisma.disconnect()
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  const birthday = await prisma.contributor.create({
    data: {
      Birthday: {
        connect: { id: req.query.id as string }
      },
      name: req.body.name,
      email: req.body.name
    }
  })

  res.json(birthday)

  await prisma.disconnect()
}

export default patch

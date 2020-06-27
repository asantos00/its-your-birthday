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

async function handle(req: NextApiRequest, res: NextApiResponse) {
  console.log(req.body)
  try {
    const birthday = await prisma.birthday.update({
      where: { id: parseInt(req.query.id as string, 10) },
      data: {
        gifts: {
          create: { description: req.body.description, url: req.body.url },
        }
      }
    });

    res.json(birthday)
  } catch (e) {
    console.log(e);
    res.status(400);
  }

  await prisma.disconnect()
}

export default handle

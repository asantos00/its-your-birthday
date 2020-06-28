import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';
import { getCookieForBirthdayId } from "../util";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { contributorId } = getCookieForBirthdayId(req, req.query.id as string);
  try {
    const birthday = await prisma.birthday.update({
      where: { id: parseInt(req.query.id as string, 10) },
      data: {
        gifts: {
          create: {
            description: req.body.description,
            url: req.body.url,
            suggestor: {
              connect: { id: parseInt(contributorId, 10) }
            }
          },
        }
      }
    });

    res.json(birthday)
  } catch (e) {
    res.status(400).end();
  }

  await prisma.disconnect()
}

export default handle

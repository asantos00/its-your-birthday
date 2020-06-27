import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function patch(req: NextApiRequest, res: NextApiResponse) {
  const birthday = await prisma.birthday.update({
    where: { id: parseInt(req.query.id as string, 10) },
    data: {
      contributors: {
        set: [req.body]
      }
    }
  });

  res.json(birthday)

  await prisma.disconnect()
}

export default patch

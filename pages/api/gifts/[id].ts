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

async function remove(req: NextApiRequest, res: NextApiResponse) {
  const gift = await prisma.gift.delete({
    where: {
      id: parseInt(req.query.id as string, 10),
    }
  })

  res.json(gift);

  await prisma.disconnect()
}

export default remove;

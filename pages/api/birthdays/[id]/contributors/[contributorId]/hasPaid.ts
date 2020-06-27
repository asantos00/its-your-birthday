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
  const contributor = await prisma.contributor.update({
    where: { id: parseInt(req.query.contributorId as string) },
    data: {
      hasPaid: req.body.hasPaid
    }
  })

  res.json(contributor);

  await prisma.disconnect()
}

export default handle

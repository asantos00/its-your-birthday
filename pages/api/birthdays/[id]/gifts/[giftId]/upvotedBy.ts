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
  const operation = req.body.isUpvoted ? 'connect' : 'disconnect';
  const contributor = await prisma.gift.update({
    where: { id: parseInt(req.query.giftId as string) },
    data: {
      upvotedBy: {
        [operation]: { id: parseInt(req.cookies.contributorId, 10) },
      }
    }
  })

  res.json(contributor);

  await prisma.disconnect()
}

export default handle

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';
import { getCookieForBirthdayId } from '../../../util';

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
  const { contributorId } = getCookieForBirthdayId(req, req.query.id as string);

  const contributor = await prisma.gift.update({
    where: { id: parseInt(req.query.giftId as string, 10) },
    data: {
      upvotedBy: {
        [operation]: { id: parseInt(contributorId, 10) },
      }
    }
  })

  res.json(contributor);

  await prisma.disconnect()
}

export default handle

import { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { authorizedRoute, NextAuthenticatedRequest } from "../../../../auth";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

async function handle(req: NextAuthenticatedRequest, res: NextApiResponse) {
  const operation = req.body.isUpvoted ? "connect" : "disconnect";
  const { email } = req.user;

  const contributor = await prisma.gift.update({
    where: { id: parseInt(req.query.giftId as string, 10) },
    data: {
      upvotedBy: {
        [operation]: { email },
      },
    },
  });

  res.json(contributor);

  await prisma.disconnect();
}

export default authorizedRoute(handle);

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { authorizedRoute, NextAuthenticatedRequest } from "../../auth";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

async function handle(req: NextAuthenticatedRequest, res: NextApiResponse) {
  const birthday = await prisma.birthday.update({
    where: { id: req.query.id as string },
    data: {
      paidBy: {
        [req.body.hasPaid ? "connect" : "disconnect"]: {
          email: req.user.email,
        },
      },
    },
  });

  res.json(birthday);

  await prisma.disconnect();
}

export default authorizedRoute(handle);

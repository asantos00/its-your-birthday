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

async function handler(req: NextAuthenticatedRequest, res: NextApiResponse) {
  if (req.method === "PATCH") {
    return await authorizedRoute(patch)(req, res);
  }

  if (req.method === "DELETE") {
    return await authorizedRoute(remove)(req, res);
  }

  res.status(404);
}

async function patch(req: NextAuthenticatedRequest, res: NextApiResponse) {
  const birthday = await prisma.contributor.upsert({
    where: { email: req.user.email },
    create: {
      Birthday: {
        connect: { id: req.query.id as string },
      },
      name: req.user.name,
      email: req.user.email,
    },
    update: {
      Birthday: {
        connect: { id: req.query.id as string },
      },
    },
  });

  res.json(birthday);

  await prisma.disconnect();
}

async function remove(req: NextAuthenticatedRequest, res: NextApiResponse) {
  const birthday = await prisma.contributor.update({
    where: { email: req.user.email },
    data: {
      Birthday: {
        disconnect: { id: req.query.id as string },
      },
    },
  });

  res.json(birthday);

  await prisma.disconnect();
}

export default handler;

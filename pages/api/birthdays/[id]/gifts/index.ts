import { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { authorizedRoute, NextAuthenticatedRequest } from "../../../auth";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

async function handle(req: NextAuthenticatedRequest, res: NextApiResponse) {
  const { email } = req.user;

  if (!email) {
    res.status(400).json({
      message: "You need to register your name to submit a suggestion",
    });
  }
  try {
    const birthday = await prisma.birthday.update({
      where: { id: req.query.id as string },
      data: {
        gifts: {
          create: {
            description: req.body.description,
            url: req.body.url,
            suggestor: {
              connect: { email },
            },
          },
        },
      },
    });

    res.json(birthday);
  } catch (e) {
    res.status(400).json({ message: "Not possible to create a suggestion" });
  }

  await prisma.disconnect();
}

export default authorizedRoute(handle);

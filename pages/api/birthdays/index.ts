import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";
import { authorizedRoute, NextAuthenticatedRequest } from "../auth";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
};

const prisma = new PrismaClient();

async function handle(req: NextAuthenticatedRequest, res: NextApiResponse) {
  if (req.method?.toLowerCase() === "post") {
    return await create(req, res);
  }

  const birthdaysPerUser = await prisma.birthday.findMany({
    where: {
      contributors: {
        every: {
          email: req.query.email as string,
        },
      },
    },
  });

  res.json({
    birthdays: birthdaysPerUser,
  });

  await prisma.disconnect();
}

async function create(req: NextAuthenticatedRequest, res: NextApiResponse) {
  const createdBirthday = await prisma.birthday.create({
    data: {
      person: req.body.name,
      contributors: {
        connect: { email: req.user.email },
      },
    },
  });

  res.status(201).json(createdBirthday);

  await prisma.disconnect();
}

export default authorizedRoute(handle);

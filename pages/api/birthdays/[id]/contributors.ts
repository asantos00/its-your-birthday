import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';
import { authorizedRoute, NextAuthenticatedRequest } from "../../auth";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

async function handler(req: NextAuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return await authorizedRoute(post)(req, res);
  }

  return await authorizedRoute(patch)(req, res);
}

async function patch(req: NextAuthenticatedRequest, res: NextApiResponse) {
  const birthday = await prisma.birthday.update({
    where: { id: req.query.id as string },
    data: {
      contributors: {
        set: [req.body]
      }
    }
  });

  res.json(birthday)

  await prisma.disconnect()
}

async function post(req: NextAuthenticatedRequest, res: NextApiResponse) {
  const birthday = await prisma.contributor.create({
    data: {
      Birthday: {
        connect: { id: req.query.id as string }
      },
      name: req.body.name,
      email: req.user.email
    }
  })

  res.json(birthday)

  await prisma.disconnect()
}

export default handler

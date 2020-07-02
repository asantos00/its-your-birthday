import { PrismaClient } from '@prisma/client';
import { NextApiResponse } from 'next';
import { NextAuthenticatedRequest, authorizedRoute } from '../auth';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

const prisma = new PrismaClient();

async function handle(req: NextAuthenticatedRequest, res: NextApiResponse) {
  const createdBirthday = await prisma.birthday.create({
    data: {
      person: req.body.name,
    }
  })

  res.json(createdBirthday);

  await prisma.disconnect()
}

export default authorizedRoute(handle);

import { NextApiRequest } from "next";

export const getCookieForBirthdayId = (req: NextApiRequest, birthdayId: string) => {
  const birthdayCookie = req.cookies[`birthday-${req.query.id}`];
  return birthdayCookie ? JSON.parse(birthdayCookie) : {};
}

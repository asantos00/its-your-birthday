import { NextApiRequest } from "next";

export const getCookieForBirthdayId = (req: NextApiRequest, birthdayId: string) => {
  return JSON.parse(req.cookies[`birthday-${req.query.id}`])
}

import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

var client = jwksClient({
  jwksUri: 'https://its-your-birthday.eu.auth0.com/.well-known/jwks.json'
});

const authorize = async (req: NextApiRequest, res: NextApiResponse): Promise<JwtUser> => {
  function getKey(header: any, callback: any) {
    client.getSigningKey(header.kid, function (err, key: { publicKey?: string, rsaPublicKey?: string }) {
      if (err) {
        return callback(err);
      }

      var signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  }

  return new Promise((res, rej) => {
    const { authorization } = req.headers;

    jwt.verify(
      authorization?.replace('Bearer ', '') as string,
      getKey,
      {
        audience: ''
      },
      (err, decoded) => {
        if (err) {
          return rej(err)
        }

        res(decoded as JwtUser);
      }
    );
  });
}

type NextRequestHandler = (req: NextAuthenticatedRequest, res: NextApiResponse) => Promise<void>;

interface JwtUser {
  nickname: string,
  name: string,
  picture: string
  updated_at: Date
  email: string
  email_verified: boolean
}
export interface NextAuthenticatedRequest extends NextApiRequest {
  user: JwtUser
}

export const authorizedRoute = (handler: NextRequestHandler) => async (req: NextAuthenticatedRequest, res: NextApiResponse) => {
  try {
    const userFromJwt = await authorize(req, res);
    req.user = userFromJwt;

    await handler(req, res);
  } catch (e) {
    return res.status(403).end();
  }
}

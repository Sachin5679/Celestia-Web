import { Request, Response, NextFunction } from "express";
import { getAuthTokenFromHeader } from "../utils";
import jwt from "jsonwebtoken";

export function authorisedOnly(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = getAuthTokenFromHeader(req as any);
  console.log(token);
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.KEY, (err, admin) => {
    if (err) return res.status(200).send({ invalidToken: true });

    if (!(admin as any).access) return res.sendStatus(401);

    if ((admin as any).access != process.env.ADMIN_KEY)
      return res.sendStatus(401);

    next();
  });
}

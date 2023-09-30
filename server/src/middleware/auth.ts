import { Request, Response, NextFunction } from "express";

export function authorisedOnly(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.headers.authorization != process.env.ADMIN_KEY)
    return res.send({ invalidToken: true });
  next();
}

import type {Request, Response, NextFunction} from 'express';
import {auth} from '@repo/auth';
import { fromNodeHeaders } from "better-auth/node";


declare global {
  namespace Express {
    interface Request {
      user: { id: string; name: string; email: string };
    }
  }
}


export async function authGuard(req: Request, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });

  if (!session?.user) {
    return res.status(401).json({ code: "UNAUTHORIZED", message: "Login required" });
  }

  req.user = session.user;
  next();
}
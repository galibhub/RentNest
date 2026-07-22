import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import config from "../config";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { catchAsync } from "../utils/catchAsync";
import { Role } from "../../prisma/generated/prisma/enums";

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
      };
    }
  }
}

export {};

const auth = (...requiredRoles: Role[]) => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // Get token from Cookie or Authorization Header
      const token = req.cookies.accessToken
        ? req.cookies.accessToken
        : req.headers.authorization?.startsWith("Bearer ")
          ? req.headers.authorization.split(" ")[1]
          : req.headers.authorization;

      if (!token) {
        throw new Error(
          "You are not logged in. Please login to access this resource",
        );
      }

      // Verify JWT
      const decoded = jwtUtils.verifyToken(
        token,
        config.jwt_access_secret,
      ) as JwtPayload;

      const { id, email, role } = decoded;

      // Role Authorization
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new Error(
          "Forbidden. You don't have permission to access this resource",
        );
      }

      // Check user exists
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          id,
        },
      });

      // Check user status
      if (user.status !== "ACTIVE") {
        throw new Error("User is not active");
      }

      // Attach user to request
      req.user = {
        id,
        email,
        role,
      };

      next();
    },
  );
};

export default auth;
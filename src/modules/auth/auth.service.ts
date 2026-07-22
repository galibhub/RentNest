import config from "../../config";
import { prisma } from "../../lib/prisma";
import { TRegisterUser, TLoginUser } from "./auth.interface";
import { Role } from "../../../prisma/generated/prisma/enums";
import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from "../../utils/jwt";


const registerUser = async (payload: TRegisterUser) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (isUserExists) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      phone: payload.phone,
      profileImage: payload.profileImage,
      role: payload.role,
    },
  });

  const { password, ...userWithoutPassword } = result;

  return userWithoutPassword;
};

//=========================> login user==================<

const loginUser = async (payload: TLoginUser) => {
  // Step 1: Find user by email
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  // Step 2: Check user status
  if (user.status !== "ACTIVE") {
    throw new Error("User is not active");
  }

  // Step 3: Compare password
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!isPasswordMatched) {
    throw new Error("Incorrect password");
  }

  // Step 4: Create JWT Payload
  const jwtPayload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  // Step 5: Generate Access Token
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as any,
  );

  // Step 6: Generate Refresh Token
  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as any,
  );

  // Step 7: Prepare user data
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    profileImage: user.profileImage,
    role: user.role,
    status: user.status,
  };

  return {
    accessToken,
    refreshToken,
    user: userData,
  };
};



const refreshToken = async (refreshToken: string) => {
  const decoded = jwtUtils.verifyToken(
    refreshToken,
    config.jwt_refresh_secret,
  ) as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: decoded.id,
    },
  });


  if (user.status !== "ACTIVE") {
    throw new Error("User is not active");
  }

  const jwtPayload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as any,
  );

  return {
    accessToken,
  };
};



export const AuthService = {
  registerUser,
  loginUser,
  refreshToken,
  
};

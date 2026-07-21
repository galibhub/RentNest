import config from "../../config";
import { prisma } from "../../lib/prisma";
import { TRegisterUser, TLoginUser } from "./auth.interface";
import { Role } from "../../../prisma/generated/prisma/enums";
import bcrypt from "bcryptjs";

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
    Number(config.bcrypt_salt_rounds)
  );

  const result = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      phone: payload.phone,
      profileImage: payload.profileImage,
      role: Role.TENANT,
    },
  });

  const { password, ...userWithoutPassword } = result;

  return userWithoutPassword;
};

const loginUser = async (payload: TLoginUser) => {};

export const AuthService = {
  registerUser,
  loginUser,
};
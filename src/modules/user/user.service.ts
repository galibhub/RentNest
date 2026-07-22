import { prisma } from "../../lib/prisma";
import { userSelect } from "./user.constant";
import { TUpdateProfile } from "./user.interface";

//getME
const getMe = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: userSelect,
  });

  return user;
};

//get all user
const getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: userSelect,
  });
};

//update user 
const updateProfile = async (
  userId: string,
  targetUserId: string,
  payload: TUpdateProfile
) => {
  if (userId !== targetUserId) {
    throw new Error("You are not allowed to update this profile");
  }

  await prisma.user.findUniqueOrThrow({
    where: {
      id: targetUserId,
    },
  });

  return prisma.user.update({
    where: {
      id: targetUserId,
    },
    data: payload,
    select: userSelect,
  });
};

export const UserService = {
  getMe,
  getAllUsers,
  updateProfile,
};

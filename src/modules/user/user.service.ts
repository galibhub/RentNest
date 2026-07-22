import { prisma } from "../../lib/prisma";
import { userSelect } from "./user.constant";

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

export const UserService = {
  getMe,
  getAllUsers,
};

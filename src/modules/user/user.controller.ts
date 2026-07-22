import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";
import httpStatus from "http-status";

const getMe = catchAsync(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new Error("Unauthorized");
  }

  const result = await UserService.getMe(user.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile retrieved successfully",
    data: result,
  });
});

//get all user
const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsers();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users retrieved successfully",
    data: result,
  });
});

//update user
const updateProfile = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const id = req.params.id as string;

  const result = await UserService.updateProfile(userId, id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully",
    data: result,
  });
});

export const UserController = {
  getMe,
  getAllUsers,
  updateProfile,
};

import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";

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

export const UserController = {
  getMe,
};

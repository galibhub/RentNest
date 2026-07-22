export type TUpdateProfile = {
  name?: string;
  phone?: string;
  profileImage?: string;
};

export type TUpdateUserStatus = {
  status: "ACTIVE" | "BLOCKED";
};
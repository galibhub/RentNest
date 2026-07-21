export type TRegisterUser = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profileImage?: string;
};

export type TLoginUser = {
  email: string;
  password: string;
};
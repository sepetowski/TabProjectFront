export interface UserRegisterResponseData {
  id: string;
  email: string;
  username: string;
}

export interface UserLoginResponseData {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  jsonWebToken: string;
  jsonWebTokenExpires: Date;
  refreshToken: string;
  refreshTokenExpires: Date;
  role: UserRole;
}

export interface UserLoginData {
  username: string;
  password: string;
}

export interface UserRegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  adminRoleKey?: string;
}

export interface RefreshTokenRes {
  token: string;
  refreshToken: string;
  tokenExpires: string;
  refreshTokenExpires: Date;
}
export interface RefreshTokenReq {
  token: string;
  refreshToken: string;
}

export interface Message {
  type: 'error' | 'success';
  message: string;
}
export enum UserRole {
  admin = 0,
  user = 1,
}

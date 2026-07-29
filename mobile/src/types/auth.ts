export type User = {
  id: number;
  name: string;
  lastName: string;
  email: string;
  isActive: boolean;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthResponse = {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
};

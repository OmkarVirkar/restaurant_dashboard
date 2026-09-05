export type AuthenticatedUser = {
  sub: number;
  email: string;
  role: string;
};

export type RefreshTokenPayload = AuthenticatedUser & {
  tokenType: 'refresh';
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
};

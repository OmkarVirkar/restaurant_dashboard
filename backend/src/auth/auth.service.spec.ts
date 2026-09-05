import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import type { DatabaseUser } from '../database/database.adapter';
import { DatabaseService } from '../database/database.service';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  const databaseUser: DatabaseUser = {
    id: 1,
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    role: 'Customer',
    passwordHash: bcrypt.hashSync('correct-password', 4),
  };
  const databaseMock = {
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
  };
  const databaseService = databaseMock as unknown as DatabaseService;
  const tokenService = {
    signAccessToken: jest.fn().mockReturnValue('signed-access-token'),
    signRefreshToken: jest.fn().mockReturnValue('signed-refresh-token'),
  } as unknown as TokenService;
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService(databaseService, tokenService);
  });

  it('registers a customer and returns a token without exposing the password hash', async () => {
    databaseMock.findUserByEmail.mockResolvedValue(null);
    databaseMock.createUser.mockResolvedValue(databaseUser);

    const response = await authService.register({
      name: 'Alice Smith',
      email: ' Alice.Smith@example.com ',
      password: 'correct-password',
    });

    expect(databaseMock.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'alice.smith@example.com',
        role: 'Customer',
      }),
    );
    expect(response).toEqual({
      accessToken: 'signed-access-token',
      refreshToken: 'signed-refresh-token',
      user: {
        id: 1,
        name: 'Alice Smith',
        email: 'alice.smith@example.com',
        role: 'Customer',
      },
    });
  });

  it('rejects duplicate email registration', async () => {
    databaseMock.findUserByEmail.mockResolvedValue(databaseUser);

    await expect(
      authService.register({
        name: 'Another User',
        email: databaseUser.email,
        password: 'correct-password',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in with a valid password', async () => {
    databaseMock.findUserByEmail.mockResolvedValue(databaseUser);

    await expect(
      authService.login({
        email: databaseUser.email,
        password: 'correct-password',
      }),
    ).resolves.toMatchObject({ accessToken: 'signed-access-token' });
  });

  it('exchanges a valid refresh token for a new token pair', async () => {
    databaseMock.findUserByEmail.mockResolvedValue(databaseUser);
    tokenService.verifyRefreshToken = jest.fn().mockReturnValue({
      sub: databaseUser.id,
      email: databaseUser.email,
      role: databaseUser.role,
      tokenType: 'refresh',
    });

    await expect(
      authService.refresh({ refreshToken: 'valid-refresh-token' }),
    ).resolves.toEqual({
      accessToken: 'signed-access-token',
      refreshToken: 'signed-refresh-token',
      user: {
        id: databaseUser.id,
        name: databaseUser.name,
        email: databaseUser.email,
        role: databaseUser.role,
      },
    });
  });

  it('rejects an invalid refresh token', async () => {
    tokenService.verifyRefreshToken = jest.fn().mockImplementation(() => {
      throw new Error('expired');
    });

    await expect(
      authService.refresh({ refreshToken: 'expired-refresh-token' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects invalid or unset passwords with the same public error', async () => {
    databaseMock.findUserByEmail.mockResolvedValue({
      ...databaseUser,
      passwordHash: null,
    });

    await expect(
      authService.login({
        email: databaseUser.email,
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

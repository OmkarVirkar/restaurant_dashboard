import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';
import type { DatabaseUser } from '../database/database.adapter';
import type {
  AuthResponse,
  AuthenticatedUser,
  RefreshTokenPayload,
} from './auth.types';
import type { LoginDto } from './dto/login.dto';
import type { RefreshTokenDto } from './dto/refresh-token.dto';
import type { RegisterDto } from './dto/register.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const email = this.normalizeEmail(registerDto.email);
    const existingUser = await this.databaseService.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    const passwordHash = await bcrypt.hash(registerDto.password, 12);
    const user = await this.databaseService.createUser({
      name: registerDto.name.trim(),
      email,
      role: 'Customer',
      passwordHash,
    });

    return this.createAuthResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const email = this.normalizeEmail(loginDto.email);
    const user = await this.databaseService.findUserByEmail(email);

    if (!user || !(await this.hasValidPassword(loginDto.password, user))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.createAuthResponse(user);
  }

  async refresh(refreshTokenDto: RefreshTokenDto): Promise<AuthResponse> {
    let payload: RefreshTokenPayload;

    try {
      payload = this.tokenService.verifyRefreshToken<RefreshTokenPayload>(
        refreshTokenDto.refreshToken,
      );
    } catch {
      throw new UnauthorizedException('Refresh token is invalid or expired.');
    }

    if (payload.tokenType !== 'refresh' || !payload.sub) {
      throw new UnauthorizedException('Refresh token is invalid or expired.');
    }

    const user = await this.databaseService.findUserByEmail(payload.email);

    if (!user || user.id !== payload.sub) {
      throw new UnauthorizedException('Refresh token is invalid or expired.');
    }

    return this.createAuthResponse(user);
  }

  private async hasValidPassword(
    password: string,
    user: DatabaseUser,
  ): Promise<boolean> {
    return (
      user.passwordHash !== null &&
      (await bcrypt.compare(password, user.passwordHash))
    );
  }

  private createAuthResponse(user: DatabaseUser): AuthResponse {
    const payload: AuthenticatedUser = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.tokenService.signAccessToken(payload),
      refreshToken: this.tokenService.signRefreshToken({
        ...payload,
        tokenType: 'refresh',
      }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}

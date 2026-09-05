import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import * as jwt from 'jsonwebtoken';
import { resolveAuthConfig } from './auth.config';

@Injectable()
export class TokenService {
  private readonly config = resolveAuthConfig();

  signAccessToken<T extends object>(payload: T): string {
    return jwt.sign(payload, this.config.jwtSecret, {
      expiresIn: this.config.jwtExpiresInSeconds,
    });
  }

  signRefreshToken<T extends object>(payload: T): string {
    return jwt.sign(payload, this.config.refreshJwtSecret, {
      expiresIn: this.config.refreshTokenExpiresInSeconds,
      jwtid: randomUUID(),
    });
  }

  verifyAccessToken<T extends object>(token: string): T {
    return this.verify(token, this.config.jwtSecret);
  }

  verifyRefreshToken<T extends object>(token: string): T {
    return this.verify(token, this.config.refreshJwtSecret);
  }

  private verify<T extends object>(token: string, secret: string): T {
    const payload = jwt.verify(token, secret);

    if (typeof payload !== 'object' || payload === null) {
      throw new Error('JWT payload must be an object.');
    }

    return payload as T;
  }
}

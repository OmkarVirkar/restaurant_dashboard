export type AuthConfig = {
  jwtSecret: string;
  jwtExpiresInSeconds: number;
  refreshJwtSecret: string;
  refreshTokenExpiresInSeconds: number;
};

const developmentJwtSecret =
  'development-only-change-this-secret-before-production-123';
const developmentRefreshJwtSecret =
  'development-only-change-this-refresh-secret-before-production-456';

function parsePositiveInteger(
  value: string | undefined,
  fallback: number,
): number {
  const parsed = Number(value ?? fallback);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function resolveAuthConfig(
  env: NodeJS.ProcessEnv = process.env,
): AuthConfig {
  const jwtSecret = env.JWT_SECRET ?? developmentJwtSecret;
  const refreshJwtSecret =
    env.REFRESH_JWT_SECRET ?? developmentRefreshJwtSecret;

  if (
    env.NODE_ENV === 'production' &&
    (env.JWT_SECRET === undefined || env.REFRESH_JWT_SECRET === undefined)
  ) {
    throw new Error(
      'JWT_SECRET and REFRESH_JWT_SECRET must be configured in production.',
    );
  }

  return {
    jwtSecret,
    jwtExpiresInSeconds: parsePositiveInteger(env.JWT_EXPIRES_IN_SECONDS, 3600),
    refreshJwtSecret,
    refreshTokenExpiresInSeconds: parsePositiveInteger(
      env.REFRESH_TOKEN_EXPIRES_IN_SECONDS,
      604800,
    ),
  };
}

import { ApiProperty } from '@nestjs/swagger';

export class AuthenticatedUserDocument {
  @ApiProperty({ example: 1 })
  sub!: number;

  @ApiProperty({ example: 'alice.smith@example.com' })
  email!: string;

  @ApiProperty({ example: 'Customer' })
  role!: string;
}

export class AuthUserDocument {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Alice Smith' })
  name!: string;

  @ApiProperty({ example: 'alice.smith@example.com' })
  email!: string;

  @ApiProperty({ example: 'Customer' })
  role!: string;
}

export class AuthResponseDocument {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken!: string;

  @ApiProperty({ type: AuthUserDocument })
  user!: AuthUserDocument;
}

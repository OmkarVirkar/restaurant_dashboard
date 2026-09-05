import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'alice.smith@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'correct-password', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;
}

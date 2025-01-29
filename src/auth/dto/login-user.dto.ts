import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsMongoId } from 'class-validator';
export interface AuthPayload {
  name: string;
  email: string;
  sub: string |unknown; // Typically used to represent the user ID
  // permissions: string[];
}

export class LoginUserDto {
  @ApiProperty({ example: 'email', description: 'The email of the user.' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password', description: 'The password of the user.' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'dhkshfkashfashdfh346126347' ,required:true})
  @IsMongoId()
  userId: string;
  @ApiProperty({ example: 'refresh-token-sample' })
  refreshToken: string;
}


import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsMongoId,
} from 'class-validator';
import mongoose from 'mongoose';
import { generateRegisterUser } from 'src/utils/faker.swagger';

export class RegisterUserDto {
  @ApiProperty({
    example: generateRegisterUser().name,
    description: 'The name of the user.',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: generateRegisterUser().email,
    description: 'The email of the user.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: generateRegisterUser().password,
    description: 'The password of the user.',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: generateRegisterUser().age,
    description: 'The age of the user.',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiProperty({
    example: ['679332e8b830f37826799270'],
    description: "User's role",
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  roles?: mongoose.Schema.Types.ObjectId[];

  @IsOptional()
  refreshToken?: string;
}

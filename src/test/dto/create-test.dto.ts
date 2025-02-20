import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { generateRegisterUser } from 'src/utils/faker.swagger';

export class CreateTestDto {
  @ApiProperty({
    example: generateRegisterUser().name,
    description: 'The name of the user.',
  })
  @IsString()
  name: string;
  
  @ApiProperty({
    example: generateRegisterUser().age,
    description: 'The age of the user.',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  age?: number;

  @ApiProperty({
    example: '6793313715a71e6f71b4ae31',
    description: "User's role",
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  role?: mongoose.Schema.Types.ObjectId;
}

import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { ApiBody } from '@nestjs/swagger';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { LoginUserDto, RefreshTokenDto } from './dto/login-user.dto';
import mongoose from 'mongoose';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register')
  @ApiBody({
    description: 'Register a new user',
    type: RegisterUserDto,
  })
  async register(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      age?: number;
      roles?: mongoose.Schema.Types.ObjectId[];
    },
  ) {
    const { name, email, password, age, roles } = body;

    if (!name || !email || !password) {
      throw new BadRequestException('Name, email, and password are required.');
    }

    return this.authService.registerUser(name, email, password, age, roles);
  }

  @Post('login')
  @ApiBody({
    description: 'Log in with email and password',
    type: LoginUserDto,
  })
  async login(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }

  @Post('refresh')
  async refreshToken(@Body() body: RefreshTokenDto) {
    const refreshToken = body?.refreshToken;
    if (!refreshToken) {
      throw new HttpException(
        'Refresh token is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.authService.refreshAccessToken(refreshToken);
  }
}

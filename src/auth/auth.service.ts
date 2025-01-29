import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthPayload, LoginUserDto } from './dto/login-user.dto';
import config from 'src/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async validateUser(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
  async registerUser(
    name: string,
    email: string,
    password: string,
    age?: number,
    roles?: mongoose.Schema.Types.ObjectId[],
  ): Promise<User> {
    // Check if the email is already registered
    const existingUser = await this.userService.isUserExistsByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email already registered.');
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const userData = {
      name,
      email,
      password: hashedPassword,
      age,
      roles,
    };
    const newUser = await this.userService.create(userData);
    if (!newUser) throw new HttpException('Invalid Payload', 400);
    return newUser;
  }

  async login(userDto: LoginUserDto) {
    const { email, password } = userDto;
    const user = await this.userService.findUserByEmail(email); // Replace with DB query
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.validateUser(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const permissions = await this.userService.userPermissions(
      user?._id as string,
    );
    const payload: AuthPayload = {
      name: user.name,
      email: user.email,
      sub: user._id,
      permissions,
    };
    const access_token = this.generateAccessToken(payload);
    const refresh_token = this.generateRefreshToken(payload);
    // Hash and store the refresh token in the database
    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
    user.refreshToken = hashedRefreshToken;
    await user.save();

    return { ...payload, access_token, refresh_token };
  }

  private generateAccessToken(payload: AuthPayload): string {
    console.log({payload})
    const a= this.jwtService.sign(payload, { expiresIn: '15m', secret: config.jwtSecret});

    console.log({a})
    return a
  }

  private generateRefreshToken(payload: AuthPayload): string {
    return this.jwtService.sign(payload, {
      secret: config?.jwtRefreshSecret,
      expiresIn: '7d',
    });
  }
  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      // Verify and decode the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: config?.jwtRefreshSecret,
      });

      // You can validate user and permissions here if needed
      const userId = payload.sub;
      const user = await this.userService.findOne(userId);
      console.log({ user });
      if (!user || !user.refreshToken) {
        throw new Error('Invalid user or refresh token');
      }

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

      console.log({ isValid });
      if (!isValid) {
        throw new Error('Invalid refresh token');
      }
      // Generate a new access token
      const newAccessToken = this.generateAccessToken(payload);
      console.log({ newAccessToken });
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}

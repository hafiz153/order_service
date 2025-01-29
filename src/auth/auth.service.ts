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
import { AuthPayload, LoginUserDto, RefreshTokenDto } from './dto/login-user.dto';
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
      sub: user._id
    };
    const access_token = this.generateAccessToken(payload);
    const refresh_token = this.generateRefreshToken(user._id as string);
    // Hash and store the refresh token in the database
    const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);

    await this.userService.update(user._id as string, {
      refreshToken: hashedRefreshToken,
    });

    return { ...payload, access_token, refresh_token,permissions};
  }

  private generateAccessToken(payload: AuthPayload): string {
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  
  }

  private generateRefreshToken(id: string): string {
    return this.jwtService.sign({sub:id}, {
      secret: config?.jwtRefreshSecret,
      expiresIn: '7d',
    });
  }
  async refreshAccessToken(
    body: RefreshTokenDto,
  ): Promise<any> {
    try {


      // You can validate user and permissions here if needed
      const userId = body.userId;
      const refreshToken = body.refreshToken;
      const user = await this.userService.findOne(userId);
      if (!user || !user.refreshToken) {
        throw new Error('Invalid user or refresh token');
      }

      const isValid = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isValid) {
        throw new Error('Invalid refresh token');
      }
      // Generate a new access token
      const accessTokenDto:AuthPayload= {
        name: user?.name,
        email: user?.email,
        sub: user?._id, // Typically used to represent the user ID
      }
      const newAccessToken = this.generateAccessToken(accessTokenDto);
      const permissions = await this.userService.userPermissions(
        user?._id as string,
      );
      return { ...accessTokenDto,accessToken: newAccessToken,permissions };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}

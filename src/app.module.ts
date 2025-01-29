import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleModule } from './role/role.module';
import config from './config';

@Module({
  imports: [  MongooseModule.forRoot(config.mongoURL),AuthModule, UsersModule, RoleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

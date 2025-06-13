import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { AppController } from './app.controller';
import { 
  Organization, 
  User,
  Conversation,
  Message,
  UserActivity,
  DataIntegration
} from './database/entities';

declare const process: {
  env: Record<string, string | undefined>;
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/infinure',
        entities: [Organization, User, Conversation, Message, UserActivity, DataIntegration],
        synchronize: true, // Force synchronize for development
        logging: true, // Enable logging to see what's happening
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }),
    }),
    AuthModule,
    UsersModule,
    OrganizationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {} 
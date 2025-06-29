import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

declare const process: {
  env: Record<string, string | undefined>;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'supersecret-change-in-production',
    });
  }

  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      organizationId: payload.orgId, 
      role: payload.role,
      email: payload.email 
    };
  }
} 
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '../database/entities/user.entity';
import { Organization } from '../database/entities/organization.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    @InjectRepository(Organization) private organizationsRepo: Repository<Organization>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepo.findOne({ 
      where: { email }, 
      relations: ['organization'] 
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.passwordHash) throw new UnauthorizedException('Invalid credentials');
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
    
    return user;
  }

  async login(email: string, password: string, code?: string) {
    const user = await this.validateUser(email, password);
    
    // MFA verification if enabled
    if (user.mfaEnabled) {
      if (!code) throw new UnauthorizedException('MFA code required');
      const speakeasy = require('speakeasy');
      const isValid = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: code,
      });
      if (!isValid) throw new UnauthorizedException('Invalid MFA code');
    }

    // Update last login
    user.lastLogin = new Date();
    await this.usersRepo.save(user);

    const payload = { 
      sub: user.id, 
      orgId: user.organizationId, 
      role: user.role,
      email: user.email 
    };
    
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        organizationId: user.organizationId,
        mfaEnabled: user.mfaEnabled
      },
    };
  }

  async signup(data: { 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string; 
    organizationName: string;
    industryType?: string;
  }) {
    const existing = await this.usersRepo.findOne({ where: { email: data.email } });
    if (existing) throw new UnauthorizedException('Email already registered');

    // Create organization record
    const slug = data.organizationName.toLowerCase().replace(/\s+/g, '-');
    let organization = await this.organizationsRepo.findOne({ where: { slug } });
    
    if (!organization) {
      organization = this.organizationsRepo.create({
        name: data.organizationName,
        slug,
        industryType: data.industryType || 'saas',
        subscriptionTier: 'starter'
      });
      await this.organizationsRepo.save(organization);
    }

    // Create first user as CEO
    const hash = await bcrypt.hash(data.password, 12);
    const user = this.usersRepo.create({
      email: data.email,
      passwordHash: hash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: UserRole.CEO, // First user is CEO
      organizationId: organization.id,
      isActive: true
    });
    
    await this.usersRepo.save(user);

    const payload = { 
      sub: user.id, 
      orgId: organization.id, 
      role: user.role,
      email: user.email
    };
    
    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        organizationId: user.organizationId,
        mfaEnabled: user.mfaEnabled
      },
    };
  }

  async enableMfa(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    
    const speakeasy = require('speakeasy');
    const qrcode = require('qrcode');
    
    const secret = speakeasy.generateSecret({ 
      name: `Infinure (${user.email})`,
      issuer: 'Infinure'
    });
    
    user.mfaSecret = secret.base32;
    await this.usersRepo.save(user);
    
    const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);
    
    return { 
      secret: secret.base32, 
      otpauthUrl: secret.otpauth_url, 
      qrCodeDataUrl 
    };
  }

  async verifyMfa(userId: string, token: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user || !user.mfaSecret) throw new UnauthorizedException('MFA not setup');
    
    const speakeasy = require('speakeasy');
    const verified = speakeasy.totp.verify({ 
      secret: user.mfaSecret, 
      encoding: 'base32', 
      token,
      window: 2 // Allow some time drift
    });
    
    if (!verified) throw new UnauthorizedException('Invalid MFA code');
    
    user.mfaEnabled = true;
    await this.usersRepo.save(user);
    
    return { success: true };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.usersRepo.findOne({ where: { id: payload.sub } });
      
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid token');
      }

      const newPayload = { 
        sub: user.id, 
        orgId: user.organizationId, 
        role: user.role,
        email: user.email 
      };
      
      return {
        accessToken: await this.jwtService.signAsync(newPayload),
        refreshToken: await this.jwtService.signAsync(newPayload, { expiresIn: '7d' })
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
} 
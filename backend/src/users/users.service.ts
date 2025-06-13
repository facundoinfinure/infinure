import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../database/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ 
      where: { email },
      relations: ['organization']
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ 
      where: { id },
      relations: ['organization']
    });
  }

  async findByOrganization(organizationId: string): Promise<User[]> {
    return this.usersRepo.find({ 
      where: { organizationId },
      relations: ['organization']
    });
  }

  async create(userData: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    organizationId: string;
    department?: string;
  }): Promise<User> {
    const user = this.usersRepo.create(userData);
    return this.usersRepo.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    await this.usersRepo.update(id, data);
    return this.findById(id);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepo.update(id, { lastLogin: new Date() });
  }
} 
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../database/entities/organization.entity';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationsRepo: Repository<Organization>,
  ) {}

  async findById(id: string): Promise<Organization | null> {
    return this.organizationsRepo.findOne({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Organization | null> {
    return this.organizationsRepo.findOne({ where: { slug } });
  }

  async create(data: {
    name: string;
    slug: string;
    industryType: string;
    subscriptionTier?: string;
    settings?: Record<string, any>;
  }): Promise<Organization> {
    const organization = this.organizationsRepo.create({
      ...data,
      subscriptionTier: data.subscriptionTier || 'starter',
      settings: data.settings || {},
    });
    
    return this.organizationsRepo.save(organization);
  }

  async update(id: string, data: Partial<Organization>): Promise<Organization | null> {
    await this.organizationsRepo.update(id, data);
    return this.findById(id);
  }
} 
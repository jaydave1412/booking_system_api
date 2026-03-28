import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { Services } from 'generated/prisma/client';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateServiceDto): Promise<Services> {
    const service = await this.prisma.services.create({
      data: {
        title: dto.title,
        description: dto.description,
        cost: dto.cost,
      },
    });

    return service;
  }

  async findAll(): Promise<Services[]> {
    const services = await this.prisma.services.findMany();
    return services;
  }

  async findById(id: string): Promise<Services> {
    const service = await this.prisma.services.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with id ${id} not found`);
    }
    return service;
  }

  async update(id: string, dto: UpdateServiceDto) {
    const data: Partial<Services> = {
      ...(dto.title && { title: dto.title }),
      ...(dto.description && { description: dto.description }),
      ...(dto.cost && { cost: dto.cost }),
    };
    const service = await this.prisma.services.update({
      where: { id },
      data,
    });
    return service;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.services.delete({ where: { id } });
  }
}

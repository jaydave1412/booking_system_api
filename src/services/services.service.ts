import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-service.dto';
import { Services } from 'generated/prisma/client';
import { UpdateEventDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventDto): Promise<Services> {
    const service = await this.prisma.services.create({
      data: {
        title: dto.title,
        description: dto.description,
        date: dto.date,
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

  async update(id: string, dto: UpdateEventDto) {
    const data: Partial<Services> = {
      ...(dto.title && { title: dto.title }),
      ...(dto.description && { description: dto.description }),
      ...(dto.date && { date: dto.date }),
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

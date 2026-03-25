import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Events } from 'generated/prisma/client';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventDto): Promise<Events> {
    const event = await this.prisma.events.create({
      data: {
        title: dto.title,
        description: dto.description,
        date: dto.date,
      },
    });

    return event;
  }

  async findAll(): Promise<Events[]> {
    const events = await this.prisma.events.findMany();
    return events;
  }

  async findById(id: string): Promise<Events> {
    const event = await this.prisma.events.findUnique({ where: { id } });
    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }
    return event;
  }

  async update(id: string, dto: UpdateEventDto) {
    const data: Partial<Events> = {
      ...(dto.title && { title: dto.title }),
      ...(dto.description && { description: dto.description }),
      ...(dto.date && { date: dto.date }),
    };
    const event = await this.prisma.events.update({
      where: { id },
      data,
    });
    return event;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.events.delete({ where: { id } });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

const bookingInclude = {
  customer: { select: { id: true, name: true, email: true } },
  service: {
    select: {
      id: true,
      title: true,
      description: true,
      cost: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.booking.findMany({ include: bookingInclude });
  }

  findUserBookings(customerId: string) {
    return this.prisma.booking.findMany({
      where: { customerId },
      include: bookingInclude,
    });
  }

  async create(customerId: string, dto: CreateBookingDto) {
    console.log(dto, 'booking dto');
    return this.prisma.booking.create({
      data: { customerId, serviceId: dto.serviceId, date: dto.date },
      include: bookingInclude,
    });
  }

  update(id: string, dto: UpdateBookingDto) {
    return this.prisma.booking.update({
      where: { id },
      data: { status: dto.status },
      include: bookingInclude,
    });
  }
}

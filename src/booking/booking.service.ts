import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

const bookingInclude = {
  customer: { select: { id: true, name: true, email: true } },
  event: true,
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
    const existing = await this.prisma.booking.findUnique({
      where: { customerId_eventId: { customerId, eventId: dto.eventId } },
    });

    if (existing) {
      throw new ConflictException('You have already booked this event');
    }

    return this.prisma.booking.create({
      data: { customerId, eventId: dto.eventId },
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

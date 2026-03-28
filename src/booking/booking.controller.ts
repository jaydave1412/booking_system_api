import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get()
  @Roles('employee')
  findAll() {
    return this.bookingService.findAll();
  }

  @Get('me')
  @Roles('customer')
  findMyBookings(@Req() req: Request) {
    const user = req.user as { userId: string };
    return this.bookingService.findUserBookings(user.userId);
  }

  @Post()
  @Roles('customer')
  create(@Req() req: Request, @Body() dto: CreateBookingDto) {
    console.log('Creating booking with data:', dto);
    const user = req.user as { userId: string };
    return this.bookingService.create(user.userId, dto);
  }

  @Patch(':id')
  @Roles('employee')
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingService.update(id, dto);
  }
}

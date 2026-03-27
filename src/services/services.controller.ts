import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateEventDto } from './dto/create-service.dto';
import { UpdateEventDto } from './dto/update-service.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.servicesService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.servicesService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.servicesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.servicesService.delete(id);
  }
}

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('/login')
  login(@Body() dto: LoginDto) {
    return this.customerService.login(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles('employee')
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('employee')
  findById(@Param('id') id: string) {
    return this.customerService.findById(id);
  }
}

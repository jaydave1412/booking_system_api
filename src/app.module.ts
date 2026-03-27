import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { CustomerModule } from './customer/customer.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    PrismaModule,
    EmployeeModule,
    AuthModule,
    ServicesModule,
    CustomerModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

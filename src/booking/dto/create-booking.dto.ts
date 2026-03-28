import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  date: Date;
}

import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateBookingDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}

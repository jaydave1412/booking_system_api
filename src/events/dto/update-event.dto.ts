import { Type } from 'class-transformer';
import { IsString, IsDate, IsOptional } from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  date: Date;
}

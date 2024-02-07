import { IsEmail, IsString, ValidateIf, IsOptional } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateCompanyLeaveDto {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  LeaveType: string;

  @IsString()
  DateRange: string;
}

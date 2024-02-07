import { IsEmail, IsString, ValidateIf, IsOptional } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateLeaveDto {
  @PrimaryGeneratedColumn()
  id: number;

  // @IsString()
  // name: string;

  @IsString()
  leaveType: string;

  @IsString()
  @IsOptional()
  duration: string;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  date: string;

  @IsString()
  @IsOptional()
  comment: string;
}

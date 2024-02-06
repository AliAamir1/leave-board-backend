// import { PartialType } from '@nestjs/mapped-types';
// import { CreateUserDto } from './create-user.dto';

// export class UpdateUserDto extends PartialType(CreateUserDto) {}

import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Expose()
  firstName: string;

  @IsOptional()
  @IsString()
  @Expose()
  lastName: string;

  @IsOptional()
  @IsString()
  @Expose()
  password: string;

  @IsOptional()
  @IsString()
  @Expose()
  status: string;

  @IsOptional()
  @IsString()
  @Expose()
  resetKey: string;
}

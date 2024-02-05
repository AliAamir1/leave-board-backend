import { IsEmail, IsString, ValidateIf, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  // @ValidateIf((object, value) => !value)
  @IsOptional()
  email: string;

  @IsString()
  password: string;
}

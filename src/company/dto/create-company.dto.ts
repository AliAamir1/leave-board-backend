// import { IsString } from 'class-validator';

// export class CreateCompanyDto {
//   @IsString()
//   name: string;

//   @IsString()
//   category: string;

//   @IsString()
//   image: string;
// }

import { IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  // image: Buffer;

  userId: string;
}

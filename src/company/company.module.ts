import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CompanyService } from './company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './company.controller';
import * as multer from 'multer';
import { Company } from './entities/company.entity';
import { UserModule } from 'src/user/user.module';
import { EmailService } from './email.service';
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([Company]),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  controllers: [CompanyController],
  providers: [CompanyService, EmailService],
  exports: [TypeOrmModule.forFeature([Company]), CompanyService],
})
export class CompanyModule {}

import { Module } from '@nestjs/common';
import { CompanyLeaveService } from './company-leave.service';
import { CompanyLeaveController } from './company-leave.controller';
import { CompanyLeave } from './entities/company-leave.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyLeave])],
  controllers: [CompanyLeaveController],
  providers: [CompanyLeaveService],
})
export class CompanyLeaveModule {}

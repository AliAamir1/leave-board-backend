import { Module } from '@nestjs/common';
import { BridgeService } from './bridge.service';
import { BridgeController } from './bridge.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bridge } from './entities/bridge.entity';
import * as multer from 'multer';
import { CompanyService } from 'src/company/company.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bridge]),
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  controllers: [BridgeController],
  providers: [BridgeService],
  exports: [TypeOrmModule.forFeature([Bridge]), BridgeService],
})
export class BridgeModule {}

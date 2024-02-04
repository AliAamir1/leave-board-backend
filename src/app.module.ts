import { Module } from '@nestjs/common';
import { from } from 'rxjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Company } from './company/entities/company.entity';
import { Leave } from './leave/entities/leave.entity';
import { Bridge } from './bridge/entities/bridge.entity';
import { CompanyLeave } from './company-leave/entities/company-leave.entity';
import { CompanyModule } from './company/company.module';
import { AuthModule } from './auth/auth.module';
import { LeaveModule } from './leave/leave.module';
import { BridgeModule } from './bridge/bridge.module';
import { CompanyLeaveModule } from './company-leave/company-leave.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.local.env'] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        database: configService.get('DATABASE_NAME'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        synchronize: configService.get<boolean>('DATABASE_SYNC'),
        logging: configService.get<boolean>('DATABASE_LOGGING'),
        entities: {
          User,
          Company,
          Leave,
          Bridge,
          CompanyLeave,
        },
      }),
    }),
    UserModule,
    CompanyModule,
    AuthModule,
    LeaveModule,
    BridgeModule,
    CompanyLeaveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

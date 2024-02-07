import { Test, TestingModule } from '@nestjs/testing';
import { CompanyLeaveController } from './company-leave.controller';
import { CompanyLeaveService } from './company-leave.service';

describe('CompanyLeaveController', () => {
  let controller: CompanyLeaveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyLeaveController],
      providers: [CompanyLeaveService],
    }).compile();

    controller = module.get<CompanyLeaveController>(CompanyLeaveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

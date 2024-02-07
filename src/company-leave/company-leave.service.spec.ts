import { Test, TestingModule } from '@nestjs/testing';
import { CompanyLeaveService } from './company-leave.service';

describe('CompanyLeaveService', () => {
  let service: CompanyLeaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompanyLeaveService],
    }).compile();

    service = module.get<CompanyLeaveService>(CompanyLeaveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

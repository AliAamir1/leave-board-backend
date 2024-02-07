import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyLeaveDto } from './create-company-leave.dto';

export class UpdateCompanyLeaveDto extends PartialType(CreateCompanyLeaveDto) {}

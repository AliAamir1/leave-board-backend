import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaveDto } from './create-leave.dto';

export class UpdateLeaveDto extends PartialType(CreateLeaveDto) {}

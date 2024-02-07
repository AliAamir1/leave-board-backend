import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompanyLeaveService } from './company-leave.service';
import { CreateCompanyLeaveDto } from './dto/create-company-leave.dto';
import { UpdateCompanyLeaveDto } from './dto/update-company-leave.dto';

@Controller('companyLeave')
export class CompanyLeaveController {
  constructor(private readonly companyLeaveService: CompanyLeaveService) {}

  @Post()
  create(@Body() createCompanyLeaveDto: CreateCompanyLeaveDto) {
    return this.companyLeaveService.create(createCompanyLeaveDto);
  }

  @Get()
  findAll() {
    return this.companyLeaveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyLeaveService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyLeaveDto: UpdateCompanyLeaveDto,
  ) {
    return this.companyLeaveService.update(+id, updateCompanyLeaveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyLeaveService.remove(+id);
  }
}

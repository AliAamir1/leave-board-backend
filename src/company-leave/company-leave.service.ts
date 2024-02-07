import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyLeaveDto } from './dto/create-company-leave.dto';
import { UpdateCompanyLeaveDto } from './dto/update-company-leave.dto';
import { CompanyLeave } from './entities/company-leave.entity';

@Injectable()
export class CompanyLeaveService {
  constructor(
    @InjectRepository(CompanyLeave)
    private readonly companyRepository: Repository<CompanyLeave>,
  ) {}
  async create(createCompanyLeaveDto: CreateCompanyLeaveDto) {
    const companyLeave: CompanyLeave = new CompanyLeave();
    companyLeave.LeaveType = createCompanyLeaveDto.LeaveType;
    companyLeave.DateRange = createCompanyLeaveDto.DateRange;
    const result = await this.companyRepository.save(companyLeave);
    return {
      message: 'created successfully',
      status: 'success',
      data: { result },
    };
  }

  findAll() {
    return this.companyRepository.find();
  }

  findOne(id: number) {
    return this.companyRepository.find({ where: { id } });
  }

  // async update(id: number, updateLeaveDto: UpdateLeaveDto) {
  //   const leaveToUpdate = await this.leaveRepository.findOne({ where: { id } });

  //   if (!leaveToUpdate) {
  //     throw new NotFoundException('Leave not found.');
  //   }

  //   // Validate and update the necessary fields in leaveToUpdate with data from updateLeaveDto
  //   if (updateLeaveDto.comment) {
  //     leaveToUpdate.comment = updateLeaveDto.comment;
  //   }

  //   if (updateLeaveDto.status) {
  //     leaveToUpdate.status = updateLeaveDto.status;
  //   }

  //   // Update other fields as needed

  //   const updatedLeave = await this.leaveRepository.save(leaveToUpdate);

  //   return {
  //     message: 'Leave updated successfully',
  //     status: 'success',
  //     data: { updatedLeave },
  //   };

  //   // return `This action updates a #${id} leave`;
  // }

  async update(id: number, updateCompanyLeaveDto: UpdateCompanyLeaveDto) {
    const companyLeaveToUpdate = await this.companyRepository.findOne({
      where: { id },
    });

    if (!companyLeaveToUpdate) {
      throw new NotFoundException('Leave not found.');
    }

    //   // Validate and update the necessary fields in leaveToUpdate with data from updateLeaveDto
    if (updateCompanyLeaveDto.LeaveType) {
      companyLeaveToUpdate.LeaveType = updateCompanyLeaveDto.LeaveType;
    }

    if (updateCompanyLeaveDto.DateRange) {
      companyLeaveToUpdate.DateRange = updateCompanyLeaveDto.DateRange;
    }

    const updatedCompanyLeave =
      await this.companyRepository.save(companyLeaveToUpdate);

    return {
      message: 'Company Leave updated successfully',
      status: 'success',
      data: { updatedCompanyLeave },
    };

    // return `This action updates a #${id} companyLeave`;
  }

  async remove(id: number) {
    const found = await this.companyRepository.findOne({ where: { id } });
    if (found) {
      const del = this.companyRepository.delete(id);
      return { message: 'successfully deleted', status: 'success', data: del };
    } else {
      return { message: 'does not exist', status: 'failure', data: {} };
    }
  }
}

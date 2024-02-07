import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/company/entities/company.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { Leave } from './entities/leave.entity';

@Injectable()
export class LeaveService {
  constructor(
    private userService: UserService,
    @InjectRepository(Leave)
    private readonly leaveRepository: Repository<Leave>,
  ) {}

  async create(createLeaveDto: CreateLeaveDto, userId: number) {
    const leave: Leave = new Leave();

    // Validate and parse date range
    const dateRegex = /^(\d{1,2})([a-zA-Z]+)\s+to\s+(\d{1,2})([a-zA-Z]+)$/i;
    const dateMatch = createLeaveDto.date.match(dateRegex);

    if (!dateMatch) {
      throw new BadRequestException(
        'Invalid date format. Use "25OCT to 3NOV" format.',
      );
    }

    const [, startDay, startMonth, endDay, endMonth] = dateMatch;
    const startDate = new Date(`${startMonth} ${startDay}, 2023`);
    const endDate = new Date(`${endMonth} ${endDay}, 2023`);

    // Calculate duration in days
    const durationInMilliseconds = endDate.getTime() - startDate.getTime();
    const durationInDays = durationInMilliseconds / (24 * 60 * 60 * 1000);

    leave.leaveType = createLeaveDto.leaveType;
    leave.date = createLeaveDto.date;
    leave.duration = durationInDays.toString();
    leave.comment = '';
    leave.status = 'pending';

    // leave.user = await this.userService.findUserByID(userId);

    const user = await this.userService.findUserByID(userId);

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    // Set the name column with the user's name
    leave.name = user.firstName + ' ' + user.lastName;

    leave.user = user;

    const createdLeave = await this.leaveRepository.save(leave);

    return {
      message: 'Leave created successfully',
      status: 'success',
      data: { createdLeave },
    };
  }

  async createUser(createLeaveDto: CreateLeaveDto, userId: number) {
    const leave: Leave = new Leave();

    // Validate and parse date range
    // const dateRegex = /^(\d{1,2})([a-zA-Z]+)\s+to\s+(\d{1,2})([a-zA-Z]+)$/i;
    // const dateMatch = createLeaveDto.date.match(dateRegex);

    // if (!dateMatch) {
    //   throw new BadRequestException(
    //     'Invalid date format. Use "25OCT to 3NOV" format.',
    //   );
    // }

    // const [, startDay, startMonth, endDay, endMonth] = dateMatch;
    // const startDate = new Date(`${startMonth} ${startDay}, 2023`);
    // const endDate = new Date(`${endMonth} ${endDay}, 2023`);

    // Calculate duration in days
    // const durationInMilliseconds = endDate.getTime() - startDate.getTime();
    // const durationInDays = durationInMilliseconds / (24 * 60 * 60 * 1000);

    leave.leaveType = createLeaveDto.leaveType;
    leave.date = createLeaveDto.date;
    // leave.duration = durationInDays.toString();
    leave.duration = createLeaveDto.duration;
    leave.comment = createLeaveDto.comment;
    leave.status = 'pending';

    // leave.user = await this.userService.findUserByID(userId);

    const user = await this.userService.findUserByID(userId);

    if (!user) {
      throw new BadRequestException('User not found.');
    }

    // Set the name column with the user's name
    leave.name = user.firstName + ' ' + user.lastName;

    leave.user = user;

    const createdLeave = await this.leaveRepository.save(leave);

    return {
      message: 'Leave created successfully',
      status: 'success',
      data: { createdLeave },
    };
  }

  findAll() {
    return this.leaveRepository.find();
    // return `This action returns all leave`;
  }

  findOne(id: number) {
    return this.leaveRepository.findOne({ where: { id } });
    // return `This action returns a #${id} leave`;
  }

  async update(id: number, updateLeaveDto: UpdateLeaveDto) {
    const leaveToUpdate = await this.leaveRepository.findOne({ where: { id } });

    if (!leaveToUpdate) {
      throw new NotFoundException('Leave not found.');
    }

    // Validate and update the necessary fields in leaveToUpdate with data from updateLeaveDto
    if (updateLeaveDto.comment) {
      leaveToUpdate.comment = updateLeaveDto.comment;
    }

    if (updateLeaveDto.status) {
      leaveToUpdate.status = updateLeaveDto.status;
    }

    // Update other fields as needed

    const updatedLeave = await this.leaveRepository.save(leaveToUpdate);

    return {
      message: 'Leave updated successfully',
      status: 'success',
      data: { updatedLeave },
    };

    // return `This action updates a #${id} leave`;
  }

  async remove(id: number) {
    const found = await this.leaveRepository.findOne({ where: { id } });
    if (found) {
      const del = this.leaveRepository.delete(id);
      return { message: '', status: 'success', data: del };
    } else {
      return { message: 'does not exist', status: 'failure', data: {} };
    }
  }

  async findAllByUserId(userId: number) {
    const leaves = await this.leaveRepository.find({
      where: { user: { id: userId } },
    });

    return leaves;
  }

  async findAllLeaveRequestsByUserId(userId: number) {
    const user = await this.userService.findUserByID(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const leaveRequests = await this.leaveRepository.find({
      where: { user: { id: userId } },
    });

    return leaveRequests;
  }
}

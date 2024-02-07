import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';

interface CustomRequest extends Request {
  user: {
    userId: number;
  };
}

@Controller('leave')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  create(
    @Body(ValidationPipe) createLeaveDto: CreateLeaveDto,
    @Req() request: CustomRequest,
  ) {
    const id = request.user.userId;
    return this.leaveService.create(createLeaveDto, id);
  }

  @Post('details')
  createUser(
    @Body(ValidationPipe) createLeaveDto: CreateLeaveDto,
    @Req() request: CustomRequest,
  ) {
    const id = request.user.userId;
    return this.leaveService.createUser(createLeaveDto, id);
  }

  @Get()
  findAll() {
    return this.leaveService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeaveDto: UpdateLeaveDto) {
    return this.leaveService.update(+id, updateLeaveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveService.remove(+id);
  }

  // @Get('user/:userId')
  // findAllByUserId(@Param('userId') userId: string) {
  //   const parsedUserId = parseInt(userId, 10);

  //   if (isNaN(parsedUserId)) {
  //     throw new BadRequestException('Invalid userId');
  //   }

  //   return this.leaveService.findAllByUserId(parsedUserId);
  // }

  // the below one is the same

  @Get('details/:userId') //give userId to get all the leave details(all of a users(the user whose id is passed) requests)
  findAllLeaveRequestsByUserId(@Param('userId') userId: string) {
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedUserId)) {
      throw new BadRequestException('Invalid userId');
    }

    return this.leaveService.findAllLeaveRequestsByUserId(parsedUserId);
  }
}

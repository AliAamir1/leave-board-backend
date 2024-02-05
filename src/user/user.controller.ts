import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  Request,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from '../company/email.service';

import { User } from './entities/user.entity';
import { CompanyService } from 'src/company/company.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
    @Query('token') token: string | null,
  ) {
    return this.userService.create(createUserDto, token);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post('compare/:id')
  comparePassword(@Param('id') id: string, @Body('password') password: string) {
    return this.userService.comparePassword(+id, password);
  }

  // @Get('key')
  // findkey(email: string) {
  //   return this.userService.findKey(email);
  // }

  @Post('key')
  async findKey(@Body('email') email: string) {
    // const user = await this.userService.findKey(email);
    // console.log('check before', email);
    const user = await this.userService.findUserByEmail(email);
    // console.log('rtyui', user);
    if (user && user.resetKey) {
      return { resetKey: user.resetKey, status: 'success' };
    } else {
      return { message: 'Reset key not found', status: 'failure' };
    }
  }

  @Patch('reset')
  async resetPassword(@Body() resetData: { email: string; password: string }) {
    const { email, password } = resetData;

    const user = await this.userService.updatePassword(email, password);

    if (user) {
      return { status: 'success', data: user };
    } else {
      return { message: 'Reset key not found', status: 'failure' };
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch('/status/:id')
  updateStatus(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateStatus(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

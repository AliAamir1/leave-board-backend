import {
  Controller,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req) {
    const user: User = req.user;

    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }

    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Password');
    }

    if (payload.status !== 'Active') {
      return {
        message: 'you have been set inactive by the admin',
        status: 'failure',
        data: [],
      };
    }

    return { token: this.jwtService.sign(payload) };
  }
}

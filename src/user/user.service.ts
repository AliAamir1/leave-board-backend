import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Constants } from '../utils/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
// import { sendEmail } from './email.service';
import { verify } from 'jsonwebtoken';
import { BridgeService } from 'src/bridge/bridge.service';
interface CustomJwtPayload extends JwtPayload {
  role?: string;
}
@Injectable()
export class UserService {
  constructor(
    private bridgeService: BridgeService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, token?: string) {
    let user: User = new User();
    let companyId: number = null;
    if (token) {
      try {
        const decodedToken = verify(token, 'JWT_KEY') as CustomJwtPayload;
        console.log(decodedToken);
        user.email = decodedToken.email;
        user.role = decodedToken.role || Constants.ROLES.ADMIN_ROLE;
        companyId = decodedToken.company;
        user.status = 'Active';
        // console.log('========================', companyId);

        // user.companyName = decodedToken.company;
      } catch (error) {
        console.error('Error verifying token:', error);
        user.role = Constants.ROLES.ADMIN_ROLE;
      }
    } else {
      user.email = createUserDto.email;
      user.role = Constants.ROLES.ADMIN_ROLE;
      user.status = 'Active';
    }

    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      // throw new Error('Email already exists'); // You can customize the error message
      return { message: 'email already exists', status: 'failure', data: [] };
    } else {
      user.firstName = createUserDto.firstName;
      user.lastName = createUserDto.lastName;

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      user.password = hashedPassword;
      // user.password = createUserDto.password;

      const result = this.userRepository.save(user);
      // console.log('CHECK+++++========', (await result).id);
      const _id = (await result).id;
      if (token) {
        const bridgeSave = this.bridgeService.create(_id, companyId);
      }
      return { message: 'Account created', status: 'success', data: result };
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  // async comparePassword(id: number, password: string) {
  //   const result = await this.userRepository.findOne({ where: { id } });
  //   // console.log(result.password);
  //   console.log('id:', id);
  //   console.log('result:', result);
  //   console.log('result.password:', result ? result.password : 'N/A');

  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   console.log('myPassword:', hashedPassword);

  //   // const isPasswordValid =
  //   // const isPasswordValid = await bcrypt.compare(password, result.password);
  //   // console.log('Password: ', isPasswordValid);
  //   const isPasswordValid = await bcrypt.compare(
  //     hashedPassword,
  //     result.password,
  //   );

  //   console.log('result======:', isPasswordValid);

  //   if (isPasswordValid) {
  //     return 1;
  //   } else {
  //     return 0;
  //   }
  //   // return result;
  // }

  async comparePassword(id: number, password: string) {
    const result = await this.userRepository.findOne({ where: { id } });

    if (!result) {
      // User not found
      return 0;
    }

    // console.log('id:', id);
    // console.log('result:', result);
    // console.log('result.password:', result ? result.password : 'N/A');
    console.log('pass:', password);
    console.log('res pass:', result.password);
    const isPasswordValid = await bcrypt.compare(password, result.password);

    console.log('result======:', isPasswordValid);

    if (isPasswordValid) {
      return 1;
    } else {
      return 0;
    }
  }

  // findKey(email: string) {
  //   return this.userRepository.findOne({ where: { email: email } });
  // }
  async findKey(email: string) {
    return this.userRepository.findOne({
      where: { email: email },
      select: ['resetKey'],
    });
  }

  findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }

  findUserByID(id: number) {
    return this.userRepository.findOneOrFail({ where: { id: id } });
  }

  async updateResetKey(
    email: string,
    // updateUserDto: UpdateUserDto,
    key: string,
  ) {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) {
      return { message: 'does not exist', status: 'failure', data: {} };
    }
    // if (updateUserDto.resetKey) {
    user.resetKey = key;
    // }
    // const result = this.userRepository.save(user);
    // // return { message: 'updated', status: 'success', data: result };
    // return result;
    try {
      await this.userRepository.save(user);
      return { message: 'Reset key updated successfully', status: 'success' };
    } catch (error) {
      console.error('Error updating reset key:', error);
      return { message: 'Failed to update reset key', status: 'failure' };
    }
  }

  async updatePassword(
    email: string,
    // updateUserDto: UpdateUserDto,
    password: string,
  ) {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) {
      return { message: 'does not exist', status: 'failure', data: {} };
    }
    // if (updateUserDto.resetKey) {
    // user.password = password;
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    // }
    // const result = this.userRepository.save(user);
    // // return { message: 'updated', status: 'success', data: result };
    // return result;
    try {
      await this.userRepository.save(user);
      return { message: 'password updated successfully', status: 'success' };
    } catch (error) {
      console.error('Error updating password:', error);
      return { message: 'Failed to update password', status: 'failure' };
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return { message: 'does not exist', status: 'failure', data: {} };
    }

    if (updateUserDto.firstName) {
      user.firstName = updateUserDto.firstName;
    }

    if (updateUserDto.lastName) {
      user.lastName = updateUserDto.lastName;
    }

    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      user.password = hashedPassword;
    }

    if (updateUserDto.status) {
      user.status = updateUserDto.status;
    }

    if (updateUserDto.resetKey) {
      user.resetKey = updateUserDto.resetKey;
    }

    const result = this.userRepository.save(user);
    return { message: 'updated', status: 'success', data: result };
  }

  async updateStatus(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      return { message: 'does not exist', status: 'failure', data: {} };
    }

    if (updateUserDto.status) {
      user.status = updateUserDto.status;
    }

    const result = this.userRepository.save(user);
    return { message: 'updated', status: 'success', data: result };
  }

  async remove(id: number) {
    const found = await this.userRepository.findOne({ where: { id } });
    if (found) {
      const del = this.userRepository.delete(id);
      return { message: '', status: 'success', data: del };
    } else {
      return { message: 'does not exist', status: 'failure', data: {} };
    }
  }
}

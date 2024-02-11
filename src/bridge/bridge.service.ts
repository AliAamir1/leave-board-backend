import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyService } from 'src/company/company.service';
import { Company } from 'src/company/entities/company.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateBridgeDto } from './dto/create-bridge.dto';
import { UpdateBridgeDto } from './dto/update-bridge.dto';
import { Bridge } from './entities/bridge.entity';

@Injectable()
export class BridgeService {
  constructor(
    @InjectRepository(Bridge)
    private readonly bridgeRepository: Repository<Bridge>,
  ) {}

  async create(userId: number, companyId: number) {
    let newEntry: Bridge = new Bridge();
    newEntry.user = new User();
    newEntry.company = new Company();
    newEntry.user.id = userId;
    newEntry.company.id = companyId;
    const result = await this.bridgeRepository.save(newEntry);
    if (result) {
      return {
        message: 'user details added successfully',
        status: 'success',
        data: result,
      };
    } else {
      return {
        message: 'could not add user',
        status: 'failure',
        data: [],
      };
    }
  }
  async findCompaniesByUserId(userId: number) {
    const bridges = await this.bridgeRepository.find({
      where: { user: { id: userId } },
      relations: ['company'],
    });

    if (bridges.length > 0) {
      return bridges.map((bridge) => bridge.company.id);
    } else {
      return { message: 'No entries found for the specified user ID' };
    }
  }

  findAll() {
    return this.bridgeRepository.find();
  }

  // findOne(id: number) {
  //   return this.bridgeRepository.find({
  //     where: { company: { id: id } },
  //   });
  // }

  async findOne(companyId: number) {
    const bridges = await this.bridgeRepository.find({
      where: { company: { id: companyId } },
      relations: ['user'],
    });

    if (bridges.length > 0) {
      return bridges.map((bridge) => bridge.user.id);
    } else {
      return { message: 'No entries found for the specified company ID' };
    }
  }

  async findAllUsersData(companyId: number) {
    const bridges = await this.bridgeRepository.find({
      where: { company: { id: companyId } },
      relations: ['user'],
    });

    if (bridges.length > 0) {
      return bridges.map((bridge) => bridge.user);
    } else {
      return { message: 'No entries found for the specified company ID' };
    }
  }

  update(id: number, updateBridgeDto: UpdateBridgeDto) {
    return `This action updates a #${id} bridge`;
  }

  remove(id: number) {
    return `This action removes a #${id} bridge`;
  }
}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CompanyService {
  constructor(
    private userService: UserService,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, userId: number) {
    try {
      let company: Company = new Company();
      company.name = createCompanyDto.name;
      company.category = createCompanyDto.category;
      company.user = await this.userService.findUserByID(userId);
      const create = await this.companyRepository.save(company);
      return {
        message: 'Company created',
        status: 'success',
        data: { create },
      };
    } catch (error) {
      console.error('Error creating company:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCompanyByUserId(userId: number): Promise<number | undefined> {
    const company = await this.companyRepository
      .createQueryBuilder('company')
      .where('company.userId = :userId', { userId })
      .getOne();

    if (company) {
      return company.id;
    }

    return undefined; // Return undefined if no matching company is found
  }

  findAll() {
    return `This action returns all company`;
  }

  findOne(id: number) {
    return this.companyRepository.findOne({ where: { id } });
  }

  // findcompanyByID(id: number) {
  //   return this.companyRepository.findOne({ where: { id } });
  // }

  findCompanyByID(id: number) {
    return this.companyRepository.findOneOrFail({ where: { id: id } });
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }

  async getCompanyIdByUserId(userId: number): Promise<number | undefined> {
    const company = await this.companyRepository
      .createQueryBuilder('company')
      .where('company.user.id = :userId', { userId })
      .select('company.id', 'id')
      .getRawOne();

    if (company) {
      return company.id;
    }

    return undefined; // Return undefined if no matching company is found
  }
}

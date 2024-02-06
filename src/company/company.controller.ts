import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ValidationPipe,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Constants } from 'src/utils/constants';
import { CompanyService } from './company.service';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from 'src/user/entities/user.entity';
import { EmailService } from './email.service';

interface CustomRequest extends Request {
  user: {
    userId: number;
  };
}

@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService,
    private readonly emailService: EmailService,
  ) {}

  @Post()
  @UseGuards(new RoleGuard(Constants.ROLES.ADMIN_ROLE))
  create(
    @Body(ValidationPipe) createCompanyDto: CreateCompanyDto,
    @Req() request: CustomRequest,
  ) {
    const id = request.user.userId;
    // console.log(userId);
    return this.companyService.create(createCompanyDto, id);
    // return 'created';
  }

  @Post('/sendEmail')
  async sendEmail(
    @Req() request: CustomRequest,
    @Body() emailData: { to: string },
  ) {
    const loggedInUser = request.user;

    if (!loggedInUser) {
      return { message: 'User not logged in', status: 'failure', data: {} };
    }

    // const userId = loggedInUser.userId; // Access the userId property directly
    // console.log(loggedInUser.userId);

    const company = await this.companyService.getCompanyByUserId(
      loggedInUser.userId,
    );

    if (!company) {
      return {
        message: 'User is not associated with a company',
        status: 'failure',
        data: {},
      };
    }

    this.emailService.sendEmail(emailData, company);

    return { message: 'Email sent', status: 'success', data: {} };
  }

  @Post('/resetEmail')
  async resetEmail(
    @Req() request: CustomRequest,
    @Body() emailData: { to: string },
  ) {
    const result = this.emailService.resetEmail(emailData);
    return result;
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }

  @Get('detail/:userId') //get company id (that he owns) from the table using userId
  getCompanyIdByUserId(@Param('userId') userId: string) {
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedUserId)) {
      throw new BadRequestException('Invalid userId');
    }

    return this.companyService.getCompanyIdByUserId(parsedUserId);
  }
}

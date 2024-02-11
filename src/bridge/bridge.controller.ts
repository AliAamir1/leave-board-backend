import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BridgeService } from './bridge.service';
import { CreateBridgeDto } from './dto/create-bridge.dto';
import { UpdateBridgeDto } from './dto/update-bridge.dto';

interface CustomRequest extends Request {
  user: {
    userId: number;
  };
  company: {
    companyId: number;
  };
}

@Controller('bridge')
export class BridgeController {
  constructor(private readonly bridgeService: BridgeService) {}

  @Post()
  create(@Body() body: { companyId: number }, @Req() request: CustomRequest) {
    const userId = request.user.userId;
    const companyId = body.companyId;
    return this.bridgeService.create(userId, companyId);
  }

  @Get('/company/:id') // give userId to get company data
  findByUserId(@Param('id') id: string) {
    return this.bridgeService.findCompaniesByUserId(+id);
  }

  @Get()
  findAll() {
    return this.bridgeService.findAll();
  }

  @Get(':id') //give companyId to get all the users working in it (userId only)
  findOne(@Param('id') id: string) {
    return this.bridgeService.findOne(+id);
  }

  @Get('/user/:id') //give companyId to get all the users working in it (all the data of user)
  findUsersData(@Param('id') id: string) {
    return this.bridgeService.findAllUsersData(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBridgeDto: UpdateBridgeDto) {
    return this.bridgeService.update(+id, updateBridgeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bridgeService.remove(+id);
  }
}

import { Body, Controller, Post, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import User from './interface/user.interface';
import UserReqDTO from './dto/UserReqDTO';

const logger = new Logger('Cloud');
@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('single')
  getSingle(@Body() userReqDTO:UserReqDTO): Promise<User> {
    logger.log(`received request = ${userReqDTO.email}`);
    return this.appService.getSingle(userReqDTO);
  }
}

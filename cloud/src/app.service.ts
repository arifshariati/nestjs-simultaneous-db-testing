import { Injectable } from '@nestjs/common';
import User from './interface/user.interface'
import UserReqDTO from './dto/UserReqDTO';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class AppService {

  constructor(
        
    @InjectModel('User') private readonly userModel: Model<User>,
){}

  async getSingle(userReqDTO:UserReqDTO): Promise<User | any> {
    let user = await this.userModel.findOne(userReqDTO);
    
    if(user !== null){
      return user;
    }else{
      return {};
    }
  }
}

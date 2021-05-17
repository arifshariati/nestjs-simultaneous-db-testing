import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Axios from 'axios';
import { Cron, CronExpression } from "@nestjs/schedule";
import { Model } from 'mongoose';
import { User } from './schema/user.schema';


const logger = new Logger('Local-Cron');
@Injectable()
export class AppService {
  httpService: any;
  
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}
  
  @Cron(CronExpression.EVERY_MINUTE)
  syncLocalDB() {
    logger.debug('Called every Minute');
    this.synchDB();
  }

  private async synchDB(){
    const users = await this.userModel.find({"synched":false}).limit(100);
    

    if(users.length > 0){
      users.map(user => {
        let postData = {
          "email": user.email,
          "gender": user.gender
        };
        try{
            
          Axios.post(`${process.env.CLOUD_URI}/user/single`, postData)
          .then(response => {
            if(Object.keys(response.data)){
              let newInstance = new this.userModel(user);
              newInstance.synched = true;
              logger.log(`updating ${newInstance._id}`);
              this.userModel.findOneAndUpdate({_id:newInstance._id},newInstance);
            }
          })
          .catch(error => {
            console.log('Axios Error = ', error.message);
          })
        }
        catch(err){
          console.log('Try Error = ', err.response.data);
        }
      });
    }else{
      logger.log('NO user with false found');
    }
  }

}

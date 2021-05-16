import { ConfigModule } from '@nestjs/config';
import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config';
import {User, UserSchema} from './schema/user.schema';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({isGlobal:true}),
    MongooseModule.forRoot(config.mongo.uri, config.mongo.config),
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    }]),
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

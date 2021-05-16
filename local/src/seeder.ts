import { MongooseModule } from "@nestjs/mongoose";
import { seeder } from "nestjs-seeder";
import { UserSeeder } from "./user.seeder";
import { User, UserSchema } from "./schema/user.schema";

seeder({
    imports:[
        MongooseModule.forRoot('mongodb://admin:admin@localhost:27017/nestjs-simultaneous-db-test?authSource=admin'),
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema
        }]),
    ],
}).run([UserSeeder]);
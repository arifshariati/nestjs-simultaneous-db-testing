import { MongooseModule } from "@nestjs/mongoose";
import { seeder } from "nestjs-seeder";
import { UserSeeder } from "./user.seeder";
import { User, UserSchema } from "./schema/user.schema";

seeder({
    imports:[
        MongooseModule.forRoot(`${process.env.MONGO_URI}`),
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema
        }]),
    ],
}).run([UserSeeder]);
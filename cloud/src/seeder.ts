import { MongooseModule } from "@nestjs/mongoose";
import { seeder } from "nestjs-seeder";
import { UserSeeder } from "./user.seeder";
import { User, UserSchema } from "./schema/user.schema";

seeder({
    imports:[
        MongooseModule.forRoot(`mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@cluster0.gdphj.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`),
        MongooseModule.forFeature([{
            name: User.name,
            schema: UserSchema
        }]),
    ],
}).run([UserSeeder]);
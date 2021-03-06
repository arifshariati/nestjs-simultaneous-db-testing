import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Factory } from "nestjs-seeder";

export type UserDocument = User & Document;

let gender = ['male', 'female'];
let synched = [false, true]
@Schema()
export class User {

    @Factory(faker => faker.name.findName())
    @Prop()
    name: string;

    @Factory(faker => faker.random.arrayElement(gender))
    @Prop()
    gender: string;

    @Factory(faker => faker.internet.email())
    @Prop()
    email: string;

    @Factory(faker => faker.address.country())
    @Prop()
    country: string;

    @Factory(faker => faker.address.city())
    @Prop()
    city: string;

    @Factory(faker => faker.random.arrayElement(synched))
    @Prop()
    synched: boolean;

}
export const UserSchema = SchemaFactory.createForClass(User).set('timestamps',true);;
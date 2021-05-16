import { Document } from "mongoose";

interface User extends Document {
    
    name: string;
    gender: string;
    email: string;
    country: string;
    city: string;
    synched:boolean;
};

export default User;
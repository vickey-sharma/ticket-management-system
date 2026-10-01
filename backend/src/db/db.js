import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectDB = async() => {
    try {
       const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
//  const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)


console.log(`\n MongoDB connected !! DB HOST: ${process.env.PORT}`)
// console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance}`)
console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`) 

console.log("=================================");
console.log("MONGO HOST:", mongoose.connection.host);
console.log("MONGO DATABASE:", mongoose.connection.name);
console.log("=================================");

    } catch (error) {
       console.error("MongoDB connection ERROR: ", error)
        process.exit(1) 
    }
}
export default connectDB;
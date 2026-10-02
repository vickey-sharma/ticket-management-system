//STARTS SERVER + CONNECT DB

import dotenv from "dotenv"
import connectDB from "./src/db/db.js";
import {app} from "./src/app.js";



dotenv.config({ path: "./.env" });



const DB = async () => {
    try {
        await connectDB();


        app.on("error", (error) => {
            console.error("ERROR: ", error);
            throw error;
        });

        
        //LOCALLY
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`);

        });

            //DEPLOYMENT
//             if (process.env.NODE_ENV !== "production") {
//     app.listen(process.env.PORT || 5000, () => {
//         console.log(`Server is running at port : ${process.env.PORT || 5000}`);
//     });
// }
         


    } catch (error) {
        console.log("MongoDB connection failed !!! ", error);
    }
};

DB();










//STARTS SERVER + CONNECT DB

import dotenv from "dotenv"
import connectDB from "./src/db/db.js";
import {app} from "./src/app.js";



dotenv.config({ path: "./.env" });

// connectDB()
// .then( ()=>{
//     app.on("error", (error)=> {
//           console.error("ERROR: ", error)
//              throw error
//     })
// })
// .then(
//     app.listen(process.env.PORT || 8000, ()=> {
//         console.log(`Server is running at port : ${
//             process.env.PORT
//         }`);
//     })
// )
// .catch( (error)=> {
//     console.log("MongoDB connection failed !!! ", error)
// })


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
            // console.log(
//     process.env.BOOTSTRAP_SECRET,
//     process.env.SUPERADMIN_FULLNAME,
//     process.env.SUPERADMIN_EMAIL,
//     process.env.SUPERADMIN_PASSWORD,
//     process.env.SUPERADMIN_PHONE,
//     process.env.CLOUDINARY_CLOUD_NAME,
//     process.env.CLOUDINARY_API_KEY,
//     process.env.CLOUDINARY_API_SECRET,
//     process.env.RESEND_API_KEY,
//     process.env.RESEND_EMAIL_FROM
// )

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



//UPDATING DETAILS IN DATABASE WHEN MORE FIELD ADDED IN MODEL
//         await User.updateMany(
//   { isDeleted: { $exists: false } },
//   {
//     $set: {
//       isDeleted: false,
//       deletedAt: null
//     }
//   }
// );







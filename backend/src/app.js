//GLOBAL MIDDLEWARES

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

const app = express();

app.use(helmet());

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);

app.use(express.json({ limit: "16kb" }));  //GETTING JSON DATA FROM BODY USING EXPRESS 

app.use(express.urlencoded({extended: true, limit: "16kb"}))     //PASSES DATA THROUGH HTML FORM  --  EXTENDED- NESTED OBJECT

app.use(express.static("public")) //KEEPING IMAGES 

app.use(cookieParser())  //ACCESS & SET COOKIES

app.use(morgan("dev")); ///LOGS EVERY REQUEST COMING FROM SERVER

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
}));                     






//ROUTES IMPORT -- renamed as export default is used

import userRouter from "./routes/user.routes.js";
import ticketRouter from "./routes/ticket.route.js";
import commentRouter from "./routes/comment.route.js";


//ROUTES DECLERATION
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tickets", ticketRouter);
app.use("/api/v1/tickets", commentRouter);



//HOW WILL URL LOOK LIKE
//http://localhost:5000/api/v1/users/register
export { app }
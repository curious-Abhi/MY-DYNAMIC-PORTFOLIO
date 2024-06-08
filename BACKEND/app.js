import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import db from "./database/dbconnection.js";
import { errorMiddleware } from "./middlewares/error.js";
import messageRoutes from "./routes/messageRouter.js";


const app=express();
dotenv.config({path:"./config/config.env"});


app.use(cors({
    origin:[process.env.PORTFOLIO_URL,process.env.PORTFOLIO_URL],
    methods:["GET","POST","DELETE","PUT"],
    credentials:true,
}))


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
})
);

app.use(errorMiddleware);
// Use message routes
app.use('/api', messageRoutes);





export default app;
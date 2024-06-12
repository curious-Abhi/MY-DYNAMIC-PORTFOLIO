import express, { urlencoded } from "express";
import bodyParser from 'body-parser';
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import messageRoutes from "./routes/messageRouter.js";
import userRoutes from "./routes/userRouter.js";
import timelineRouter from "./routes/timeLineRouter.js"
import softwareApplication from "./routes/softwareApplicationRouter.js"
import skillRouter from "./routes/skillRouter.js";


const app=express();
dotenv.config({path:"./config/config.env"});


app.use(cors({
    origin:[process.env.PORTFOLIO_URL,process.env.DASHBOARD_URL],
    methods:["GET","POST","DELETE","PUT"],
    credentials:true,
}))


app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
})
);

// Use message routes
app.use('/api/v1/message', messageRoutes);
//Use user routes
app.use('/api/v1/user',userRoutes);
//use timeLine routes
app.use('/api/v1/timeline',timelineRouter);
//use software application routes
app.use('/api/v1/softwareapplication',softwareApplication);
//use skill routes
app.use('/api/v1/skill',skillRouter);

app.use(errorMiddleware);


export default app;
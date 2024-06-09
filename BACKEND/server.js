import app from "./app.js";
import dotenv from "dotenv"

import cloudinary from "cloudinary";

dotenv.config({ path: './config/config.env' });

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})


app.listen(process.env.PORT,()=>{
    console.log(`server is running at port ${process.env.PORT}`)
})
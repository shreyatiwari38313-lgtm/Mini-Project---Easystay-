
import dotenv from 'dotenv';
//imported
import { app } from "./app.js";
import connectDB from './db/main.js';

// Load env variables FIRST
dotenv.config({
    path: './.env'      
})

//database connection -> connectDB  executed
//then catch both takes callback 
connectDB()
.then(()=>{
     app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port ${process.env.PORT}`);
     })

}).catch((err)=>{
    console.log("MongoDB connection failed!!!", err);
})




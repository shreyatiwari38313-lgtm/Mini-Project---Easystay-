
import dotenv from 'dotenv';
//imported
import connectDB from './db/main.js';

//database connection -> connectDB  executed
connectDB()

//configured involving some change in package.json file
dotenv.config({
    path: './env'
})




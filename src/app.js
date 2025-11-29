import express from 'express';
import cookieParser from 'cookie-parser'
import cors from 'cors'
//configurations done after app making
const app = express()

//configuring cors
// app.use(cors())      // use() se middlewares,configuration hoti h
app.use(cors({
    //states which origin to allow taking data from databse
    origin: 
}))


export { app }
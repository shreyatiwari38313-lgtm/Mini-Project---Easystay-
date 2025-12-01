import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
//configurations done after app making
const app = express()

//configuring cors
// app.use(cors())      // app.use() se middlewares,configuration settings hoti h
app.use(cors({
    //states which origin to allow taking data from database
    origin: process.env.CORS_ORIGIN,
    credentials:true       // there are more options
}))

//configuration -> for datacoming from forms
app.use(express.json({limit:"16kb"}))

//configuration ->for data coming from url
app.use(express.urlencoded({extended:true}))

//configuration -> for data(image,pdf,video) that is to be kept inside folder "public"
app.use(express.static("public"))

//configuration -> for keeping secure cookies inside user's browser
app.use(cookieParser())

export { app }   //another way to export 
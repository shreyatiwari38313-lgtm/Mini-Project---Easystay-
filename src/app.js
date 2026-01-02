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



//routes import 
import userRouter from './routes/user.routers.js';

//routes declaration -> firstly we were writing app.get() as we have routes in same file 
//but here you have separated routers, so we have to take middleware "app.use()""
app.use("/api/v1/users", userRouter)   // "/users" has become prefix in url

//url becomes : http://localhost:8000/api/v1/users/register


// routes import
import propertyRouter from "./routes/property.routes.js";
import amenityRouter from "./routes/amenity.routes.js";
import availabilityRouter from "./routes/availability.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import reviewRouter from "./routes/review.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import hostVerificationRouter from "./routes/hostVerification.routes.js";


// routes declaration
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/amenities", amenityRouter);
app.use("/api/v1/availability", availabilityRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/host-verification", hostVerificationRouter);


export { app }   //another way to export 
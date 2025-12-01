
import dotenv from 'dotenv';
//imported
import connectDB from './db/main.js';

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

//configured involving some change in package.json file
dotenv.config({
    path: './env'
})




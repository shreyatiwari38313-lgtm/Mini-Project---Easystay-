import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
   name:{ type: String, unique: true},
   email:{type: String, unique : true},
   password : String,
   phone: String,

   role:{ type: String, enum: ["user","host"], default : "user"},
   profileImage: String,  //cloudinary
   createdAt: { type: Date, default: Date.now }
},{timestamps: true})

//hooks 
userSchema.pre("save", async function(next){
   if(!this.isModified("password")) return next();
   this.password = bcrypt.hash(this.password,10)
   next()
})

//custom methods
userSchema.methods.isPasswordCorrect = async function(passsword){
   return await bcrypt.compare(password,this.password);
}

//jwt tokens - accesstoken
userSchema.methods.generateAccessToken = function() {
   return jwt.sign(
      {
         _id: this.id,
         name: this.id,
         email: this.email
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
   )
}

//jwt token - refresh token(has less info)
userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
         _id: this.id,

      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
   )
}






export const User = mongoose.model("User", userSchema)

import {asyncHandler } from '../utils/asyncHandler.js';


//method to register user
//asyncHandler is a higher order function
const registerUser = asyncHandler(async (req,res) => {
  res.status(200).json({
    message:"ok"         //only json response
  })
})
//when to run this method, when user hit a url 
// for urls we have a separate folder routes.

//export
export { registerUser }
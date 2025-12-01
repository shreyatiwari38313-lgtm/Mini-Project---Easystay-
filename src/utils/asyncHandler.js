const asyncHandler = (requestHandler) => {
    return (req, res, next) => {       //returned in Promise format
           Promise.resolve(requestHandler(req, res, next))
           .catch((err)=> next(err))
       }
    }
    
    //exporting 
    export { asyncHandler}







// ------------------ way 2 using try-catch
// const asyncHandler = () => {}      //basic arrow function

// const asyncHandler = (func) => { () => {} }   //is function(func) ko other function me pass kr dia 

//const asyncHandler = (fn) =>  async() => {}   //we removed these curly braces only and now we will make it async


// now async will contain (req,res,next) and next because we can use it as a sort of middleware and further we will need try -catch b'coz we will be  taking functions and putting wrappers of async and try-catch.

// const asyncHandler = (func) =>  async(req,res,next) => {
//      try{
//         await func(req, res, next)   // func executed
       
//         }catch(err)          
//              res.status(err.code || 500).json({
//                 success: false,
//                 message : err.message

//           })
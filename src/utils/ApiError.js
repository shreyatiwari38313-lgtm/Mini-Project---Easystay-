class ApiError extends Error{
    constructor(
       statusCode,
       message="Something went wrong",
       errors=[],
       stack= ""

    ){
        super(message)   //override message above
        this.statusCode = statusCode
        this.data =null
        this.message = message
        this.success =false;
        this.errors= errors

        //optional - written in Production grade projects
          
        if(stack){
            this.stack= stack
        }else{
            Error.captureStackTree(this, this.constructor)
        }
        }
}

//exporting
export { ApiError }
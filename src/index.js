import 'dotenv/config'
import app from "./app.js";
import dbConnection from './db.js';
import ApiError from './utills/apiError.js';


dbConnection()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("server is running on 3000")
    })
})
.catch((err)=>{
    throw new ApiError(500,err)
})
const app = require("./app");
const connectDB = require("./config/db");
require("dotenv").config();
const PORT =process.env.PORT;

const start = async()=>{
    try {
        await connectDB();
         const server = app.listen(process.env.PORT,()=>{
        console.log(`server is listening on port  ${process.env.PORT}`);

    });
    } catch (error) {
        console.log("database connection failed",error.message);
        
    };
   
};

start();
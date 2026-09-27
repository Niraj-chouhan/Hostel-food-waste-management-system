const mongoose = require("mongoose");
//  const URI ="mongodb://127.0.0.1:27017/mern_admin";
const URI = process.env.MONGODB_URI || "mongodb+srv://mern_admin:nirajchouhannirajNNN@first.ssa5zld.mongodb.net/mern_admin?appName=first";
// const URI = process.env.MONGODB_URI;
// mongoose.connect(URI);

const connectDb = async()=>{
    try{
      await mongoose.connect(URI, { serverSelectionTimeoutMS: 10000 })
      console.log('connection successfull to DB')
    }catch(error)
    {
        console.log("database connection failed", error.message);
        process.exit(1);
    }
}
module.exports= connectDb;




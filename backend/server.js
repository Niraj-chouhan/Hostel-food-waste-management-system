require("dotenv").config({ path: "./.env" });
process.env.JWT_SECRET_KEY = "hardcoded_secret_123";

// console.log("JWT KEY FROM SERVER:", process.env.JWT_SECRET_KEY);
const cors = require("cors");
const express = require("express");
const app = express();
const authRoute = require("./router/auth-router");
const contactRoute = require('./router/contact-router')
const serviceRoute = require("./router/service-router")
const adminRoute = require("./router/admin-route")
const notificationRoute = require("./router/notification-router")
const attendanceRoute = require("./router/attendance-router")
const cookRoute = require("./router/cook-router")
const connectDb = require("./utils/db");
const { error } = require("console");
const errorMiddleware = require("./middlewares/error-middleware");
const services = require("./controllers/service-controller");
// const { createStandardJSONSchemaMethod } = require("zod/v4/core");
// middelewere

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// nirajchouhannirajNNN

app.use("/api/auth",authRoute);
app.use("/api/form",contactRoute);
app.use("/api/data",serviceRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/cook", cookRoute);

// lets difine admin panel
app.use("/api/admin",adminRoute);



// app.get("/",(req,res)=>{
//      res.status(200).send("welcome");
// });

// app.get("/register",(req,res)=>{
//      res.status(200).send("welcome");
// });

app.use(errorMiddleware);

const PORT = 5000;

connectDb().then(()=>{

app.listen(PORT,()=>{
    console.log(`server is running at port : ${PORT}`);
});

});     
 

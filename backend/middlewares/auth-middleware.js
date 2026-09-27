const jwt = require("jsonwebtoken");
const User = require('../models/user-model');
const authMiddleware = async(req, res , next)=>{

//     const token = req.header("Authorization");

//     if(!token){

//         return res 
//         .status(401)
//         .json({message: "unathorized HTTP , Token not provided"});
//     }
// // removr Bearer 
//     const jwtToken = token.replace("Bearer","").trim();

const authHeader = req.headers.authorization;

if (!authHeader) {
    return res.status(401).json({
        message: "Unauthorized HTTP, Token not provided"
    });
}

if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
        message: "Unauthorized HTTP, invalid token format"
    });
}

const jwtToken = authHeader.replace("Bearer ", "").trim();

    console.log("token form auth middleware",jwtToken);

    try {
        const isVerified = jwt.verify(jwtToken,process.env.JWT_SECRET_KEY);
        
        const userData = await User.findOne({email:isVerified.email}).
        select({
            password:0,
        });
        if (!userData) {
            return res.status(401).json({ message: "Unauthorized HTTP, user not found" });
        }

        console.log(userData);
    
        req.user = userData;
        req.token = jwtToken;
        req.userID = userData._id
    next();
    } catch (error) {
         return res 
        .status(401) 
        .json({message: "unathorized HTTP , Token not provided"});
     }
    

};

module.exports = authMiddleware;

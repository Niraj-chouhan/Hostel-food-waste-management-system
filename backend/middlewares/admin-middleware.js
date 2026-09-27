const { request } = require("express");

const adminMiddleware = async (req, res, next)=>{
    
    try {
    //    console.log(req.user);
       const adminRole = req.user.isAdmin;
       if(!adminRole){
        return res 
        .status(403)
        .json({message:"Access denied. user is not admin."});
       }
      //  res.status(200).json({msg:req.user.isAdmin});
      // if user is an admin, proced to the next middelware 
    next(); 
   } catch (error) {
       next(error);
    }
};

module.exports = adminMiddleware;
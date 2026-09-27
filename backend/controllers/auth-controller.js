const { nextTick } = require("process");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const { log, error } = require("console");
const getUserRole = require("../utils/user-role");
//home logic

const home = async(req,res)=>{

    try{
        res
        .status(200)
        .send(
            "welcome to our new project "
        );
    }catch(error)
    {
       console.log(error);
           
    }
};

// register logic    first

// const register = async (req,res) =>{
//     try{
//          console.log(req.body);
//           res.status(200).send('welcome our register page again')

//     }catch(error){
//           res.status(400).send({msg:"page not found"})
     
//     }

// ______________________________
// register logic second
// _______________________________________
const register = async (req, res, next) => {
    try {
        console.log(req.body);

        const { username, email, phone, password } = req.body;

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "email already exist" });
        }

        const userCreated = await User.create({
            username,
            email,
            phone,
            password
        });

        res.status(201).json({
            msg: "registration succesfully",
            token: await userCreated.generateToken(),
            userId: userCreated._id.toString(),
        });

    } catch (error) {
        next(error);
    }
};


// *_______________________________________
//   login logic   ##
// ________________________________________________

const login = async(req,res)=>{
try {
  const {email, password} = req.body;
   
  //email vaild or not 
  const userExist =  await User.findOne({email});
  console.log(userExist);

  if(!userExist){
    return res.status(400).json({message:"Invalid credentials"});
  }
   
   // compairr password 

  //  const user = await bcrypt.compare(password, userExist.password);

  const user = await userExist.comparePassword(password);

   
   if(user){
          res.status(200).json({
          msg:"login successfully",
          token: await userExist.generateToken(),
          userId:userExist._id.toString(),
          user: {
            username: userExist.username,
            email: userExist.email,
            isAdmin: userExist.isAdmin,
            role: getUserRole(userExist),
          },
      });      
   }else{
       res.status(401).json({message:"invaild email or password"})
   }

} catch (error) {
   res.status(500).json("Inetrnal server error");
  
}
};

// _____________________________
//  to send user data - user logic 
// ____________________________________

const user = async(req, res) =>{
   
    try {
        const userData = req.user.toObject();
        userData.role = getUserRole(req.user);
        console.log(userData);
        // res.status(200).json({msg:"hi user"});
      return res.status(200).json({userData});
    } catch (error) {
        console.log(`error from the user route ${error}`);
        
    }
}


module.exports= {home,register,login,user};

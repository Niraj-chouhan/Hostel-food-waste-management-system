const  mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const getUserRole = require("../utils/user-role");
const userSchema= new mongoose.Schema({
    username:{
        type:String,
         required:true,
         },
      email:{
        type:String,
        required:true,
      },
      phone:{
        type:String,
        required:true,
      },
  password:{
        type:String,
        required:true,
      },
    isAdmin:{
        type:Boolean,
        default:false,
    },
    role:{
        type:String,
        enum:["student", "admin", "cook"],
        default:"student",
        lowercase:true,
        trim:true,
    }
});

//secure the password with the bcrypt  { this second method  1st in auth-controllers}
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
//  compare the password 
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);

}
// Json web token
userSchema.methods.generateToken = async function(){
 try {
    return jwt.sign({
      userId:this._id.toString(),
      email:this.email,
      isAdmin:this.isAdmin,
      role:getUserRole(this),
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn:"30d",
    }
  );
 } catch (error) {
  console.log(error);
  
 }
};


//define the model or the collection name

const User = new mongoose.model("User",userSchema);
 
module.exports = User;

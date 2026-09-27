// await schema.parseAsync(req.body) is the line where
//  you use Zod to validate the request body against the defined schema.

const { error } = require("console");
const { message } = require("statuses");

const validate = (schema) => async(req,res,next) =>{
try{
    const parseBody = await schema.parseAsync(req.body);
   req.body = parseBody;
   next();
}catch(err){
    const status = 422;

// console.log(err);
const message = 'fill the input properly';
const extraDetails = err.issues[0].message;
 
const error ={
    status,
    message,
    extraDetails
};

// console.log(message);
console.log(error);
//   res.status(400).json({msg:message});
  next(error);
}
};


module.exports = validate;
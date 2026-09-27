const {z} = require("zod");
 
//creating an object  schemaa for login 
const loginSchema = z.object({
        email:z
    .string({required_error:"Email is required"})
    .trim()
    .email({message:"invalid email address"})
    .min(3,{message:"email must be at lesto of  chars."})
    .max(255,{message:"email must not be more than 255 characters."}),
      password:z
    .string({required_error:"Name is required"})
    .trim()
    .min(7,{message:"password must be at lest of 7 character"})
    .max(1024,{message:"password must not be more than 1024 characters."}),
})

//creating an object schemaa for registration

const signupSchema = loginSchema.extend({
    username:z
    .string({required_error:"Name is required"})
    .trim()
    .min(3,{message:"Name must be at lesto of  chars."})
    .max(255,{message:"Name must not be more than 255 characters."}),

    email:z
    .string({required_error:"Email is required"})
    .trim()
    .email({message:"invalid email address"})
    .min(3,{message:"email must be at lesto of  chars."})
    .max(255,{message:"email must not be more than 255 characters."}),

    phone:z
    .string({required_error:"phone is required"})
    .trim()
    .min(10,{message:"phone must be at lesto of 10 number"})
    .max(20,{message:"Name must not be more than 20 number."}),

    password:z
    .string({required_error:"Name is required"})
    .trim()
    .min(7,{message:"password must be at lest of 7 character"})
    .max(1024,{message:"password must not be more than 1024 characters."}),
});

module.exports = {signupSchema,loginSchema};

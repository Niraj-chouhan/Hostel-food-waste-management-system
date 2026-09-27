
const express = require("express");
const router = express.Router();
const authcontrollers = require("../controllers/auth-controller")
const {signupSchema,loginSchema} = require("../validator/auth-validator");
const validate = require('../middlewares/validte-middleware');
const authMiddleware = require("../middlewares/auth-middleware")


// router.route("/",(req,res)=>{
//      res.status(200).send("welcome using router");
// });

router.route('/register').post(validate(signupSchema), authcontrollers.register)
router.route('/login').post(validate(loginSchema),authcontrollers.login)

// lec 30 JWT token ( creating Route to get user data form )
 
router.route('/user').get(authMiddleware , authcontrollers.user);

module.exports = router;


// 2nd copy of router


// const express = require("express");
// const router = express.Router();
// const authcontrollers = require("../controllers/auth-controller")


// // router.route("/",(req,res)=>{
// //      res.status(200).send("welcome using router");
// // });
// router.route("/").get(authcontrollers.home);

// router.route('/register').post(authcontrollers.register)

// module.exports = router;
// // 
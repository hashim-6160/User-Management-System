const express = require("express");
const user_route = express();

const session = require("express-session");
const config = require("../config/config");
user_route.use(session({
    secret:config.sessionSecrets,
    resave:false,
    saveUninitialized:true
}));

const auth = require("../middleware/auth");

user_route.set('view engine','ejs');
user_route.set('views','./views/users');

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));


user_route.use(express.static('public'));

const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination:((req,file,cb)=>{
        cb(null,path.join(__dirname,'../public/userImages'));
    }),
    filename:((req,file,cb)=>{
        const name = Date.now() + '-' + file.originalname;
        cb(null,name);
    })
});

const upload = multer({storage:storage});


const userController = require("../controllers/userController");

user_route.get('/register',auth.isLogout,auth.clearCache,userController.loadRegister);
user_route.post('/register',upload.single('image'),userController.insertUser);
user_route.get('/',auth.isLogout,auth.clearCache,userController.loginLoad);
user_route.get('/login',auth.isLogout,auth.clearCache,userController.loginLoad);

user_route.post('/login',auth.clearCache,userController.verifyLogin);

user_route.get('/home',auth.isLogin,auth.clearCache,userController.loadHome);
user_route.get('/logout',auth.isLogin,auth.clearCache,userController.userLogout)
module.exports = user_route;
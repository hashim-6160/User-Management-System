const express = require("express");
const admin_route = express();

const config = require("../config/config");
const session = require("express-session");  
admin_route.use(session({
    secret:config.sessionSecrets,
    resave:false,
    saveUninitialized:true
}));


const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

admin_route.use(express.static('public'));

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

const auth = require("../middleware/adminAuth");

const adminController = require("../controllers/adminController");


admin_route.get('/',auth.isLogout,auth.clearCache,adminController.loadLogin);

admin_route.post('/',auth.clearCache,adminController.verifyLogin);

admin_route.get('/home',auth.isLogin,auth.clearCache,adminController.loadDashboard);

admin_route.get('/logout',auth.isLogin,auth.clearCache,adminController.logout);

admin_route.get('/dashboard',auth.isLogin,auth.clearCache,adminController.adminDashboard);

admin_route.get('/new_user',auth.isLogin,auth.clearCache,adminController.newUserLoad);

admin_route.post('/new_user',upload.single('image'),adminController.addUser); 

admin_route.get('/edit_user',auth.isLogin,auth.clearCache,adminController.editUserLoad);

admin_route.post('/edit_user',adminController.updateUsers);

admin_route.get('/delete_user',auth.isLogin,auth.clearCache,adminController.deleteUser);

admin_route.get('*',((req,res)=>{
    res.redirect('/admin');
}));

module.exports = admin_route;

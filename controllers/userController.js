const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// Secure Password Hashing
const securePassword = async(password)=>{

    try {
       const passwordHash = await bcrypt.hash(password, 10);
       return passwordHash;
        
    } catch (error) {
        console.log(error.message);
    }

}

// Load Registration Page
const loadRegister = async(req,res)=>{
    try{
        res.render('registration');

    } catch (error){
        console.log(error.message);
    }
}

// Insert New User
const insertUser = async(req,res)=>{
    try{
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            res.render('registration', { message: "Email is already registered. Please use a different email.", messageType: "error" });
            return;
        }

        const spassword = await securePassword(req.body.password);
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            image:req.file.filename,
            password:spassword,
            is_admin:0
        });

       const userData = await user.save()

       if(userData){
        res.render('registration',{message:"Your Registration has been Successful.", messageType: "success"})
       }else{
        res.render('registration',{message:"Your Registration has been Failed.", messageType: "error"})
       }

    } catch (error){
        console.log(error.message);
    }
}

// login Login Page

const loginLoad = async(req,res)=>{
    try {
        res.render('login');
        
    } catch (error) {
        console.log(error.message);
    }
} 

const verifyLogin = async(req,res)=>{
    try {

        const email = req.body.email;
        const password = req.body.password;

       const userData = await User.findOne({email:email});

       if (userData) {
            const passwordMatch = await bcrypt.compare(password,userData.password); 

            if (passwordMatch) {

                if(userData.is_admin ===0){
                req.session.user_id = userData._id;
                res.redirect('/home');
            } else {
                res.render('login',{message:"Admin login through Admin Port only...", messageType: "error"});}
            } else {
                res.render('login',{message:"Email and Password is incorrect", messageType: "error"});
            }
            
       } else {
            res.render('login',{message:"Email and Password is incorrect", messageType: "error"});
       }

    } catch (error) {
        console.log(error.message)
    }
}

// Load Home Page
const loadHome = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id});
        res.render('home',{user:userData});
        
    } catch (error) {
        console.log(error.message);   
    }

}

// User Logout
const userLogout = async(req,res)=>{
    try {
        req.session.destroy();
        res.clearCookie('connect.sid'); // Clear session cookie
        res.redirect('/');

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout
}
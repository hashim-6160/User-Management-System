const User = require("../models/userModel");
const bcrypt = require('bcrypt');

// Secure Password Hashing
const securePassword = async(password)=>{

    try {
       const passwordHash = await bcrypt.hash(password, 10);
       return passwordHash;
        
    } catch (error) {
        console.log(error.message);
    }

}

// Load Login Page
const loadLogin = async(req,res)=>{
    try {
        if(req.session.user_id){
            res.redirect('/admin/home');
        }else{
         res.render('login');
        }
    } catch (error) {
        console.log(error.message);
    }
}

// Verify Admin Login
const verifyLogin = async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

       const userData = await User.findOne({email:email});
       if (userData) {

       const passwordMatch = await bcrypt.compare(password,userData.password); 

          if(passwordMatch){

              if(userData.is_admin ===1){
                req.session.user_id = userData._id;
                res.redirect("/admin/home");

              }else{
                res.render('login',{message:"Email and Password is Incorrect..!"});
              }

          }else{
            res.render('login',{message:"Email and Password is Incorrect..!"});
          }
       } else {
            res.render('login',{message:"Email and Password is Incorrect..!"});
       }

    } catch (error) {
        console.log(error.message);
    }
}

// Load Admin Dashboard
const loadDashboard = async(req,res)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id});
        res.render('home',{admin:userData});
        
    } catch (error) {
        console.log(error.message);
    }
}

// Admin Logout
const logout = async(req,res)=>{
    try {
        req.session.destroy();
        res.clearCookie('connect.sid'); // Clear session cookie
        res.redirect('/admin');
        
    } catch (error) {
        console.log(error.message);
    }
}

// Load Admin User Management Dashboard
const adminDashboard = async(req,res)=>{
    try {
        var search = '';
        if(req.query.search){
            search = req.query.search;
        }
       const userData = await User.find({is_admin:0, name:{$regex:"^"+search+".*", $options:"i"}});
        res.render('dashboard',{users:userData});
    } catch (error) {
        console.log(error.message);
    }
}

// Load New User Page 
const newUserLoad = async(req,res)=>{
    try {
        res.render('new_user')
    } catch (error) {
        console.log(error.message);
    }
}


// Add New User
const addUser = async(req,res)=>{
    try {
        const spassword = await securePassword(req.body.password);
        const { email, name } = req.body;
        const trimEmail = email.trim();
        const trimName = name.trim();
    
        const emailExist = await User.findOne({ email: trimEmail });
        if (emailExist) {
          res.render("new_user", { message: "Email already exist" });
        } else if (!trimEmail) {
          res.render("new_user", {
            message: "Email shouldn't be empty or blank space",
          });
        } else if (!trimName) {
          res.render("new_user", {
            message: "Name shouldn't be empty or blank space",
          });
        } else {
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
        res.redirect('/admin/dashboard');
       }else{
        res.render('new_user',{message:"Something Wrong."})
       }
    }
    } catch (error) {
        console.log(error.message);
    }
}

// Load Edit User Page
const editUserLoad = async(req,res)=>{
    try {
        const id = req.query.id;
        const userData = await User.findById({_id:id});
        if(userData){
            res.render('edit_user',{user:userData});
        }else{
            res.redirect('/admin/dashboard');
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

// Update User
const updateUsers = async(req,res)=>{
    try {
      const userData = await User.findByIdAndUpdate({_id:req.body.id},
            {$set:{name:req.body.name,
                email:req.body.email,
                mobile:req.body.mobile}})
      res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
}

// Delete User

const deleteUser = async(req,res)=>{
    try {
        const id = req.query.id;
        await User.deleteOne({_id:id})
        res.redirect('/admin/dashboard');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser
}
   

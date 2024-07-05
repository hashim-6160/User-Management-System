const isLogin = async(req,res,next)=>{
    try {
        if(req.session.user_id){}
        else{
            res.redirect('/');
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async(req,res,next)=>{
    try {
        if (req.session.user_id) {
            res.redirect('/home'); 
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}


const clearCache = async(req,res,next)=>{
    try {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        // res.header('Expires', '-1');
        // res.header('Pragma', 'no-cache');
        next()
        
    } catch (error) {
        console.log(error.message +"error from clear cache")
    }
}


module.exports={
    isLogin,
    isLogout,
    clearCache
}
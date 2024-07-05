const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim: true
    },
    email:{
        type:String,
        required:true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    mobile:{
        type:String,
        required:true,
        trim: true
    },
    image:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    is_admin:{
        type:Number,
        default: 0
    }
    
})
// Create indexes
userSchema.index({ email: 1 });

module.exports = mongoose.model('User',userSchema);

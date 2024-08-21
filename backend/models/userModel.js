const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    image:{
        type: String,
        required: true
    },
    public_id:{
        type: String,
    },
    password:{
        type: String,
        required: true
    },
    is_online:{
        type:String,
        default: '0'
    }
},{Timestamps:true});

module.exports = mongoose.model('User',userSchema);

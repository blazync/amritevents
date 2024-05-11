const mongoose = require('mongoose');
const validator= require("validator");

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        trim: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please provide a valid email!"); 
            }
        }
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 14
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    is_verified:{
        type:Boolean,
        required:true,
        default:false
    },
    profile_img: {
        type: String,
    },
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }], 
    createdAt: {
        type: Date, 
        default: Date.now 
    },
    updatedAt: {
        type: Date, 
        default: Date.now 
    }
});

/** Creating Collection */
const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require('mongoose');

const UserSchema = moongose.Schema({
    username:{
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true
    }, 
    password:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

// export user model with schema
module.exports = mongoose.model("user", UserSchema);
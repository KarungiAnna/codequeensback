const crypto = require('crypto');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  confirmPassword: {
    type: String
},
  role: {
    type: String,
    default: "student",
    enum: ["student", "admin", "superadmin"]
  },
  photo: {
    type: String
  },
  username: {
    type: String,
    required: true
    
  },
  registerDate: {
    type: Date,
    required: true,
    default: new Date()
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
  .createHash('sha256')
  .update(resetToken)
  .digest('hex');
  console.log({resetToken}, this.passwordResetToken);
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
  }

  userSchema.pre('save', async function(next) {
   const salt = await bcrypt.genSalt();
    const user = this;
    if(user.isModified('password')){
     user.password = await bcrypt.hash(user.password, salt);
    }
    //delete passwordConfirm
    this.confirmPassword = undefined;
    next();
});


userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.methods.changedPasswordAfter = function(timestamp){
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000, 10
        );
        return timestamp < changedTimestamp;
    }
    //false means not changed
    return false;
};


const User = mongoose.model("User", userSchema);
module.exports = User;

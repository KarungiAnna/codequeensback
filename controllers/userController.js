const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require('../utils/email');
const crypto = require('crypto');
// register new user
const createUser = async (req, res) => {
    try {
        let { firstname, lastname, username, email, password, passwordCheck, photo } = req.body;

        if (!email || !password || !passwordCheck)
            return res.status(400).json({ msg: "Not all fields have been entered." });
        if (password.length < 5)
            return res
                .status(400)
                .json({ msg: "The password needs to be at least 5 characters long." });
        if (password !== passwordCheck)
            return res
                .status(400)
                .json({ msg: "Enter the same password twice for verification." });

        const existingUser = await User.findOne({ email: email });
        if (existingUser)
            return res
                .status(400)
                .json({ msg: "An account with this email already exists." });

        if (!username) username = email;

        const newUser = new User({
            email,
            password,
            username,
            firstname,
            lastname,
            photo
        });
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//Login user
    const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ msg: "Not all fields have been entered." });

        const user = await User.findOne({ email: email });
        if (!user)
            return res
                .status(400)
                .json({ msg: "No account with this email has been registered." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({
            token,
            user: {
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
                _id: user._id
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//Delete user
    const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.user);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Student profile
const userProfile = async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        username: user.username,
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role
    });
};

//Edit student profile
const editstudentProfile = async (req, res) => {
    const user = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        photo: req.body.photo
    };
    try {
        const updated = await User.findOneAndUpdate({ _id: req.params.id },
            { user },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

}

// Admin dashboard
const adminDashboard = async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
        username: user.username,
        id: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role
    });
};

//forgot password
const forgotPassword = async(req, res, next) => {
    //1)get user based on posted Email
    
    const user = await User.findOne({ email: req.body.email }); 
    
    if(!user) {
        return res.status(400).json({ msg: 'Error: User not found' });
    };
    
    //2)generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false});
    
    //3)send it to user's email
    const resetURL = `${req.protocol}://localhost:3000/resetpassword/${resetToken}`;
    
    
    try{
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token( valid for 10 mins)',
        html: `<h1>Forgot your password?</h1><br><p> To reset your password, please submit a request with your new password and passwordConfirm on this link : ${resetURL}\n.
        If you didn't forget your password, please ignore this email.</p><img style="width:250px; src="cid:unique@logo/>`,
        attachments: [ {filename:'Code Queen Logo.png',path:'./images/Code Queen Logo.png', cid:'unique@logo'}
    ]
       });

      return res.status(200).json({ msg: 'Success: Reset Token sent to Email' });
      } catch(error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({validateBeforeSave: false});
        return res.status(500).json({ msg: 'Error: There was an error sending the email. Try again later!' });
      }
    }
    
    //resetpassword
    const resetPassword = async(req, res, next) =>{
        //Get user based on the token
        const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
        const user = await User.findOne({passwordResetToken : hashedToken, passwordResetExpires: {$gt: Date.now() }
       });
        
        //If token has not expired, and there is user, new password
        if(!user) {
            return res.status(500).json({ msg: 'Error: User not found' });
         //return res.render("resetpassword",{
          // token: req.params.token,
           //errorMessage: 'Error: User not found'
          //});
         
        }
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        
        await user.save();
        console.log(user)
         //Send successful password reset email 
       try{
       await sendEmail({
         email: user.email,
         subject:'Password Reset Successful' , 
         html: `<h1>Congratulations!</h1><br><p>Your password reset was successful. You can now successfully login. </p>`,
         attachments: [ {filename:'Code Queen Logo.png',path:'./images/Code Queen Logo.png', cid:'unique@logo'}
       ]
       });
       return res.status(200).json({ msg: 'Success: Check your email for password change confirmation' }); 
       //res.render("resetpassword",{
         //token: req.params.token,
         //infoMessage: "Check your email for password change confirmation"
        //});
        
       } catch(error) {
        return res.status(500).json({ msg: 'Error: There was an error sending the email. Try again later! ' });
        // return res.render("resetpassword",{
           //token: req.params.token,
           //errorMessage: 'Error: There was an error sending the email. Try again later!'
         // });
        
        
       }
       }

module.exports = {createUser, loginUser, deleteUser, userProfile, editstudentProfile, forgotPassword, resetPassword, adminDashboard };


const nodemailer = require('nodemailer');
require("dotenv").config();
const sendEmail = async options => {
    // 1 create a transporter
    const transporter = nodemailer.createTransport({
     service: 'Gmail',
     auth: {
         user: process.env.EMAIL_USERNAME,
         pass: process.env.EMAIL_PASSWORD
     } 
     //activate in gmail "less secure app" option  
    });
    // 2 Define email options
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
          to: options.email,
          subject: options.subject,
          html: options.html,
          //text: options.message,
          attachments: options.attachments
          //html
    }
    // 3 Actually send the email
    await transporter.sendMail(mailOptions);
}
module.exports = sendEmail;
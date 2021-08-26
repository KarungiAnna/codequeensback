require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
//new
const signupRouter = require("./routes/signupRouter");
const loginRouter = require("./routes/loginRouter");
const profileRouter = require("./routes/profileRouter");
const editstudentprofileRouter = require("./routes/editstudentprofileRouter");
const adminDashboardRouter = require("./routes/adminDashboardRouter");
const forgotpasswordRouter = require("./routes/forgotpasswordRouter");
const resetpasswordRouter = require("./routes/resetpasswordRouter");
require('./config/db');
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended:true
  }));
app.use(cors());
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/profile', profileRouter);
app.use('/editstudent',editstudentprofileRouter);
app.use('/dashboard', adminDashboardRouter);
app.use('/forgotpassword', forgotpasswordRouter);
app.use('/resetpassword', resetpasswordRouter);


app.listen(process.env.PORT, () => console.log(`server has started at port ${process.env.PORT}`));
app.get("/", (req, res) => {
    res.status(200).send({ message: "API is live!" });
  });
  
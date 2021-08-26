const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((res) => {
    console.log("MongoDB Connected");
  });
  
  
  //default connection
  var db = mongoose.connection;
  
  //connection to error event
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
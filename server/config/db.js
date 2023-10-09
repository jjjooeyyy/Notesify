const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connectDB = async() => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true, 
      useFindAndModify: false, 
      useCreateIndex: true,
      useFindAndModify: false,
      connectTimeoutMS: 30000, // Increase this value as needed
      socketTimeoutMS: 30000, // Increase this value as needed
    });
    console.log(`Database Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
}
module.exports = connectDB;
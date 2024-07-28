const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

mongoose.connect(process.env.mongoDB_URI)
mongoose.connection.on('connected',()=>console.log('connected to mongoDB'))
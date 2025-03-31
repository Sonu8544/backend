const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://sksonu8544:Q1l75l40wr11mCLT@devtinder.lswxmxp.mongodb.net/DevTinder");
}


module.exports = connectDB;
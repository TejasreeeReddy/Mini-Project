require("dotenv").config();// connecting database using mongoose library.
const mongoose = require("mongoose");//It library which provides a straightforward way to interact with MongoDB by defining schemas and models.

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connection SUCCESS");
    } catch (error) {
        console.log("MongoDB connection FAIL");
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;

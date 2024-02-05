const mongoose = require("mongoose");

const dbPath = process.env.MONGO_URI;

const connectDB = async ()=>{
    try {
        await mongoose.connect(dbPath);
        console.log("Mongo DB Connected")
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
// left off at part 5: Part 5: Finishing touches to pull up a single post.
module.exports = connectDB;
import mongoose from "mongoose";
async function dbConnect() {
    try {
        console.log("Connecting to database...");
        console.log(process.env.MONGODB_URI);
        console.log(process.env.DB_NAME);
        const connectioninstance=await mongoose.connect(process.env.MONGODB_URI,{dbName:process.env.DB_NAME});
        console.log("Database connected successfully",connectioninstance.connection.host);
    } catch (error) {
        console.error("Database connection failed", error);
        process.exit(1);
    }
}

export default dbConnect;
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error("MONGODB_URI missing");
            process.exit(1);
        }
        mongoose.set("strictQuery", true);
        mongoose.connection.on('connected', ()=> console.log('Database Connected'));
        mongoose.connection.on('error', (err)=> console.error('Mongo error:', err.message));
        await mongoose.connect(uri, { dbName: process.env.MONGODB_DB_NAME || 'chat-app' });
    } catch (error) {
        console.error('Failed to connect MongoDB:', error.message);
        process.exit(1);
    }
};
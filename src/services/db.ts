import mongoose from "mongoose";

export async function connectDb(): Promise<void> {
    const uri = process.env.MONGODB_URI;
 
    if (!uri) {
        console.error("❌ MONGODB_URI is missing in the env file.");
        process.exit(1);
    }

    // Modern Mongoose 8 settings
    mongoose.set('strictQuery', true); 

    await mongoose.connect(uri);
}

export async function closeDb(): Promise<void> {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
    }
}

mongoose.connection.on('connected', () => console.info('✅ Mongoose: Connected to DB'));
mongoose.connection.on('error', (err) => console.error('❌ Mongoose: Connection error:', err));
mongoose.connection.on('disconnected', () => console.info('⚠️ Mongoose: Disconnected'));
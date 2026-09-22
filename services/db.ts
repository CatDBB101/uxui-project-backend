import mongoose from "mongoose";

export const connectDB = async (uri: string): Promise<void> => {
    try {
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on("error", (err) => {
            console.error(`MongoDB connection error: ${err}`);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
        });
    } catch (error) {
        console.error(
            `Error connecting to MongoDB: ${error instanceof Error ? error.message : error}`,
        );
        process.exit(1);
    }
};

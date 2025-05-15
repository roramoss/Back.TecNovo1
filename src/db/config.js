import mongoose from "mongoose";
import dotenv from "dotenv"






dotenv.config();



export const dbConnect = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            autoIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const url = `${connection.connection.host}: ${connection.connection.port}`;

        console.log(`MongoDB conectado en: ${url}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1); // Salir con un código de error si la conexión falla
    }
};

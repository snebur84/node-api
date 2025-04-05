import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

export async function connectMemoryDB() {
    try {
        console.log("🟡 Iniciando MongoDB em memória...");

        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ Conectado ao MongoDB em memória!");

        return mongoose;
    } catch (err) {
        console.error("❌ Erro ao iniciar MongoDB em memória:", err);
        throw err;
    }
}

export async function closeMemoryDB() {
    try {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        if (mongoServer) {
            await mongoServer.stop();
        }
        console.log("🛑 Banco de dados em memória fechado.");
    } catch (err) {
        console.error("❌ Erro ao fechar MongoDB em memória:", err);
    }
}

export async function clearMemoryDB() {
    try {
        const collections = mongoose.connection.collections;

        // Limpa todas as coleções do banco em memória
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany(); 
        }

        console.log("✅ Banco de dados em memória limpo!");
    } catch (err) {
        console.error("❌ Erro ao limpar o banco de dados em memória:", err);
    }
}

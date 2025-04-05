import express, { json } from 'express';
import { connectMemoryDB, closeMemoryDB } from "./src/utils/memoryDb.js"; 
import userRoutes from "./src/routes/userRoutes.js";

const app = express();
const port = 3000;

async function startServer() {
    try {
        const { mongoose, mongoServer } = await connectMemoryDB();
        app.use(json()); // Para interpretar JSON nas requisições

        app.use("/", userRoutes);

        // Verifique se o servidor iniciou corretamente
        app.listen(3000, () => {
            console.log("Servidor rodando na porta 3000...");
        });

        // Imprimir a mensagem de confirmação
        console.log("Servidor foi iniciado com sucesso!");

        // Encerrando a conexão quando o processo for interrompido
        process.on("SIGINT", async () => {
            await closeMemoryDB(mongoose, mongoServer);
            console.log("Banco de dados em memória fechado.");
            process.exit();
        });
    } catch (err) {
        console.error("Erro ao iniciar o servidor:", err);
    }
}

startServer();

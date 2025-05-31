import express from "express"
import cors from "cors"
import { AppDataSource } from "./database/database-config.ts";
import { ContaController } from "./controllers/conta-controller.ts"
import { TransacaoController } from "./controllers/transacao-controller.ts"

AppDataSource.initialize()
    .then(() => {
        console.log("Banco de dados conectado com sucesso")
    }
    )
    .catch((err) => {
        console.error("Erro durante conexão com o banco de dados:", err)
    }
)

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        console.log("Request:", {
            method: req.method,
            url: req.originalUrl,
            headers: req.headers,
            body: req.body,
        });
        console.log("Response:", body);
        return originalSend.call(this, body);
    };
    next();
});

app.get("/conta", (req, res) => {
    ContaController.getAll(req, res);
});
app.get("/conta/:id", (req, res) => {
    ContaController.getById(req, res);
}
);
app.post("/conta", (req, res) => {
    ContaController.create(req, res);
});

app.put("/conta/:id", (req, res) => {
    ContaController.update(req, res);
});

app.delete("/conta/:id", (req, res) => {
    ContaController.delete(req, res);
});

app.get("/transacao", (req, res) => {
    TransacaoController.getAll(req, res);
});

app.get("/transacao/:id", (req, res) => {
    TransacaoController.getById(req, res);
});

app.post("/transacao", (req, res) => {
    TransacaoController.create(req, res);
});

app.post("/transacao/transferir", (req, res) => {
    TransacaoController.transfer(req, res);
});

app.get("/", (req, res) => {
    res.send("API de Controle Financeiro");
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

import express from "express"
import cors from "cors"
import { AppDataSource } from "./database/database-config.ts";
import { ContaController } from "./controllers/conta-controller.ts"

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
const contaController = new ContaController();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/conta", (req, res) => {
    contaController.getAll(req, res);
});
app.get("/conta/:id", (req, res) => {
    contaController.getById(req, res);
}
);
app.post("/conta", (req, res) => {
    contaController.create(req, res);
});

app.put("/conta/:id", (req, res) => {
    contaController.update(req, res);
});

app.delete("/conta/:id", (req, res) => {
    contaController.delete(req, res);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
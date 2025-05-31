import "reflect-metadata"
import { DataSource } from "typeorm"
import { Conta } from "./entities/conta.ts"
import { Transacao } from "./entities/transacao.ts"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "db.sqlite",
    synchronize: true,
    logging: false,
    entities: [
        Conta,
        Transacao
    ],
    subscribers: [],
    migrations: [],
    extra: {
        busyTimeout: 3000, // Tempo de espera em milissegundos
    },
})

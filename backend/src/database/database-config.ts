import "reflect-metadata"
import { DataSource } from "typeorm"
import { Conta, Transacao } from "./entidades.ts"

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

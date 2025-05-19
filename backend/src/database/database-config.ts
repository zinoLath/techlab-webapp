import "reflect-metadata"
import { DataSource } from "typeorm"
import { Conta, Transacao } from "./entidades"

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
})

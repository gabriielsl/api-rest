import knex from "knex";            // Importação da Lib
import type { Knex } from "knex"    // Importação apenas do tipo
import { env } from "./env/index.js";


export const config: Knex.Config = {
    client: "sqlite3",
    connection: {
        filename: env.DATABASE_URL,     // Uso da variável de ambiente
    },
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: "./db/migrations"
    }
}

export const setupKnex = knex(config)   // Exportando as configurações do banco de dados
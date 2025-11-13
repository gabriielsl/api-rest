import knex from "knex";            // Importação da Lib
import type { Knex } from "knex"    // Importação apenas do tipo

export const config: Knex.Config = {
    client: "sqlite3",
    connection: {
        filename: "./db/app.db",
    },
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: "./db/migrations"
    }
}

export const setupKnex = knex(config)
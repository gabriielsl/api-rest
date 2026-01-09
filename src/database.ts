import knex from "knex";            // Importação da Lib
import type { Knex } from "knex"    // Importação apenas do tipo
import { env } from "./env/index.js";

// Setup/configuração do banco de dados
export const config: Knex.Config = {
    client: env.DATABASE_CLIENT,
    connection: env.DATABASE_URL === "sqlite" 
    ? {
        filename: env.DATABASE_URL,
      }
    : env.DATABASE_URL,
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: "./db/migrations"
    }
}

export const setupKnex = knex(config)
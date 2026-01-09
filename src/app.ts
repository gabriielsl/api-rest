import fastify from "fastify"
import cookie from "@fastify/cookie"

import { setupKnex } from "./database.js"
import { env } from "./env/index.js"
import { transactionsRoutes } from "./routes/transactions.js"

export const app = fastify()

app.register(cookie)

// Prefixo de todas as rotas da aplicação
app.register(transactionsRoutes, {
    prefix: "transactions"
})
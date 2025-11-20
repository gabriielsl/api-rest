import type { FastifyInstance } from "fastify"
import { setupKnex } from "../database.js"

export function transactionsRoutes(app: FastifyInstance) {
    app.post("/", async () => {
        const transaction = await setupKnex("transactions")
        .select("*")
        .where("amount", 500)
    
        return transaction
    })
}
import { z } from "zod"
import type { FastifyInstance } from "fastify"
import { setupKnex } from "../database.js"
import { randomUUID } from "node:crypto"

export async function transactionsRoutes(app: FastifyInstance) {
    app.post("/", async (request, reply) => {
        const createTransactionBodySchema = z.object({
            text: z.string(),
            amount: z.number(),
            type: z.enum(["credit", "debit"])
        })

        const { text, amount, type } = createTransactionBodySchema.parse(
            request.body
        )

        await setupKnex("transactions").insert({
            id: randomUUID(),
            text,
            amount: type === "credit" ? amount : amount * -1 
        })

        return reply.status(201).send()
    })
}
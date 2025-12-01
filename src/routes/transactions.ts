import { z } from "zod"
import type { FastifyInstance } from "fastify"
import { setupKnex } from "../database.js"
import { randomUUID } from "node:crypto"

export async function transactionsRoutes(app: FastifyInstance) {
    // Rota de Listagem das transações
    app.get("/", async () => {
        const transactions = await setupKnex("transactions").select()

        return { transactions }
    })

    // Rota de listagem única
    app.get("/:id", async (request) => {
        const getTransactionParamsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionParamsSchema.parse(request.params)

        const transaction = await setupKnex("transactions").where("id", id).first()

        return { transaction }
    })

    app.get("/summary", async () => {
        const summary = await setupKnex("transactions")
        .sum("amount", { as: "amount" })
        .first()

        return { summary }
    } )

    // Rota de criação de transações
    app.post("/", async (request, reply) => {
        const createTransactionBodySchema = z.object({
            text: z.string(),
            amount: z.number(),
            type: z.enum(["credit", "debit"])
        })

        // Validação dos tipos vindos da requisição, comparando-os ao schema
        const { text, amount, type } = createTransactionBodySchema.parse(
            request.body
        )

        await setupKnex("transactions").insert({
            id: randomUUID(),
            text,
            amount: type === "credit" ? amount : amount * -1,
        })

        return reply.status(201).send()
    })
}
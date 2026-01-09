import { z } from "zod"
import type { FastifyInstance } from "fastify"
import { setupKnex } from "../database.js"
import { randomUUID } from "node:crypto"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists.js"

export async function transactionsRoutes(app: FastifyInstance) {
    app.addHook("preHandler", async (request, reply) => {
        console.log(`[${request.method}] ${request.url}`)
    })

    // Rota de Listagem das transações
    app.get(
        "/", 
        {
            preHandler: [checkSessionIdExists]
        }, 
        async (request, reply) => {
        const { sessionId } = request.cookies

        const transactions = await setupKnex("transactions")
        .where("session_id", sessionId)
        .select()

        return { transactions }
    })

    // Rota de listagem única
    app.get(
        "/:id",
        {
            preHandler: [checkSessionIdExists]
        }, 
        async (request) => {
        const getTransactionParamsSchema = z.object({
            id: z.uuid()
        })

        const { id } = getTransactionParamsSchema.parse(request.params)

        const { sessionId } = request.cookies

        const transaction = await setupKnex("transactions")
        .where({
            session_id: sessionId,
            id
        })
        .first()

        return { transaction }
    })

    // Resumo de transações
    app.get(
        "/summary",
        {
            preHandler: [checkSessionIdExists]
        }, 
        async (request) => {

        const { sessionId } = request.cookies

        const summary = await setupKnex("transactions")
        .where("session_id", sessionId)
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

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()

            reply.setCookie("sessionId", sessionId, {
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })
        }

        await setupKnex("transactions").insert({
            id: randomUUID(),
            text,
            amount: type === "credit" ? amount : amount * -1,
            session_id: sessionId,
        })

        return reply.status(201).send()
    })
}
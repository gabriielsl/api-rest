import fastify from "fastify"
import { setupKnex } from "./database.js"
import { env } from "./env/index.js"

const app = fastify()

app.get("/", async () => {
    const transaction = await setupKnex("transactions").select("*")

    return transaction
})

app.listen({
    port: env.PORT,
}).then(() => {
    console.log("HTTP Server Running!")
})
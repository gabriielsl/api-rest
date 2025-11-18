import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("production"),  // Ambiente da aplicação
    DATABASE_URL: z.string(),
    PORT: z.number().default(3333)
})

const _env = envSchema.safeParse(process.env)

// Tratativa de erro
if ( _env.success === false ) {
    console.error("⚠ Invalid environment variables!", _env.error.format())

    throw new Error("Invalid Environment Variables")
}

export const env = _env.data
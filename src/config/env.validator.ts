import { z } from "zod"

export const envSchema = z.object({
    NODE_ENV: z.union([z.literal("development"), z.literal("production")]),
    DATABASE_HOST: z.string(),
    DATABASE_PORT: z.coerce.number(),
    DATABASE_USERNAME: z.string(),
    DATABASE_PASSWORD: z.string(),
    DATABASE_NAME: z.string(),
    SMS_API_KEY: z.string(),
    SMS_API_SECRET: z.string(),
})

export const envValidator = {
    validate(env: unknown) {
        try {
            return {
                error: null,
                value: envSchema.parse(env)
            }
        } catch (e) {
            return {
                error: e,
                value: null
            }
        }
    }
}
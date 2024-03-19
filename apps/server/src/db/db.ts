import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import dotenv from 'dotenv'

dotenv.config({})

const url = process.env.DATABASE_URL as string
const sql = postgres(url)
export const db = drizzle(sql, {
	schema,
})

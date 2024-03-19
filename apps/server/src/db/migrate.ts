import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config({})

const url = process.env.DATABASE_URL as string
const sql = postgres(url, { max: 1 })
const db = drizzle(sql)

async function main() {
	try {
		await migrate(db, {
			migrationsFolder: 'drizzle',
		})
		console.log('[db] migration successful')
		process.exit(1)
	} catch (error) {
		console.log(error)
		process.exit(1)
	}
}
main()

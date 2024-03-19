import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'
dotenv.config()

export default {
	schema: './src/db/schema.ts',
	out: './drizzle',
	driver: 'pg',
	dbCredentials: {
		user: 'postgres',
		password: 'soumak.',
		host: '127.0.0.1',
		port: 5432,
		database: 'dummyboard',
	},
} satisfies Config

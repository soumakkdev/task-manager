import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { toInt } from 'radash'
import { db } from '../db/db'
import { tasksTable } from '../db/schema'
import { sql } from 'drizzle-orm'

export async function getTasks(req: Request, res: Response, next: NextFunction) {
	try {
		const data = await db.select().from(tasksTable)
		res.json({ data })
	} catch (error: any) {
		next(createHttpError.InternalServerError(error.message || 'Error fetching tasks'))
	}
}

export async function getTask(req: Request, res: Response, next: NextFunction) {
	try {
		const taskId = toInt(req.params.taskId)
		if (taskId) {
			const data = await db
				.select()
				.from(tasksTable)
				.where(sql`${tasksTable.id} = ${taskId}`)

			res.json({ data: data[0] })
		} else {
			throw new Error('Invalid task id ')
		}
	} catch (error: any) {
		next(createHttpError.InternalServerError(error.message || 'Error fetching task'))
	}
}

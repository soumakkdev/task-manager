import { and, eq, sql } from 'drizzle-orm'
import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { toInt } from 'radash'
import { db } from '../db/db'
import { IAddTask, tasksTable } from '../db/schema'

interface IFetchTasksReqBody {
	pageNo?: number
	pageSize?: number
	searchQuery?: string
	priority?: 'urgent' | 'high' | 'normal' | 'low'
	deadline?: string
}

export async function fetchTasks(req: Request, res: Response, next: NextFunction) {
	try {
		const { pageNo = 1, pageSize = 20, searchQuery, priority, deadline } = req.body as IFetchTasksReqBody

		const filters = []
		if (searchQuery) {
			filters.push(sql`lower(${tasksTable.name}) LIKE ${searchQuery}`)
		}
		if (priority) {
			filters.push(eq(tasksTable.priority, priority))
		}
		if (deadline) {
			filters.push(eq(tasksTable.deadline, deadline))
		}

		const data = await db
			.select()
			.from(tasksTable)
			.where(and(...filters))
			.limit(pageSize)
			.offset(pageNo * pageSize)

		res.json({ data })
	} catch (error: any) {
		next(createHttpError.InternalServerError(error.message || 'Error fetching tasks'))
	}
}

export async function getTask(req: Request, res: Response, next: NextFunction) {
	try {
		const taskId = toInt(req.params.taskId)
		if (taskId) {
			const data = await db.select().from(tasksTable).where(eq(tasksTable.id, taskId))

			res.json({ data: data[0] })
		} else {
			throw new Error('Invalid task id ')
		}
	} catch (error: any) {
		next(createHttpError.InternalServerError(error.message || 'Error fetching task'))
	}
}

export async function createTask(req: Request, res: Response, next: NextFunction) {
	try {
		const { name, description, deadline, priority, statusId } = req.body as IAddTask
		const result = await db.insert(tasksTable).values({
			name,
			description,
			deadline,
			priority,
			statusId,
		})
		res.json({ data: result })
	} catch (error: any) {
		next(createHttpError.InternalServerError(error.message || 'Error creating task'))
	}
}

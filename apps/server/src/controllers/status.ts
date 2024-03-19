import { eq } from 'drizzle-orm'
import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import { db } from '../db/db'
import { IAddStatus, statusTable } from '../db/schema'

export async function fetchStatus(req: Request, res: Response, next: NextFunction) {
	try {
		const data = await db.select().from(statusTable)
		res.json({ data })
	} catch (error: any) {
		next(createHttpError.InternalServerError(error.message || 'Error fetching status'))
	}
}

export async function createStatus(req: Request, res: Response, next: NextFunction) {
	try {
		const { name, color, type } = req.body as IAddStatus
		const result = await db.insert(statusTable).values({
			name,
			color,
			type,
		})
		res.json({ data: result })
	} catch (error: any) {
		next(createHttpError.InternalServerError(error.message || 'Error creating status'))
	}
}

export async function updateStatus(req: Request, res: Response, next: NextFunction) {
	try {
		const { statusId } = req.params
		const { name, color, type } = req.body as IAddStatus
		const result = await db
			.update(statusTable)
			.set({
				name,
				color,
				type,
			})
			.where(eq(statusTable.id, Number(statusId)))
		res.json({ data: result })
	} catch (error: any) {
		next(createHttpError.InternalServerError(error.message || 'Error updating status'))
	}
}

export async function deleteStatus(req: Request, res: Response, next: NextFunction) {
	try {
		const { statusId } = req.params
		const result = await db
			.delete(statusTable)
			.where(eq(statusTable.id, Number(statusId)))
			.returning({
				id: statusTable.id,
			})
		res.json({ data: result })
	} catch (error: any) {
		next(createHttpError.InternalServerError(error.message || 'Error deleting status'))
	}
}

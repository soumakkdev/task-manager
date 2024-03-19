import { NextFunction, Request, Response } from 'express'

const errorHandler = (err: Error | any, req: Request, res: Response, next: NextFunction) => {
	console.error('[ERROR] ', err)
	// logger.error('[ERROR]', err)

	const statusCode = err.status ?? err.statusCode ?? 500
	const name = err.name ?? 'ServerError'
	const message = err.message ?? 'Internal Server Error'

	res.status(statusCode).json({ error: name, message: message, success: false })
}

export default errorHandler

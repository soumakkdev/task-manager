import express from 'express'
import { getTask, getTasks } from '../controllers/tasks'

const router = express.Router()

router.get('/tasks', getTasks)
router.get('/tasks/:taskId', getTask)

export default router

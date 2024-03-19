import express from 'express'
import { getTask, fetchTasks } from '../controllers/tasks'

const router = express.Router()

router.post('/tasks', fetchTasks)
router.get('/tasks/:taskId', getTask)

export default router

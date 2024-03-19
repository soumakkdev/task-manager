import { relations } from 'drizzle-orm'
import { integer, pgEnum, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const priorityEnum = pgEnum('priority', ['urgent', 'high', 'normal', 'low'])
export const statusTypeEnum = pgEnum('status_type', ['active', 'done', 'closed'])

export const tasksTable = pgTable('tasks', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	description: varchar('description', { length: 255 }),
	deadline: varchar('deadline', { length: 50 }).notNull(),
	priority: priorityEnum('priority'),
	createdOn: varchar('createdOn', { length: 255 }),
	lastUpdated: varchar('lastUpdated', { length: 255 }),
	statusId: integer('status_id').references(() => statusTable.id),
})

const tasksRelations = relations(tasksTable, ({ many }) => ({
	tags: many(tagsTable),
}))

export const statusTable = pgTable('status', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	color: varchar('color', { length: 255 }),
	type: statusTypeEnum('status_type'),
})

const statusRelations = relations(statusTable, ({ one }) => ({
	task: one(tasksTable),
}))

export const tagsTable = pgTable('tags', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	color: varchar('color', { length: 255 }),
	taskId: integer('task_id').references(() => tasksTable.id),
})

// typescript types
export type ITask = typeof tasksTable.$inferSelect
export type IAddTask = typeof tasksTable.$inferInsert

export type IStatus = typeof statusTable.$inferSelect
export type IAddStatus = typeof statusTable.$inferInsert

export type ITag = typeof tagsTable.$inferSelect
export type IAddTag = typeof tagsTable.$inferInsert

// zod schema
export const ZTaskSchema = createSelectSchema(tasksTable)
export const ZAddTaskSchema = createInsertSchema(tasksTable)

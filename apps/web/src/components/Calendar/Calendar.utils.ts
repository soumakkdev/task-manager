import { Dayjs } from 'dayjs'

export interface IWeekDays {
	dates: IFormattedDate[]
}

export interface IFormattedDate {
	day: number
	month: number
	year: number
	isCurrentMonth: boolean
	isCurrentDay: boolean
}

export const formateDateObject = (date: Dayjs, currentMonth: number) => {
	const clonedObject = { ...date.toObject() }
	const formatedObject: IFormattedDate = {
		day: clonedObject.date,
		month: clonedObject.months,
		year: clonedObject.years,
		isCurrentMonth: clonedObject.months === currentMonth,
		isCurrentDay: date.isToday(),
	}

	return formatedObject
}

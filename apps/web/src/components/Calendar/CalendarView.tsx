'use client'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'

import isTodayPlugin from 'dayjs/plugin/isToday'
import objectPlugin from 'dayjs/plugin/toObject'
import weekdayPlugin from 'dayjs/plugin/weekday'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { IWeekDays, formateDateObject } from './Calendar.utils'

dayjs.extend(weekdayPlugin)
dayjs.extend(objectPlugin)
dayjs.extend(isTodayPlugin)

export default function CalendarView() {
	const now = dayjs()
	const dateFormat = 'MMM, YYYY'

	const [currentMonth, setCurrentMonth] = useState<Dayjs>(now)
	const [arrayOfDays, setArrayOfDays] = useState<IWeekDays[]>([])

	const nextMonth = () => {
		const plus = currentMonth.add(1, 'month')
		setCurrentMonth(plus)
	}
	const prevMonth = () => {
		const minus = currentMonth.subtract(1, 'month')
		setCurrentMonth(minus)
	}

	const renderDays = () => {
		const dateFormat = 'ddd'
		const days = []
		for (let i = 0; i < 7; i++) {
			days.push(<div className="bg-background py-1">{now.weekday(i).format(dateFormat)}</div>)
		}
		return <div className="grid grid-cols-7 gap-px border-b border-border text-center text-xs font-medium leading-6 text-gray-400 md:flex-none">{days}</div>
	}

	const getAllDays = () => {
		let currentDate = currentMonth.startOf('month').weekday(0) // 1st sunday in this month
		const nextMonth = currentMonth.add(1, 'month').month()

		const allDates = []
		let weekDates = []
		let weekCounter = 1

		while (currentDate.weekday(0).toObject().months !== nextMonth) {
			const formatted = formateDateObject(currentDate, currentMonth.month())
			weekDates.push(formatted)
			if (weekCounter === 7) {
				allDates.push({ dates: weekDates })
				weekDates = []
				weekCounter = 0
			}
			weekCounter++
			currentDate = currentDate.add(1, 'day')
		}
		setArrayOfDays(allDates)
	}

	useEffect(() => {
		getAllDays()
	}, [currentMonth])

	const renderCells = () => {
		const rows: any[] = []
		let days: any[] = []

		arrayOfDays.forEach((week) => {
			week.dates.forEach((d) => {
				days.push(
					<div
						key={d.day}
						className={cn('bg-white text-foreground font-medium relative', 'relative px-3 py-2', {
							'bg-slate-50 text-gray-400': !d.isCurrentMonth,
						})}
					>
						<time
							dateTime={d.day?.toString()}
							className={cn('rounded-full grid place-content-center mx-auto h-6 w-6', {
								'bg-blue-500 text-white': d.isCurrentDay,
							})}
						>
							{d.day}
						</time>
					</div>
				)
			})
			rows.push(days)
			days = []
		})

		return (
			<div className="flex bg-slate-200 text-xs leading-6 md:flex-auto">
				<div className="w-full grid grid-cols-7 grid-rows-6 gap-px">{rows}</div>
			</div>
		)
	}

	function renderHeader() {
		return (
			<header className="px-4 py-2 flex justify-between items-center">
				<div className="flex items-center gap-4">
					<span className="text-sm font-semibold">{currentMonth.format(dateFormat)}</span>
				</div>

				<div className="flex items-center gap-2">
					<button onClick={prevMonth} className="border">
						<ChevronLeft className="h-5 w-5 text-muted-foreground" />
					</button>
					<button onClick={() => setCurrentMonth(dayjs())}>Today</button>

					<button onClick={nextMonth} className="border">
						<ChevronRight className="h-5 w-5 text-muted-foreground" />
					</button>
				</div>
			</header>
		)
	}

	return (
		<div className="flex flex-col gap-3 h-full w-full">
			{renderHeader()}
			<div className="md:flex md:flex-auto md:flex-col">
				{renderDays()}
				{renderCells()}
			</div>
		</div>
	)
}

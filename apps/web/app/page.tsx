import BoardView from '../src/components/Board/BoardView'
import CalendarView from '../src/components/Calendar/CalendarView'

export default function Page(): JSX.Element {
	return (
		<main className="h-full max-w-6xl">
			{/* <CalendarView /> */}
			<BoardView />
		</main>
	)
}

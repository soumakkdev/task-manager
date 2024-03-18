'use client'
import React, { useEffect, useRef, useState } from 'react'
import { DragDropContext, Draggable, Droppable, OnDragEndResponder, OnDragStartResponder } from 'react-beautiful-dnd'
import { cn } from '../../lib/utils'
import { produce } from 'immer'

const columns = [
	{ title: 'Todo', id: 'todo' },
	{ title: 'Pending', id: 'pending' },
	{ title: 'Done', id: 'done ' },
]

export default function BoardView() {
	const [dndState, setDndState] = useState<Record<string, any[]>>({})
	const [currentDroppableId, setCurrentDroppableId] = useState<string | null>(null)

	const handleDragEnd: OnDragEndResponder = (result) => {
		const { destination, source } = result

		if (!destination) return
		if (destination.droppableId === source.droppableId && destination.index === source.index) return

		setDndState(
			produce((draft) => {
				const startCol = draft[source.droppableId] ?? []
				const finishCol = draft[destination.droppableId] ?? []

				const [removed] = startCol.splice(source.index, 1)
				finishCol?.splice(0, 0, removed) // force it to insert at the top
			})
		)
	}

	const handleDragStart: OnDragStartResponder = ({ source }) => {
		setCurrentDroppableId(source.droppableId)
	}

	const handleBeforeDragStart = () => {
		setCurrentDroppableId(null)
	}

	return (
		<div className="flex-1 overflow-x-auto overflow-y-hidden px-4 py-2">
			<DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} onBeforeDragStart={handleBeforeDragStart}>
				<div className="flex h-full">
					{columns?.map((column) => {
						return (
							<div className="min-w-[250px] lg:min-w-[300px] bg-muted border rounded-xl mr-3 flex flex-col overflow-hidden">
								<div className="px-3 py-2">
									<span className="text-sm font-bold">{column?.title ?? 'No Group'}</span>
								</div>

								<Droppable
									droppableId={column?.id}
									direction="vertical"
									type="tasks"
									isDropDisabled={currentDroppableId === column?.id || column?.id === null}
								>
									{(provided, snapshot) => (
										<div
											{...provided.droppableProps}
											ref={provided.innerRef}
											// isDraggingOver={snapshot.isDraggingOver}
											className="flex flex-col flex-1 overflow-hidden"
										>
											<ColumnEntries
												columnId={column?.id}
												onFetchRowData={(rowsData: any[]) => {
													setDndState(
														produce((draft) => {
															draft[column?.id] = rowsData
														})
													)
												}}
												dndState={dndState}
											/>
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</div>
						)
					})}
				</div>
			</DragDropContext>
		</div>
	)
}

const ColumnEntries = ({ columnId, onFetchRowData, dndState }: { columnId: string; dndState: Record<string, any[]>; onFetchRowData: any }) => {
	const columnData = dndState[columnId]

	const initializedRef = useRef(false)
	useEffect(() => {
		if (!initializedRef.current) {
			initializedRef.current = true
			onFetchRowData([{ name: 'Watch Dune 2 on Netflix', id: 2 }])
		}
	}, [columnId, onFetchRowData])
	useEffect(() => {
		return () => {
			initializedRef.current = false
		}
	}, [])
	return (
		<div className="h-full" id="scroll-id">
			{columnData?.map((opt, idx) => {
				return (
					<Draggable draggableId={opt?.id} key={opt?.id} index={idx}>
						{(provided, snapshot) => (
							<div
								{...provided.draggableProps}
								{...provided.dragHandleProps}
								ref={provided.innerRef}
								// dragging={snapshot.isDragging}
								className={cn('bg-background p-3 mx-2 my-1.5 border rounded-lg space-y-1 hover:border-muted-foreground', {
									'border-muted-foreground shadow-lg bg-muted': snapshot.isDragging,
								})}
								// onClick={() => onClickEntry(opt.id)}
							>
								<div className="text-sm font-normal">
									<span className="text-muted-foreground">Hi </span>
								</div>
							</div>
						)}
					</Draggable>
				)
			})}
		</div>
	)
}

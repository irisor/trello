import { shallowEqual, useSelector } from 'react-redux'
import { useForm } from '../../customHooks/useForm'
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { updateTask } from '../../store/board/board.actions';

export function TaskLabelsMenu() {
	const { taskId } = useParams()
	const memoizedSelector = (storeState) => {
        const board = storeState.boardModule.board
        const group = board.groups.find(g => g.tasks.some(t => t.id === taskId))
        const task = group?.tasks.find(t => t.id === taskId)
        return { board, currentTask: task, groupId: group?.id }
    }

	const { board, currentTask, groupId } = useSelector(memoizedSelector, shallowEqual)

	const { labels: boardLabels, _id: boardId } = board
	const { labels: taskLabels } = currentTask

	const initialLabelsForm = boardLabels?.reduce((acc, label) => {
		acc[label.id] = (taskLabels ?? []).some(tl => tl.id === label.id)
		return acc
	}, {}) ?? {}
	const [labelsForm, setlabelsForm, handleChange, resetForm] = useForm(initialLabelsForm)

	useEffect(() => {
		resetForm()
	}, [taskId])

	useEffect(() => {
		const newTaskLabels = boardLabels.filter(label => labelsForm[label.id])
		if (JSON.stringify(newTaskLabels) !== JSON.stringify(taskLabels)) {
			updateTask(boardId, groupId, { ...currentTask, labels: newTaskLabels })
		}
	}, [labelsForm])

	return (

		<form onSubmit={ev => ev.preventDefault()}>
			{boardLabels?.map(label => (
				<article key={label.id}>
					<input type="checkbox" id={label.id} checked={labelsForm[label.id]} onChange={handleChange} name={label.id} />
					<div className="task-label" style={{ backgroundColor: label.color }}>
						<label htmlFor={label.id}>{label.title}</label>
					</div>
				</article>
			))}
		</form>
	)
}

import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { IconContext } from 'react-icons'
import { HiOutlinePlus } from 'react-icons/hi'
import { AiOutlineClose } from 'react-icons/ai'

export function CreateItem({ onAddItem, initialBtnLbl = 'Add', addBtnLabel = 'Add', placeholder = 'Enter title...', groupId = null }) {
	const [itemData, setItemData] = useState(null)
	const board = useSelector(storeState => storeState.boardModule.board)
	const inputRef = useRef(null)
	const [itemType, SetItemType] = useState(groupId ?"task" : "group")


	useEffect(() => {
		inputRef.current?.focus()
	}, [itemData])

	function onAddEmptyItem(ev) {
		ev.stopPropagation()
		ev.preventDefault()
		setItemData({ title: '' })
	}

	function onChangeTitle(title) {
		setItemData(prevData => ({ ...prevData, title }))
	}

	function handleAddItem(newItem, ev = null) {
		
		// console.log('handleAddItem', newItem)
		ev?.preventDefault()
		ev?.stopPropagation()

		setItemData(null)

		if (newItem?.title !== '') {
			if (groupId) {
				// For tasks, include groupId
				onAddItem(groupId, newItem.title)
			} else {
				// For groups, omit groupId
				onAddItem(board._id, newItem)
			}
		}
	}

	function onClose(ev) {
		ev.preventDefault()
		setItemData(null)
	}

	return (
		<>
			{itemData ? (
				<>
					<div className="create-item-outside" onClick={ev => { handleAddItem(itemData, ev) }}></div>
					<form key="new-item" className="create-item edit">
						<textarea
							type="text"
							className="editable-title-input"
							value={itemData.title}
							onChange={ev => onChangeTitle(ev.target.value)}
							onKeyDown={ev => ev.key === 'Enter' && handleAddItem(itemData)}
							placeholder={placeholder}
							ref={inputRef}
						/>
						<button className="btn new-item-save btn-color-bold blue" onClick={ev => handleAddItem(itemData, ev)}>
							{addBtnLabel}
						</button>
						<button className="btn icon new-item-close" onClick={ev => onClose(ev)}>
							<IconContext.Provider value={{ color: 'inherit' }}>
								<AiOutlineClose />
							</IconContext.Provider>
						</button>
					</form>
				</>
			) : (
				<button className={"btn create-item non-edit " + itemType} onClick={ev => onAddEmptyItem(ev)}>
					<div className="icon add-item">
					<IconContext.Provider value={{size: "16"}}>
						<HiOutlinePlus />
					</IconContext.Provider>
					</div>
					{initialBtnLbl}
				</button>
			)}
		</>
	);
}

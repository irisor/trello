import { useEffect, useRef, useState } from 'react'
import { useForm } from '../customHooks/useForm'
import { boardService } from '../services/board.service.local'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { removeBoard } from '../store/board.actions'
import { Modal } from './Modal'
import { AiOutlineClose } from 'react-icons/ai'
import { IconContext } from 'react-icons'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

export function BoardRemove({ isOpen, closeModal, clickRef }) {
  const [boardForm, setBoardForm, handleChange, resetForm] = useForm(boardService.getEmptyBoard())
  const [position, setPosition] = useState(calculatePosition())
  const focusRef = useRef(null)
  const board = useSelector(storeState => storeState.boardModule.board)
  const navigate = useNavigate()

  useEffect(() => {
    resetForm()
  }, [isOpen])

  useEffect(() => {
    setPosition(calculatePosition())
  }, [clickRef?.current])

  function onSubmitBoard(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    onRemoveBoard()
    setBoardForm(boardService.getEmptyBoard())
  }

  function calculatePosition() {
    if (!clickRef?.current) return

    // The modal is positioned right to the "create new board" element
    const rect = clickRef.current.getBoundingClientRect()
    const offset = 8 // px
    const insetInlineStart = rect?.right + offset
    const insetBlockStart = rect?.y

    return { insetInlineStart, insetBlockStart }
  }

  async function onRemoveBoard() {
    try {
      await removeBoard(board._id)
      closeModal()
      navigate('/boards/', { replace: true })
      showSuccessMsg('Board removed')
    } catch (err) {
      showErrorMsg('Cannot remove board')
    }
  }

  function onClose(ev) {
    ev.preventDefault()
    ev.stopPropagation()
    closeModal()
  }

  return (
    <div className='board-add'>
      <Modal isOpen={isOpen} closeModal={ev => onClose(ev)} position={position} focusRef={focusRef}>
        <form onSubmit={ev => onSubmitBoard(ev)} onKeyDown={ev => ev.key === 'Enter' && onSubmitBoard(ev)} noValidate>
          <header className='board-add-header'>
            <h2 className='board-add-title'>Remove board?</h2>
            <button className='btn icon board-add-close' onClick={ev => onClose(ev)}>
              <IconContext.Provider value={{ color: 'inherit' }}>
                <AiOutlineClose />
              </IconContext.Provider>
            </button>
          </header>
          <section className='board-add-content'>
            <button className={`board-add-create btn btn-color-bold red`}>Remove</button>
          </section>
        </form>

      </Modal>
    </div >
  )
}

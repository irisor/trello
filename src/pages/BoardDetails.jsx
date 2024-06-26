import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { GroupList } from '../cmps/GroupList'
import { BoardSidebar } from '../cmps/BoardSidebar'
import { BoardMenu } from '../cmps/BoardMenu'
import { BoardHeader } from '../cmps/BoardHeader'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { loadBoard, addGroup, removeGroup, updateGroup } from '../store/board.actions'


export function BoardDetails() {

  const { boardId } = useParams()
  const board = useSelector(storeState => storeState.boardModule.board)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  console.log('board.details:', board, boardId)

  useEffect(() => {
    console.log('BoardDetails useEffect: ', boardId)
    loadBoard(boardId)
  }, [boardId])

  async function onAddGroup(boardId, newGroup) {
    if (!newGroup.title) return
    try {
      await addGroup(boardId, newGroup)
      showSuccessMsg(`Group added`)
    } catch (err) {
      showErrorMsg('Cannot add group')
    }
  }

  async function onRemoveGroup(boardId, groupId) {
    try {
      await removeGroup(boardId, groupId)
      showSuccessMsg(`Group removed`)
    } catch (err) {
      showErrorMsg('Cannot remove group')
    }
  }

  async function onUpdateTitle(group, updatedTitle) {
    try {
      const newGroup = { ...group, title: updatedTitle }
      await updateGroup(boardId, newGroup)
      showSuccessMsg(`Group title updated`)
    } catch (err) {
      showErrorMsg('Cannot update group title')
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }


  if (!board || !boardId || boardId !== board._id) return <section>Loading...</section>
  return (
    <section className={`board-details ${isMenuOpen ? 'menu-open' : ''}`}>
      {board && <>
        <BoardSidebar>
        </BoardSidebar>

        <BoardHeader toggleMenu={toggleMenu} isMenuOpen={isMenuOpen}>
        </BoardHeader>

        <main className="board-main">
          <GroupList
            onRemoveGroup={onRemoveGroup}
            onUpdateTitle={onUpdateTitle}
            onAddGroup={onAddGroup}
          >
          </GroupList>
        </main>

        <BoardMenu toggleMenu={toggleMenu}>
        </BoardMenu>
      </>
      }
      <Outlet />
    </section>
  )
}
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React, { MouseEvent } from 'react'

import selectedLogo from '../assets/selectedLogo.png'
import unselectedLogo from '../assets/uncheckedLogo.png'
import deleteLogo from '../assets/deleteBlue.png'
import editLogo from '../assets/editLogo.png'
import editSave from '../assets/application.png'
import cancel from '../assets/cancel.png'

// Define props type
interface TodoItemsProps {
  id: string
  task: string
  isCompleated: boolean
  deleteTask: (index: number) => void
  index: number
  updateSelected: (index: number) => void
  editText: string
  editIndexHandle: (index: number) => void
  handleEditTask: (e: React.ChangeEvent<HTMLInputElement>) => void
  saveEdit: (index: number) => void
  cancelEdit: () => void
  editIndex: number | null
}

const TodoItems: React.FC<TodoItemsProps> = ({
  id,
  task,
  isCompleated,
  deleteTask,
  index,
  updateSelected,
  editText,
  editIndexHandle,
  handleEditTask,
  saveEdit,
  cancelEdit,
  editIndex
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const stopPropagation = (e: MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center my-3 rounded-xl bg-gray-100 cursor-move"
    >
      <div className="flex flex-1 gap-2 items-center p-2">
        <img
          onClick={(e) => {
            stopPropagation(e)
            updateSelected(index)
          }}
          src={isCompleated ? selectedLogo : unselectedLogo}
          alt=""
          className="w-8 cursor-pointer"
        />

        <ul className="w-full">
          {editIndex === index ? (
            <div className="flex gap-2 items-center w-full">
              <input
                type="text"
                value={editIndex === index ? editText : task}
                onChange={(e) => {
                  stopPropagation(e as any) 
                  handleEditTask(e)
                }}
                onClick={stopPropagation}
                className="text-lg ml-1 border px-2 rounded p-2 border-gray-400 flex-1 mr-3"
              />
              <img
                onClick={(e) => {
                  stopPropagation(e)
                  saveEdit(index)
                }}
                src={editSave}
                alt="Save"
                className="w-6 cursor-pointer mx-3"
              />
              <img
                onClick={(e) => {
                  stopPropagation(e)
                  cancelEdit()
                }}
                src={cancel}
                alt="Cancel"
                className="w-6 cursor-pointer"
              />
            </div>
          ) : (
            <li
              onClick={(e) => {
                stopPropagation(e)
                updateSelected(index)
              }}
              className={`font-medium text-lg ml-1 decoration-slate-600 text-slate-800 ${
                isCompleated ? 'line-through' : ''
              }`}
            >
              {task}
            </li>
          )}
        </ul>
      </div>
      <div className="flex gap-5 pr-2">
        {editIndex !== index && (
          <>
            <img
              onClick={(e) => {
                stopPropagation(e)
                editIndexHandle(index)
              }}
              src={editLogo}
              alt="Edit"
              className="w-6 cursor-pointer"
            />
            <img
              onClick={(e) => {
                stopPropagation(e)
                deleteTask(index)
              }}
              src={deleteLogo}
              alt="Delete"
              className="w-6 cursor-pointer"
            />
          </>
        )}
      </div>
    </div>
  )
}

export default TodoItems
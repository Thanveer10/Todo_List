import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React from 'react'

import selectedLogo from '../assets/selectedLogo.png'
import unselectedLogo from '../assets/uncheckedLogo.png'
import deleteLogo from '../assets/deleteBlue.png'
import editLogo from '../assets/editLogo.png'
import editSave from '../assets/application.png'
import cancel from '../assets/cancel.png'
import gripIcon from '../assets/gripIcon2.png'

const TodoItems = ({
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center my-3 rounded-xl bg-gray-100"
    >
      <div className="flex flex-1 gap-2 items-center p-2 cursor-pointer">
        <img
          onClick={() => updateSelected(index)}
          src={isCompleated ? selectedLogo : unselectedLogo}
          alt=""
          className="w-8"
        />

        <ul className="w-full" >
          {editIndex === index ? (
            <div className="flex gap-2 items-center w-full">
              <input
                type="text"
                value={editIndex === index ? editText : task.text}
                onChange={handleEditTask}
                className="text-lg ml-1 border px-2 rounded p-2 border-gray-400 flex-1 mr-3"
              />
              <img onClick={() => saveEdit(index)} src={editSave} alt="" className="w-6 cursor-pointer mx-3" />
              <img onClick={cancelEdit} src={cancel} alt="" className="w-6 cursor-pointer" />
            </div>
          ) : (
            <li {...listeners}
              onClick={() => updateSelected(index)}
              className={`font-medium text-lg ml-1 decoration-slate-600 text-slate-800 ${
                isCompleated ? 'line-through' : ''
              }`}
            >
              {task}
            </li>
          )}
        </ul>
      </div>
      <div className="flex gap-5">
        {editText === null && (
          <>
             <img
                src={gripIcon}
                alt="Drag handle"
                className="w-6 cursor-move"
                {...listeners} // Apply listeners only to the drag handle
             />
            <img onClick={() => editIndexHandle(index)} src={editLogo} alt="" className="w-6" />
            <img onClick={() => deleteTask(index)} src={deleteLogo} alt="" className="w-6" />
          </>
        )}
      </div>
    </div>
  )
}

export default TodoItems

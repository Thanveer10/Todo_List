import { useState } from 'react'
import TodoLogo from '../assets/Todo_list_logo.png'
import TodoItems from './TodoItems'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'

// Define the Task type
interface Task {
  id: string
  text: string
  isCompleated: boolean 
}

function Todo() {
  const [text, setText] = useState<string>('')
  const [tasks, setTask] = useState<Task[]>([])
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editText, setEditText] = useState<string>('')

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  function handleInputText(e: React.ChangeEvent<HTMLInputElement>) {
    setText(e.target.value)
  }

  function addTask() {
    if (text.trim() === '') return
    const newTask: Task = {
      id: Date.now().toString(),
      text: text.trim(),
      isCompleated: false
    }
    setTask(prev => [...prev, newTask])
    setText('')
  }

  function deleteTask(index: number) {
    setTask(prev => prev.filter((_, i) => i !== index))
  }

  function updateSelected(index: number) {
    setTask(prev =>
      prev.map((task, i) =>
        i === index ? { ...task, isCompleated: !task.isCompleated } : task
      )
    )
  }

  function editIndexHandle(index: number) {
    setEditIndex(index)
    setEditText(tasks[index].text)
  }

  function handleEditTask(e: React.ChangeEvent<HTMLInputElement>) {
    setEditText(e.target.value)
  }

  function saveEdit(index: number) {
    const updated = [...tasks]
    updated[index].text = editText
    setTask(updated)
    setEditIndex(null)
    setEditText('')
  }

  function cancelEdit() {
    setEditIndex(null)
    setEditText('')
  }

  const getPos = (id: string): number => tasks.findIndex(task => task.id === id)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setTask((tasks) => {
      const orgPos = getPos(active.id as string) 
      const newPos = getPos(over.id as string)
      return arrayMove(tasks, orgPos, newPos)
    })
  }

  return (
    <div className="bg-white place-self-center flex flex-col w-11/12 max-w-lg min-h-[550px] p-7 rounded-xl ">
      <div className="flex items-center mt-5 gap-2">
        <img src={TodoLogo} alt="" className="w-10" />
        <h1 className="font-bold text-3xl">ToDo List</h1>
      </div>

      <div className="my-10 flex items-center bg-blue-500 rounded-full">
        <input
          type="text"
          placeholder="Enter your task...."
          onChange={handleInputText}
          value={text}
          className="flex-1 p-3 pl-5 rounded-r-none rounded-full border border-current border-r-indigo-500 h-14"
        />
        <button className="p-3 text-white font-semibold h-14" onClick={addTask}>
          ADD +
        </button>
      </div>

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task, index) => (
            <TodoItems
              key={task.id}
              id={task.id}
              task={task.text}
              isCompleated={task.isCompleated}
              deleteTask={deleteTask}
              index={index}
              updateSelected={updateSelected}
              editIndex={editIndex}
              editText={editText}
              editIndexHandle={editIndexHandle}
              handleEditTask={handleEditTask}
              saveEdit={saveEdit}
              cancelEdit={cancelEdit}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default Todo
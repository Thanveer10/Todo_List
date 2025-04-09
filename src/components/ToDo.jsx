import { useState } from 'react'
import TodoLogo from '../assets/Todo_list_logo.png'
import TodoItems from './TodoItems'

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core'

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'

function Todo() {
  const [text, setText] = useState('')
  const [tasks, setTask] = useState([])
  const [editIndex, setEditIndex] = useState(null)
  const [editText, setEditText] = useState(null)


  function handleInputText(e) {
    setText(e.target.value)
  }

  function addTask() {
    if (text.trim() === '') return
    const newTask = {
      id: Date.now().toString(),
      text: text.trim(),
      isCompleated: false
    }
    setTask(prev => [...prev, newTask])
    setText('')
  }

  function deleteTask(index) {
    setTask(prev => prev.filter((_, i) => i !== index))
  }

  function updateSelected(index) {
    setTask(prev =>
      prev.map((task, i) =>
        i === index ? { ...task, isCompleated: !task.isCompleated } : task
      )
    )
  }

  function editIndexHandle(index) {
    setEditIndex(index)
    setEditText(tasks[index].text)
  }

  function handleEditTask(e) {
    setEditText(e.target.value)
  }

  function saveEdit(index) {
    const updated = [...tasks]
    updated[index].text = editText
    setTask(updated)
    setEditIndex(null)
    setEditText(null)
  }

  function cancelEdit() {
    setEditIndex(null)
    setEditText(null)
  }

  const getPos=(id)=> tasks.findIndex(task => task.id === id)

  function handleDragEnd(event){
    let {active,over}=event;
    console.log(active)
    console.log(over)
    if(!over || active.id === over.id) return;

    setTask((tasks) =>{
         let orgPos=getPos(active.id)
         let newPos=getPos(over.id)
          
         return arrayMove(tasks,orgPos,newPos)
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
      

       <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
         <div>
          <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
            {tasks.length === 0
              ? <div className="flex justify-center items-center h-full">
                  <h1 className="text-2xl font-semibold text-gray-400">No Task Found!</h1>
                </div>
              :
            tasks.map((task, index) => (
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
                ))
                }
              
          </SortableContext>
         </div>
       </DndContext>
    </div>
  )
}

export default Todo

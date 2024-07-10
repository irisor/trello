import { Link } from "react-router-dom";
import { EditableTitle } from "./EditableTitle";
import { useRef, useState } from "react";

export function TaskPreview({groupId, task,onRemoveTask, onUpdateTaskTitle}){
let [isEditMode, SetisEditMode] = useState(false)
let [title, setTitle] = useState(task.title)
const inputRef = useRef(null)
inputRef?.current?.focus()
console.log(isEditMode)

async function onKeyDown(ev){
    console.log(ev.key)
    if(ev.key == 'Enter'){
        SetisEditMode(false)
        await onUpdateTaskTitle(groupId,task,ev.target.value)
    }
}

function onChange(ev){
    onUpdateTaskTitle(groupId,task.id,ev.target.value)
    SetisEditMode(false)
}

    return (
        <div className="task-preview">
            <div className="task-preview-container">
                {!isEditMode ?
                <Link to={`/${task.id}`}>
                    <a>{task.title}</a>
                </Link> :
                <input
                type ="text"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
                onKeyDown={onKeyDown}
                onBlur = {() => SetisEditMode(false)} />}
                <section className="task-actions">
                            <button onClick={() => onRemoveTask(groupId, task.id)}>X</button>
                            <button onClick={() => 
                        SetisEditMode(true)}>Edit</button>
                </section>
            </div>
        </div>
    )
}

{/* <p>
Status: {task.status} | Due: {task.dueDate}
| MemberIds: {task.memberIds?.join()}
</p> */}
// {group?.tasks?.map(task =>
//     <article key={task.id} className="task">
//         <Link to={`group/${group.id}/task/${task.id}`}>
//             <h4>{task.title}</h4>
//         </Link>
//         <p>
//             Status: {task.status} | Due: {task.dueDate}
//             | MemberIds: {task.memberIds?.join()}
//         </p>
//     </article>
// )}

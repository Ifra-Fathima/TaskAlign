const newTaskButton=document.getElementById('new');
const addNewTask=document.querySelector('.addNewTask');
const submitButton=document.getElementById('submitButton')
const add=document.getElementById('add')
const pendingTasks=document.getElementById('pending_tasks')
const form=document.getElementById('form')
const completedTasks=document.getElementById('completed_tasks')

newTaskButton.addEventListener('click',()=>{
    addNewTask.classList.toggle('display')

})

window.onload=function(){
    loadTasks();
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    const taskTitle=document.getElementById('title').value
    const date=document.getElementById('date').value
    const taskDescription=document.getElementById('description').value
    const taskPriority=document.getElementById('priority').value
    
    if(!taskTitle || !taskDescription || !date || !taskPriority){
        alert("Fill all the fields to proceed");
        // addNewTask.classList.add('display')
        return;
    }
    else{
        const task= {
            id:Date.now(),
            title:taskTitle,
            description: taskDescription,
            dueDate: date,
            priority: taskPriority,
            completed: false,
          };

        
        addNewPendingTasks(task);
        saveToLocalStorage(task);
        form.reset();
        addNewTask.classList.remove('display')
    }
})

function addNewPendingTasks(task){
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.setAttribute('data-id', task.id);
    taskElement.innerHTML= `
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <p>Due: ${task.dueDate}</p>
    <p>Priority: ${task.priority}</p>
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
    <button class="complete-btn">Mark as Completed</button>
  `;
    // pendingTasks.appendChild(taskElement);

    if(task.completed){
        taskElement.style.textDecoration='line-through';
        completedTasks.appendChild(taskElement)
    }
    else{
        pendingTasks.appendChild(taskElement)
    }
    taskElement.querySelector('.edit-btn').addEventListener('click',()=>edit(taskElement));
    taskElement.querySelector('.delete-btn').addEventListener('click',()=>deleteTAsk(taskElement));
    taskElement.querySelector('.complete-btn').addEventListener('click',()=>markAsCompleted(taskElement));
}

function saveToLocalStorage(task){
  const tasks=JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task)
    localStorage.setItem('tasks',JSON.stringify(tasks))
 }

function loadTasks(){
    const tasks=JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(addNewPendingTasks);
 }

 function edit(taskElement){
    const taskid=taskElement.getAttribute('data-id')
    const tasks=JSON.parse(localStorage.getItem('tasks')) || []
    const task=tasks.find((t)=>t.id===parseInt(taskid))

    if(task!== -1){
        const index=tasks[task]
        document.getElementById('title').value=task.title;
        document.getElementById('description').value=task.description;
        document.getElementById('date').value=task.dueDate;
        document.getElementById('priority').value=task.priority;
        addNewTask.classList.add('display');
        deleteTAsk(taskElement);

        addNewTask.classList.add('display');
        tasks.splice(task,1)
        localStorage.setItem('tasks',JSON.stringify(tasks))
        taskElement.remove()
    }
 }

 function deleteTAsk(taskElement){
    pendingTasks.removeChild(taskElement)
    updateLoaclStorage();
 }

 function updateLoaclStorage(){
    const tasks=[]
    
 }

 function markAsCompleted(taskElement){
    const taskid=taskElement.getAttribute('data-id');
    const tasks=JSON.parse(localStorage.getItem('tasks')) || [];
    const task=tasks.find((t)=>t.id===parseInt(taskid))    

    if(task){
        task.completed=true;
        localStorage.setItem('tasks',JSON.stringify(tasks))
        taskElement.remove()
        addNewPendingTasks(task);
    }
}
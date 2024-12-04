const newTaskButton=document.getElementById('new');
const addNewTask=document.querySelector('.addNewTask');
const submitButton=document.getElementById('submitButton')
const add=document.getElementById('add')
const pendingTasks=document.getElementById('pending_tasks')
const form=document.getElementById('form')
const completedTasks=document.getElementById('completed_tasks')
const completebutton=document.getElementById('completed')
const filterPriority = document.getElementById('filter-priority');
const filterDue = document.getElementById('filterDue');
const pendingbutton=document.getElementById("pending")
const filteredTasksDiv=document.getElementById('filtered-tasks')
const filterDueTasks=document.getElementById('filterDueTasks')

newTaskButton.addEventListener('click',()=>{
    addNewTask.classList.toggle('display')

})

document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
});

function loadTasks(){
    pendingTasks.innerHTML = "<h1>Pending tasks</h1>";
    completedTasks.innerHTML = "<h1>Completed tasks</h1>";

    const tasks=JSON.parse(localStorage.getItem('tasks')) || [];
    console.log(tasks)
    tasks.forEach(addNewPendingTasks)
    
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
)


pendingbutton.addEventListener('click',()=>{
    const ishidden=pendingTasks.classList.toggle('hidden')
    pendingbutton.textContent=ishidden? 'Show Pending tasks' : 'Hide pending tasks'
})


function addNewPendingTasks(task){
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.setAttribute('data-id', task.id);
    if(task.completed){
        taskElement.classList.add("completed-tasks")
    }

    taskElement.innerHTML= `
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <p>Due: ${task.dueDate}</p>
    <p>Priority: ${task.priority}</p>
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
    <button class="complete-btn">Mark as Completed</button>
  `;
  
  taskElement.querySelector('.edit-btn').addEventListener('click',()=>edit(taskElement));
  taskElement.querySelector('.delete-btn').addEventListener('click',()=>deleteTAsk(taskElement));
    
    if(!task.completed){
    taskElement.querySelector('.complete-btn').addEventListener('click',()=>markAsCompleted(taskElement));
    pendingTasks.appendChild(taskElement)
    }
    else{
        completedTasks.appendChild(taskElement)
    }
}

function saveToLocalStorage(task){
  const tasks=JSON.parse(localStorage.getItem('tasks')) || [];
  
    tasks.push(task)
    localStorage.setItem('tasks',JSON.stringify(tasks))
 }


function edit(taskElement){
    const taskid=taskElement.getAttribute('data-id')
    const tasks=JSON.parse(localStorage.getItem('tasks')) || []
    const taskindex=tasks.findIndex((t)=>t.id===parseInt(taskid))

    if(taskindex!== -1){
        const task=tasks[taskindex]
        document.getElementById('title').value=task.title;
        document.getElementById('description').value=task.description;
        document.getElementById('date').value=task.dueDate;
        document.getElementById('priority').value=task.priority;

        addNewTask.classList.add('display');
        tasks.splice(taskindex,1)
        localStorage.setItem('tasks',JSON.stringify(tasks))
        taskElement.remove()
    }
 }

 
 function deleteTAsk(taskElement){
    const taskid=taskElement.getAttribute('data-id')
    let tasks=JSON.parse(localStorage.getItem('tasks'))||[]
    tasks=tasks.filter(task=>task.id!==parseInt(taskid))

    localStorage.setItem('tasks',JSON.stringify(tasks))
    taskElement.remove();
}


completebutton.addEventListener('click',()=>{
    const ishidden=completedTasks.classList.toggle('hidden')
    completebutton.textContent=ishidden? 'Show Completed tasks' : 'Hide Completed tasks'
})


function markAsCompleted(taskElement){
    const taskid=taskElement.getAttribute('data-id');
    const tasks=JSON.parse(localStorage.getItem('tasks')) || [];
    const taskindex=tasks.findIndex((t)=>t.id===parseInt(taskid))    
    if(taskindex!==-1){
        tasks[taskindex].completed=true;
        localStorage.setItem('tasks',JSON.stringify(tasks))
        taskElement.remove()
        addNewPendingTasks(tasks[taskindex])
    }
}


filterPriority.addEventListener('change',()=>{
    const priority=filterPriority.value;
    const tasks=JSON.parse(localStorage.getItem('tasks')) ||[]
    const filteredTasks=priority==="all"? tasks:tasks.filter(task=>task.priority===priority)
        displayFilteredTAsks(filteredTasks);
})


filterDue.addEventListener('click',()=>{
    const tasks=JSON.parse(localStorage.getItem('tasks')) || []
    const filteredTasks=tasks.filter(task=>{
        const dueDate=new Date(task.dueDate)
        const today=new Date()
        const sevenDayslater=new Date()
        sevenDayslater.setDate(today.getDate()+7)
        return dueDate>=today && dueDate<=sevenDayslater
    })
    displayFilteredTAsks(filteredTasks)
})


function displayFilteredTAsks(tasks){
    filteredTasksDiv.innerHTML=`<h1>Filtered Tasks</h1>`
    if(tasks.length===0){
        const displaymessage=document.createElement('p');
        displaymessage.innerHTML="No tasks available for the selected filter"
        filteredTasksDiv.appendChild(displaymessage)
    }

    else{
        tasks.forEach(task=>{
            const taskElement=document.createElement('div')
            taskElement.classList.add('task')
            taskElement.innerHTML=`  <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Due: ${task.dueDate}</p>
                <p>Priority: ${task.priority}</p>`;
            filteredTasksDiv.appendChild(taskElement)
        })
    }
}


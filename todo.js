let tasks = [];
const tasksList = document.getElementById('list');
const addTaskInput = document.getElementById('add');
const tasksCounter = document.getElementById('tasks-counter');

// console.log('Working');

// aysnc keyword should be added inorder to use async function 
async function fetchTodos(){
    // // here in this function we will fetch some todos from an API and try to display it on our site
    // fetch("https://jsonplaceholder.typicode.com/todos")
    // .then(function(response){
    // //    console.log(response);
    // // we need to convert this resonse to a json file to fetch todo 
    // return response.json();
    // // and as we know that this json function again returns a promise so we will. so, we can call .then function on it again
    // }).then(function(data){
    //     // console.log(data);
    //     // after getting the data in proper json format then we will asign first 10 items to the tasks array and call render list
    //     tasks = data.slice(0,10);
    //     renderList();

    // })
    // // if we get any error 
    // .catch(function(error){
    //     console.log('error', error);
    // })

    // now we will just try and do the same task with async await 

    try{
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await response.json();
        const data2 = data.slice(0,5);
        console.log(data2);
        tasks = data2.slice(-4, -2);
        // slice() selects the elements starting at the given start argument, and ends at, but does not include, the given end argument.. Use negative numbers to select from the end of an array.

        console.log(tasks);
        renderList();
    }catch(error){
        console.log(error);
    }

}

function addTaskToDOM(task){
    const li = document.createElement('li');
    // yaha par delete button ke andar data-id attribute isiliye lagaya hai taaki uski help se ham pata laga pae ki konse task ko delete karna hai 
    li.innerHTML = `
          <input type="checkbox" id="${task.id}" ${
      task.completed ? "checked" : ""
    } class="custom-checkbox">
          <label for="${task.id}">${task.title}</label>
          <img src="bin.svg" class="delete" data-id="${task.id}" />
        
    `;
    tasksList.append(li);
}

function renderList () {
    tasksList.innerHTML = '';

    for(let i = 0; i < tasks.length; i++){
        addTaskToDOM(tasks[i]);
    }
    tasksCounter.innerHTML = tasks.length;
}

function toggleTask(taskId) {
    const task = tasks.filter(function(task){
        return task.id === Number(taskId);
    });
    if(task.length>0){
        const currentTask = task[0];
        currentTask.completed = !currentTask.completed;
        renderList();
        showNotification('Task toggled successfully');
        return;
    }
}

function deleteTask (taskId) {
    // deleting the task of specific id that is taskId from the array
    const newTasks = tasks.filter(function(task){
        return task.id !== Number(taskId);
    });

    tasks = newTasks;
    renderList();
    showNotification('Task deleted successfully');
}

function addTask (task) {
    if(task){
        tasks.push(task);
        renderList();
        showNotification('Task added successfully');
        // console.log(tasks);
        return;
    }

    showNotification('Task cannot be added');
}

function showNotification(text) {
    alert(text);
}

function handleInputKeypress(e){
    if(e.key === 'Enter'){
        const text = e.target.value;
        
        if(!text){
            // if the user do not enter anything and presses enter then this notification will be shown
            showNotification('task text can not be empty');
            return;
        }
        
        // now we will create an object for our task with its date also a boolean which will later help is to check or uncheck the task 
        
        const task = {
            title: text, 
            id : Date.now(),
            completed : false
        }
        
        // now we have to make the input box empty 
        
        addTask(task);
        e.target.value = "";
            
        }
}

function handleClickListner(e){
    const target = e.target;
    // console.log(target);
    if(target.className === 'delete'){
        const taskId = target.dataset.id;
        deleteTask(taskId);
        return;
    } else if(target.className === 'custom-checkbox'){
        const taskId = target.id;
        toggleTask(taskId);
        return;
    }
}

function initializeApp(){
    fetchTodos();
    addTaskInput.addEventListener('keyup', handleInputKeypress);
    // event delegation is a process where the event is called for whole document and we will check if the place where clicked is a checkbox or delete box and we will act accordingly.
    document.addEventListener('click', handleClickListner)
}

initializeApp();
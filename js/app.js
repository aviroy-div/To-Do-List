// Get references to DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');

// Load tasks from local storage
window.onload = loadTasksFromStorage;

// Add task
addTaskButton.addEventListener('click', addTask);

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === '') {
    alert('Please enter a task.');
    return;
  }

  createTaskElement(taskText);
  saveTaskToStorage(taskText, false);
  taskInput.value = '';
}

function createTaskElement(taskText, isCompleted = false) {
    const taskDiv = document.createElement('div');
    taskDiv.className = `task ${isCompleted ? 'completed' : ''}`;
  
    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
  
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = isCompleted;
    checkbox.addEventListener('click', () => toggleComplete(taskDiv));
  
    // Create the button group container
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
  
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit-button';
    editButton.addEventListener('click', () => editTask(taskDiv, taskSpan));
  
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button';
    deleteButton.addEventListener('click', () => deleteTask(taskDiv, taskText));
  
    // Add buttons to the button group
    buttonGroup.appendChild(editButton);
    buttonGroup.appendChild(deleteButton);
  
    // Append elements to the task container
    taskDiv.appendChild(checkbox);
    taskDiv.appendChild(taskSpan);
    taskDiv.appendChild(buttonGroup);
  
    taskList.appendChild(taskDiv);
  }
  

// Toggle task completion
function toggleComplete(taskDiv) {
  taskDiv.classList.toggle('completed');
  updateTaskInStorage(taskDiv);
}

// Edit task
function editTask(taskDiv, taskSpan) {
  const newTaskText = prompt('Edit your task:', taskSpan.textContent);
  if (newTaskText && newTaskText.trim() !== '') {
    const oldTaskText = taskSpan.textContent;
    taskSpan.textContent = newTaskText.trim();
    updateTaskTextInStorage(oldTaskText, newTaskText.trim());
  } else {
    alert('Task text cannot be empty.');
  }
}

// Delete a task
function deleteTask(taskDiv, taskText) {
  taskList.removeChild(taskDiv);
  removeTaskFromStorage(taskText);
}

// Save tasks to local storage
function saveTaskToStorage(taskText, isCompleted) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ text: taskText, completed: isCompleted });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task completion in local storage
function updateTaskInStorage(taskDiv) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskText = taskDiv.querySelector('span').textContent;
  const taskIndex = tasks.findIndex(task => task.text === taskText);
  if (taskIndex > -1) {
    tasks[taskIndex].completed = taskDiv.querySelector('input[type="checkbox"]').checked;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Update task text in local storage
function updateTaskTextInStorage(oldTaskText, newTaskText) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const taskIndex = tasks.findIndex(task => task.text === oldTaskText);
  if (taskIndex > -1) {
    tasks[taskIndex].text = newTaskText;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// Remove task from local storage
function removeTaskFromStorage(taskText) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasksFromStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => createTaskElement(task.text, task.completed));
}

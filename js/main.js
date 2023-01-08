'use strict'

// Знаходимо еленти на сторінці

const form = document.querySelector('#form'); // Знаходимо форму
const taskInput = document.querySelector('#taskInput'); // Знаходимо поле для вводу тексту
const taskList = document.querySelector('#tasksList'); // Знаходимо список задач
const emptyList = document.querySelector('#emptyList'); // Титулка списку задач

// масив з даними
let tasks = [];

if(localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
};


checkEmptyList();

// Додаєм задачу
form.addEventListener('submit', addTask);

// Видаляєм задачу
taskList.addEventListener('click', deleteTask);

// Помічаємо задачу виконаною
taskList.addEventListener('click', doneTask);

// Функції
function addTask(event) {
    // Відміняємо відправку форми
    event.preventDefault();

    // Дістаємо текст з поля для набору тексту
    const taskText = taskInput.value;

    // Описуємо обʼєкт у вигляді задач
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    }

    // Додаєм задачу в масив з задачами
    tasks.push(newTask);

    renderTask(newTask);

    saveToLocalStorage()

    // Очищуємо поле вводу та повертаємо на нього фокус
    taskInput.value = "";
    taskInput.focus();

    checkEmptyList();
}

function deleteTask(event) {
    // Перевіряємо , що клік був не по кнопці видалити
    if (event.target.dataset.action !== 'delete') return ;

    const parenNode = event.target.closest('.list-group-item');

    // Встановлюємо ID задачі
    const id = Number(parenNode.id);
    
    // Знаходимо індекс задачі в масиві
    const index = tasks.findIndex((task) => task.id === id);
    
    // Видаляєм задачу з масиву завдань
    tasks.splice(index, 1);

    saveToLocalStorage()

    // Видаляєм задачу з розмітки
    parenNode.remove();

    checkEmptyList();
}

function doneTask(event) {
    // Перевіряємо , що клік був не  по кнопці виконана задача
    if(event.target.dataset.action !== 'done') return;

    const parentNode = event.target.closest('.list-group-item');

    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done;

    saveToLocalStorage() 

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');   
}

function checkEmptyList() {
    if(tasks.length === 0) {
        const emptyListHTML = 
                        `<li id="emptyList" class="list-group-item empty-list">
                            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                            <div class="empty-list__title">Список дел пуст</div>
                        </li>`;
        taskList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if(tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    // Формуємо CSS клас
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    // Формуємо розмітку для нової задачі
    const taskHTML = `
                    <li id="${task.id }" class="list-group-item d-flex justify-content-between task-item">
                        <span class="${cssClass}">${task.text}</span>
                        <div class="task-item__buttons">
                            <button type="button" data-action="done" class="btn-action">
                                <img src="./img/tick.svg" alt="Done" width="18" height="18">
                            </button>
                            <button type="button" data-action="delete" class="btn-action">
                                <img src="./img/cross.svg" alt="Done" width="18" height="18">
                            </button>
                        </div>
                    </li>`;
    // Додаємо задачу на сторінку
    taskList.insertAdjacentHTML('beforeend', taskHTML);
}
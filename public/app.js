document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        handleTaskFormSubmit(taskInput.value);
        taskInput.value = '';
    });

    function handleTaskFormSubmit(task) {
        if (task === '') return;

        fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: task })
        })
        .then(response => response.json())
        .then(data => {
            const li = createTaskElement(data.name, data.id, data.completed);
            taskList.appendChild(li);
        });
    }

    function createTaskElement(task, id, completed) {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(task));
        if (completed) li.classList.add('completed');
        li.dataset.id = id;

        const deleteBtn = createDeleteButton();
        li.appendChild(deleteBtn);

        li.addEventListener('click', toggleTaskCompletion);

        return li;
    }

    function createDeleteButton() {
        const deleteBtn = document.createElement('button');
        deleteBtn.appendChild(document.createTextNode('Eliminar'));
        deleteBtn.addEventListener('click', (event) => {
            handleDeleteButtonClick(event);
        });
        return deleteBtn;
    }

    function handleDeleteButtonClick(event) {
        event.stopPropagation();
        const li = event.target.parentElement;
        const id = li.dataset.id;

        fetch(`/api/tasks/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            taskList.removeChild(li);
        });
    }

    function toggleTaskCompletion(event) {
        event.target.classList.toggle('completed');
    }

    function loadTasks() {
        fetch('/api/tasks')
        .then(response => response.json())
        .then(data => {
            data.tasks.forEach(task => {
                const li = createTaskElement(task.name, task.id, task.completed);
                taskList.appendChild(li);
            });
        });
    }

    loadTasks();
});


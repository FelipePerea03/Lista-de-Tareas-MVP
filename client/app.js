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

        const li = createTaskElement(task);
        taskList.appendChild(li);
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(task));
        
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
        taskList.removeChild(li);
    }

    function toggleTaskCompletion(event) {
        event.target.classList.toggle('completed');
    }
});


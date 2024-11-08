const inputTask = document.getElementById("inputTask");
const inputDay = document.getElementById("inputDay");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const pendingTask = document.getElementById("pendingTask");

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let nextId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

const renderizarTareas = () => {
    taskList.innerHTML = "";
  
    tasks.forEach((task) => {
        //Creacion del contenedor li
        const itemTask = document.createElement("li");
        itemTask.classList.add("list-group-item", "d-flex", "align-items-center", "justify-content-between");
        
        //Creacion del checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.classList.add("me-2");
        checkbox.addEventListener("change", () => markAsCompleted(checkbox, task.id));

        //Creacion del texto de la tarea
        const infoTask = document.createElement("span");
        infoTask.innerHTML = `
            <strong>Día: ${task.inputDay} --> ${task.infoTask}</strong>
        `;

        //Creacion del boton eliminar
        const buttonDelete = document.createElement("button");
        buttonDelete.textContent = "Eliminar";
        buttonDelete.classList.add("btn", "btn-danger", "btn-sm");
        buttonDelete.style.width = "auto";
        buttonDelete.addEventListener("click", () => deleteTask(task.id));

        //Añadir elementos al li
        itemTask.append(checkbox);
        itemTask.append(infoTask);
        itemTask.append(buttonDelete);
        taskList.append(itemTask);
  });
  showPendingTask();
};

const addTasks = () => {
    const name = inputTask.value.trim();
    const day = inputDay.value;

    if (name && day) {
        tasks.push({
            id: nextId++,
            inputDay: day,
            infoTask: name,
            completed: false,
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderizarTareas();
        inputDay.value = ""; // Limpiar el campo de selección después de agregar la tarea
        inputTask.value = ""; // Limpiar el campo de entrada después de agregar la tarea
    } else {
        alert("Por favor, rellena todos los campos");
    }
};

const deleteTask = (id) => {
    const index = tasks.findIndex((task) => task.id === id);
  
    if (index !== -1) {
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderizarTareas();
    }
};
  
const showPendingTask = () => {
    const pendientes = tasks.filter((task) => !task.completed).length;
    pendingTask.textContent = `Tareas pendientes: ${pendientes}`;
  };
  
const markAsCompleted = (checkbox, id) => {
    const task = tasks.find((task) => task.id === id);
  
    if (task) {
      task.completed = checkbox.checked;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderizarTareas();
    }
};
  
renderizarTareas();
//addTaskButton.addEventListener("click", addTasks);
addTaskButton.addEventListener("click", (event) => {
    event.preventDefault(); // Evita que el formulario recargue la página
    addTasks(); // Llama a tu función para agregar tareas
});
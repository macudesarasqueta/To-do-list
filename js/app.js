const inputTask = document.getElementById("inputTask");
const inputDay = document.getElementById("inputDay");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const pendingTask = document.getElementById("pendingTask");

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let nextId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

const daysOfWeek = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const renderizarTareas = () => {
    taskList.innerHTML = "";

    const completedTaskList = document.getElementById("completedTaskList");
    completedTaskList.innerHTML = "";

    tasks.sort((a, b) => {
        return daysOfWeek.indexOf(a.inputDay) - daysOfWeek.indexOf(b.inputDay);
    });

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
            <strong>${task.inputDay} <i class="bi bi-arrow-right-circle-fill"></i> ${task.infoTask}</strong>
        `;

        //Creacion del boton eliminar
        const buttonDelete = document.createElement("button");
        buttonDelete.textContent = "Eliminar";
        buttonDelete.classList.add("btn", "btn-danger", "btn-sm");
        buttonDelete.style.width = "auto";
        buttonDelete.addEventListener("click", (event) => {
            event.preventDefault();
            Swal.fire({
                title: "¿Estás seguro que quieres eliminar la tarea?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí"
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteTask(task.id); 
                    Swal.fire({
                        title: "¡Tarea eliminada!",
                        icon: "success"
                    });
                }
            });
        });

        //Añadir elementos al li
        itemTask.append(checkbox);
        itemTask.append(infoTask);
        itemTask.append(buttonDelete);
        // taskList.append(itemTask);
        
        if (task.completed) {
            completedTaskList.append(itemTask);
        } else {
            taskList.append(itemTask);
        }
    });

    showPendingTask();
};

const addTasks = () => {
    // console.log("ingresa a addTask");
    const name = inputTask.value.trim();
    const day = inputDay.value;

    if (!name || !day) {
        Swal.fire({
            title: "Por favor rellena todos los campos",
            icon: "error",
        })
        return;
    };
    // Verifica si ya existe una tarea en ese día con el mismo nombre
    const existingTask = tasks.find(task => task.inputDay === day && task.infoTask === name);
    if (existingTask) {
        Swal.fire({
            title: "Tarea duplicada",
            text: "Ya existe una tarea para este día con el mismo nombre.",
            icon: "warning",
            confirmButtonText: "Aceptar"
        });
        return; // Detener la ejecución para evitar que la tarea se agregue
    };
    const newTask = {
        id: nextId++,
        inputDay: day,
        infoTask: name,
        completed: false,
    };
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderizarTareas();
    inputDay.value = ""; // Limpiar el campo de selección después de agregar la tarea
    inputTask.value = ""; // Limpiar el campo de entrada después de agregar la tarea
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

    const completed = tasks.filter((task) => task.completed).length;
    
    const completedTaskHeader = document.getElementById("completedTask");
    completedTaskHeader.textContent = `Tareas realizadas: ${completed}`;
};
  
const markAsCompleted = (checkbox, id) => {
    const task = tasks.find((task) => task.id === id);
  
    if (task) {
        if (checkbox.checked) {
            task.completed = checkbox.checked;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderizarTareas();
            // Mostrar Toastify cuando la tarea se marca como realizada
            Toastify({
                text: "Has marcado la tarea como realizada",
                className: "success",
                duration: 2000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        } else {
            // Mostrar Toastify cuando la tarea se desmarca como pendiente
            Toastify({
                text: "Has marcado la tarea como pendiente",
                className: "warning",
                duration: 2000,
                gravity: "top",
                position: "right",
                style: {
                    background: "linear-gradient(to right, #ff5f6d, #ffc371)",
                }
            }).showToast();
        };
    };
};
  
renderizarTareas();
addTaskButton.addEventListener("click", (event) => {
    event.preventDefault(); // Evita que el formulario recargue la página
    addTasks();
});
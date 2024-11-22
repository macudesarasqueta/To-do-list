const inputTask = document.getElementById("inputTask");
const inputDay = document.getElementById("inputDay");
const inputTime = document.getElementById("inputTime");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const pendingTask = document.getElementById("pendingTask");

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const fetchTasks = async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await response.json();

        // Solo cargar las primeras 10 tareas para evitar demasiada información
        tasks.length = 0; // Vaciar la lista actual
        data.slice(0, 10).forEach(task => {
            tasks.push({
                id: task.id,
                inputDay: "Lunes", // JSONPlaceholder no tiene días específicos, puedes asignar uno por defecto
                infoTask: task.title.charAt(0).toUpperCase() + task.title.slice(1),
                inputTime: "12:00", // Puedes usar un valor por defecto
                completed: task.completed
            });
        });
        renderizarTareas();
    } catch (error) {
        console.error('Error al obtener tareas:', error);
    }
};

// Llamar esta función al iniciar
fetchTasks();


let nextId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

const daysOfWeek = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const renderizarTareas = () => {
    taskList.innerHTML = "";

    const completedTaskList = document.getElementById("completedTaskList");
    completedTaskList.innerHTML = "";

    tasks.sort((a, b) => {
        const dayDifference = daysOfWeek.indexOf(a.inputDay) - daysOfWeek.indexOf(b.inputDay);
        if (dayDifference === 0) {
            return a.inputTime.localeCompare(b.inputTime);
        }
        return dayDifference;
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
        if (task.inputTime){
            infoTask.innerHTML = `
            <strong>${task.inputDay} <i class="bi bi-arrow-right-circle-fill"></i> ${task.infoTask} <i class="bi bi-arrow-right-square-fill"></i> <em>${task.inputTime}</em> <i class="bi bi-clock-fill"></i></strong>
        `;
        } else {
            infoTask.innerHTML = `
            <strong>${task.inputDay} <i class="bi bi-arrow-right-circle-fill"></i> ${task.infoTask}</strong>
        `;
        } 

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
                confirmButtonColor: "#d33", 
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Eliminar"
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteTask(task.id); 
                    Toastify({
                        text: "Has eliminado la tarea",
                        className: "success",
                        duration: 1500,
                        position: "center",
                        style: {
                            background: "linear-gradient(to right, #00b09b, #96c93d)",
                        }
                    }).showToast();
                }
            });
        });

        //Añadir elementos al li
        itemTask.append(checkbox);
        itemTask.append(infoTask);
        itemTask.append(buttonDelete);
        
        if (task.completed) {
            completedTaskList.append(itemTask);
        } else {
            taskList.append(itemTask);
        }
    });

    const buttonDeleteEverything = document.createElement("button");
    buttonDeleteEverything.textContent = "Eliminar todo";
    buttonDeleteEverything.classList.add("btn", "btn-danger", "btn-md");
    buttonDeleteEverything.style.width = "auto";
    buttonDeleteEverything.addEventListener("click", (event) => {
        event.preventDefault();
        Swal.fire({
            title: "¿Estás seguro que quieres eliminar todas las tareas realizadas?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Eliminar todo",
        }).then((result) => {
            if (result.isConfirmed) {
                // Filtrar las tareas no completadas y reasignar al array tasks
                const remainingTasks = tasks.filter(task => !task.completed);
                tasks.length = 0;
                tasks.push(...remainingTasks); // Agregar solo las tareas no completadas
            
                // Actualizar el almacenamiento local y la interfaz
                localStorage.setItem("tasks", JSON.stringify(tasks));
                renderizarTareas();

                Toastify({
                    text: "Has eliminado todas las tareas realizadas",
                    className: "success",
                    duration: 1500,
                    position: "center",
                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
            }
        })
    });

    showPendingTask();
    completedTaskList.append(buttonDeleteEverything);
};

const addTasks = async () => {
    const name = inputTask.value.trim();
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    const day = inputDay.value.trim();
    const time = inputTime.value.trim();

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
        title: formattedName,
        completed: false
    };

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });
        const data = await response.json();

        tasks.push({
            id: data.id,
            inputDay: day,
            infoTask: formattedName,
            inputTime: time,
            completed: data.completed
        });
        renderizarTareas();
        inputDay.value = ""; // Limpiar el campo de selección después de agregar la tarea
        inputTask.value = ""; 
        inputTime.value = "";
    } catch (error) {
        console.error('Error al agregar tarea:', error);
    }
};

const deleteTask = async (id) => {
    try {
        await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, { method: 'DELETE' });
        const index = tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            tasks.splice(index, 1);
            renderizarTareas();
        }
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
    }
};
  
const showPendingTask = () => {
    const pendientes = tasks.filter((task) => !task.completed).length;
    pendingTask.textContent = `Tareas pendientes: ${pendientes}`;

    const completed = tasks.filter((task) => task.completed).length;
    
    const completedTaskHeader = document.getElementById("completedTask");
    completedTaskHeader.textContent = `Tareas realizadas: ${completed}`;
};
  
const markAsCompleted = async (checkbox, id) => {
    const task = tasks.find((task) => task.id === id);
  
    if (task) {
        task.completed = checkbox.checked;

        try {
            await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: task.completed })
            });
            renderizarTareas();
            
            Toastify({
                text: "Has marcado la tarea como realizada",
                className: "success",
                duration: 2000,
                gravity: "top",
                position: "right",
                style: {
                    background: task.completed
                        ? "linear-gradient(to right, #00b09b, #96c93d)"
                        : "linear-gradient(to right, #ff5f6d, #ffc371)"
                }
            }).showToast();
        } catch (error) {
            console.error('Error al actualizar tarea:', error);
        }
            
            // Toastify({
            //     text: "Has marcado la tarea como pendiente",
            //     className: "warning",
            //     duration: 2000,
            //     gravity: "top",
            //     position: "right",
            //     style: {
            //         background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            //     }
            // }).showToast();
    };
    renderizarTareas();
};

const deleteCompletedTasks = async () => {
    const completedTasks = tasks.filter(task => task.completed);

    try {
        await Promise.all(completedTasks.map(task =>
            fetch(`https://jsonplaceholder.typicode.com/todos/${task.id}`, { method: 'DELETE' })
        ));
        tasks = tasks.filter(task => !task.completed);
        renderizarTareas();
    } catch (error) {
        console.error('Error al eliminar tareas completadas:', error);
    }
};

  
renderizarTareas();
addTaskButton.addEventListener("click", (event) => {
    event.preventDefault(); // Evita que el formulario recargue la página
    addTasks();
});
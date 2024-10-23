alert("Bienvenido!! Aqui te ayudaremos a planificar tu semana");

const tareas = [];

function mostrarListaTareas(tareas) {
    listaTareas = "Lista de tareas:\n";
    tareas.forEach((tarea, index) => {
        listaTareas += `${index +1}. ${tarea.fecha} -> ${tarea.task}\n`;
    });
    alert(listaTareas);
}

function tareaNueva(tareas) {
    let tarea = prompt ("Indica la tarea que quieres agregar");
    while (tarea === null || tarea === "") {
        alert("No has escrito ninguna tarea, vuelve a intentarlo");
        tarea = prompt ("Indica la tarea que quieres agregar");
    }
    let dia = prompt("Indica cuando quieres realizar esa tarea: Lunes (L)/ Martes (M)/ Miercoles (X)/ Jueves (J)/ Viernes (V)/ Sabado (S)/ Domingo (D)/ Esta semana (ES)");
    while (true) {
        if (dia === "L" || dia === "l") {
            dia = "lunes";
            break ;
        }
        else if (dia === "M" || dia === "m") {
            dia = "martes";
            break ;
        }
        else if (dia === "X" || dia === "x") {
            dia = "miercoles";
            break ;
        }
        else if (dia === "J" || dia === "j") {
            dia = "jueves";
            break ;
        }
        else if (dia === "V" || dia === "v") {
            dia = "viernes";
            break ;
        }
        else if (dia === "S" || dia === "s") {
            dia = "sabado";
            break ;
        }
        else if (dia === "D" || dia === "d") {
            dia = "domingo";
            break ;
        }
        else {
            alert(`No has escrito un día existente`);
            dia = prompt("Indica cuando quieres realizar esa tarea: Lunes (L)/ Martes (M)/ Miercoles (X)/ Jueves (J)/ Viernes (V)/ Sabado (S)/ Domingo (D)");
        }
    }
    tareas.push({fecha: dia, task: tarea});
    alert(`Has agregado la tarea: ${tarea} para realizarla el dia ${dia}`);
    mostrarListaTareas(tareas);
    inicioListaTareas(tareas);
}

let listaTareas = "Lista de tareas:\nNinguna tarea agregada\n";

function inicioListaTareas(tareas) {
    let continuar = prompt(`${listaTareas}\nQuieres agregar tareas? Si/No`);
    if (continuar === "SI" || continuar === "si" || continuar === "SI")
        tareaNueva(tareas);
    else if (continuar === "No" || continuar === "no" || continuar === "NO") {
        let VerListaTareas = prompt("Quieres ver la lista de tareas? Si/No");
        if (VerListaTareas === "Si" || VerListaTareas === "si" || VerListaTareas === "SI")
            mostrarListaTareas(tareas);
        alert("Hasta pronto");
    }
    else {
        alert("Escribe Si o No para continuar");
        inicioListaTareas(tareas);
    }
}

inicioListaTareas(tareas);
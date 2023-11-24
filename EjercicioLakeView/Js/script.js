const cuerpo = document.querySelector("body");
const cabeza = document.querySelector("header");
const pie = document.querySelector("footer");
const listado = document.getElementById('listado');
const anadir = document.getElementById('anadir');
const modificar = document.getElementById('modificar');
const b1 = document.getElementById('B1');
const b2 = document.getElementById('B2');
const capaOcult = document.getElementById("capaOculta");

// Oculta todo el contenido de la página y cambia el fondo auna imagen.
function ocultarTodo(){
    b1.style.display = 'none';
    b2.style.display = 'block';
    pie.style.backgroundColor = "transparent";
    
    capaOcult.style.display = 'block';
}
// Actualiza la pagina para volver a mostrar todo el contenido ocultado.
function aparecerTodo(){
    b1.style.display = 'block';
    b2.style.display = 'none';
    pie.style.backgroundColor = "black";
    capaOcult.style.display = 'none';
}

// Boton para volver atras desde los formularios.
function volverAtras(){
    window.location.reload();
}

const  ArraySujetos = [];

class Sujeto{
    constructor(id, nombre, tipo, vivienda, fechaDesc, culpa, foto, comentarios){
        this.id = id;
        this.nombre = nombre;
        this.tipo = tipo;
        this.vivienda = vivienda;
        this.fechaDesc = fechaDesc;
        this.culpa = culpa;
        this.foto = foto;
        this.comentarios = comentarios;
    }
}

// Crea el sujeto "David Cjoak" solo si este no existe.
if (!localStorage.getItem('1')) {
    const David = new Sujeto("1", "David Choak", "Cargado", "Piso de Nathan Brown", "2003-09-22", "Delincuente", "https://th.bing.com/th/id/OIP.Fo4_E87tOQBlo9wkJXNu6gAAAA?rs=1&pid=ImgDetMain", "aa");
    const davidJSON = JSON.stringify(David);
    localStorage.setItem('1', davidJSON);
}

// Recorre el local storage y mete en el array todos los sujetos creados.
const localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach(key => {
    const sujetoFromStorage = JSON.parse(localStorage.getItem(key));
    ArraySujetos.push(sujetoFromStorage);
});

//Recorre el array sujetos y muestra estos en el listado.
function mostrarSujeto() {
    const sujetoList = document.getElementById("sujeto-list");
    
    sujetoList.innerHTML = '';

    ArraySujetos.forEach(sujeto => {
        const listItem = document.createElement("li");
        const button = document.createElement("button");
        //button.disabled = true;
        button.addEventListener("click", () => mostrarDatos(sujeto));
        
        const sujetoImage = document.createElement("img");
        // Agregar clase según el tipo
        if (sujeto.tipo === "Cargado") {
            sujetoImage.classList.add("descargado");
        } else {
            sujetoImage.classList.add("vivo");
        }
        if(sujeto.foto == ""){
            sujetoImage.src = "img/noImagen.jpeg";
            sujetoImage.alt = "sin imagen";
        } else{
            sujetoImage.src = sujeto.foto;
            sujetoImage.alt = sujeto.nombre;
        }
        sujetoImage.onerror = function() {
            sujetoImage.src = "img/noImagen.jpeg";
            sujetoImage.alt = "sin imagen";
        };

        const sujetoName = document.createElement("p");
        // Agregar clase según el tipo de culpa
        if (sujeto.culpa === "Cooperador") {
            sujetoName.classList.add("colaborador");
        } else if (sujeto.culpa === "Delincuente") {
            sujetoName.classList.add("perpetrador");
        } else {
            sujetoName.classList.add("posible-candidato");
        }
        sujetoName.textContent = sujeto.nombre;

        button.appendChild(sujetoImage);
        button.appendChild(sujetoName);
        listItem.appendChild(button);

        sujetoList.appendChild(listItem);
    });
}

// Oculta el listado y mustra el formulario para añadir
function activarAnadir(){
    Swal.fire({
        title: '¿Quieres añadir otro sujeto?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            listado.style.display = 'none';
            anadir.style.display = 'block';
            modificar.style.display = 'none';
        }
    });
}

// Carga los datos el el formulario modificar despues de seleccionar un sujeto.
function mostrarDatos(sujeto) {
    // Muestra el cuadro de diálogo de SweetAlert2
    Swal.fire({
        title: '¿Quieres modificar este sujeto?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            // Si el usuario hizo clic en "Sí", ejecuta la lógica de modificación
            listado.style.display = 'none';
            anadir.style.display = 'none';
            modificar.style.display = 'block';
            
            const id = document.getElementById("id");
            const nombre = document.getElementById("nom2");
            const tipo = document.getElementById("tipo2");
            const vivienda = document.getElementById("vivienda2");
            const tiempoDesc = document.getElementById("tiempoDesc2");
            const culpabilidad = document.getElementById("culpabilidad2");
            const imagen = document.getElementById("imagen2");
            const comentario = document.getElementById("comentario2");

            id.value = sujeto.id;
            nombre.value = sujeto.nombre;
            tipo.value = sujeto.tipo;
            vivienda.value = sujeto.vivienda;
            if(tipo.value === "Vivo"){
                tiempoDesc.value = "";
                tiempoDesc.disabled = true;
            } else tiempoDesc.value = sujeto.fechaDesc;
            culpabilidad.value = sujeto.culpa;
            imagen.value = sujeto.foto;
            comentario.value = sujeto.comentarios;
        }
    });
}

// Recoge los datos del formulario modificar y actualiza el sujeto en el local storage.
function modificarSuj(){
    if (!comprobarMod()) {return;}
    const id = document.getElementById("id").value;
    const nombre = document.getElementById("nom2").value;
    const tipo = document.getElementById("tipo2").value;
    const vivienda = document.getElementById("vivienda2").value;
    const tiempoDesc = document.getElementById("tiempoDesc2").value;
    const culpabilidad = document.getElementById("culpabilidad2").value;
    const imagen = document.getElementById("imagen2").value;
    const comentario = document.getElementById("comentario2").value;

        const sujetoMod = new Sujeto(id ,nombre, tipo, vivienda, tiempoDesc, culpabilidad, imagen, comentario);
        const sujetoModJSON = JSON.stringify(sujetoMod);
        localStorage.setItem(id , sujetoModJSON);

        document.querySelector('form').reset();
        Swal.fire({
            icon: "success", title: "Sujeto modificado"
        }).then(() => {
            window.location.reload();
        });
}

// Recorre las keys del localstorage y recoge la ultima.
function obtenerUltimoId() {
    const localStorageKeys = Object.keys(localStorage);
    if (localStorageKeys.length === 0) {
        return 0;
    }
    const ultimoId = Math.max(...localStorageKeys.map(Number));
    return ultimoId;
}

// Recoge los datos del formulario añadir y crea un nuevo sujeto.
function anadirSujeto(){
    if (!comprobarAnadir()) {return;}
    const nuevoId = obtenerUltimoId() + 1;
    const nombre = document.getElementById("nom").value;
    const tipo = document.getElementById("tipo").value;
    const vivienda = document.getElementById("vivienda").value;
    const tiempoDesc = document.getElementById("tiempoDesc").value;
    const culpabilidad = document.getElementById("culpabilidad").value;
    const imagen = document.getElementById("imagen").value;
    const comentario = document.getElementById("comentario").value;

    const nuevoSujeto = new Sujeto(nuevoId,nombre, tipo, vivienda, tiempoDesc, culpabilidad, imagen, comentario);
    const nuevoSujetoJSON = JSON.stringify(nuevoSujeto);
    localStorage.setItem(nuevoId, nuevoSujetoJSON);

    document.querySelector('form').reset();
    Swal.fire({
        icon: "success", title: "Sujeto añadido"
    }).then(() => {
        window.location.reload();
    });
    
}

// Comprueba los campos del formulario añadir.
function comprobarAnadir(){
    const nombre = document.getElementById("nom").value;
    const tipo = document.getElementById("tipo").value;
    const vivienda = document.getElementById("vivienda").value;
    const tiempoDesc = document.getElementById("tiempoDesc").value;
    const culpabilidad = document.getElementById("culpabilidad").value;
    const comentario = document.getElementById("comentario").value;

    if (nombre === "" || tipo === "Seleccione" || vivienda === "" || culpabilidad === "Seleccione" || comentario === "") {
        Swal.fire({
            icon: "error", title: "Campos Vacios", text: "Por favor, complete todos los campos."
        });
        return false;
    } else if(tipo === "Cargado" && tiempoDesc === ""){
        Swal.fire({
            icon: "error", title: "Campos Vacios", text: "Por favor, complete todos los campos."
        });
        return false;
    } else if(nombre.length > 15){
        Swal.fire({
            icon: "error", title: "Nombre incorrecto", text: "Solo se permiten 15 caracteres."
        });
        return false;
    } else if(/\d/.test(nombre)){
        Swal.fire({
            icon: "error", title: "Nombre incorrecto", text: "No se permiten números."
        });
        return false;
    }
    else return true;
    
}

// Comprueba los campos del formulario modificar
function comprobarMod(){
    const nombre = document.getElementById("nom2").value;
    const tipo = document.getElementById("tipo2").value;
    const vivienda = document.getElementById("vivienda2").value;
    const tiempoDesc = document.getElementById("tiempoDesc2").value;
    const culpabilidad = document.getElementById("culpabilidad2").value;
    const comentario = document.getElementById("comentario2").value;

    if (nombre === "" || tipo === "Seleccione" || vivienda === "" || culpabilidad === "Seleccione" || comentario === "") {
        Swal.fire({
            icon: "error", title: "Campos Vacios", text: "Por favor, complete todos los campos."
        });
        return false;
    } else if(tipo === "Cargado" && tiempoDesc === ""){
        Swal.fire({
            icon: "error", title: "Campos Vacios", text: "Por favor, complete todos los campos."
        });
        return false;
    } else if(nombre.length > 15){
        Swal.fire({
            icon: "error", title: "Nombre incorrecto", text: "Solo se permiten 15 caracteres."
        });
        return false;
    } else if(/\d/.test(nombre)){
        Swal.fire({
            icon: "error", title: "Nombre incorrecto", text: "No se permiten números."
        });
        return false;
    }
    else return true;
}

// Segun si a seleccionado que es Vivo o no se deshabilita o habilita el campo fechaDesc.
function actualizartiempoDesc() {
    var tipoSelect = document.getElementById("tipo");
    var tipoSelect2 = document.getElementById("tipo2");
    var fechaDesc = document.getElementById("tiempoDesc");
    var fechaDesc2 = document.getElementById("tiempoDesc2");

    var tipoSeleccionado = tipoSelect.value;
    var tipoSeleccionado2 = tipoSelect2.value;
    fechaDesc.disabled = (tipoSeleccionado === "Vivo");
    fechaDesc2.disabled = (tipoSeleccionado2 === "Vivo");
    fechaDesc.value = "";
    fechaDesc2.value = "";
}
document.getElementById("tipo").addEventListener("change", actualizartiempoDesc);
document.getElementById("tipo2").addEventListener("change", actualizartiempoDesc);


document.addEventListener("DOMContentLoaded", function() {
    mostrarSujeto();
});
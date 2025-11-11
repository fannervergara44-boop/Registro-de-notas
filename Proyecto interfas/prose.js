// Variable que almacena la clave única para LocalStorage
const STORAGE_KEY = 'notasApp:notasUsuarios'; 

// Array para almacenar todas las notas. Se inicializará con los datos de LocalStorage.
let notasUsuarios = [];

// Obtener referencias a los elementos del DOM (HTML)
const formulario = document.getElementById('nota-form');
const listaNotasUL = document.getElementById('lista-notas');

// =======================================================
// === 1. PERSISTENCIA DE DATOS (LOCALSTORAGE) ===========
// =======================================================

/**
 * Guarda el array notasUsuarios en LocalStorage, serializándolo a JSON.
 */
function guardarNotas() {
    const notasJSON = JSON.stringify(notasUsuarios);
    localStorage.setItem(STORAGE_KEY, notasJSON);
}

/**
 * Carga las notas desde LocalStorage al iniciar la aplicación.
 */
function cargarNotas() {
    const notasJSON = localStorage.getItem(STORAGE_KEY);
    
    if (notasJSON) {
        // Convierte la cadena JSON de vuelta a un array de JavaScript
        notasUsuarios = JSON.parse(notasJSON);
    } else {
        notasUsuarios = [];
    }
}

// =======================================================
// === 2. VALIDACIÓN Y BORRADO DE NOTAS ==================
// =======================================================

/**
 * Función que se llama con 'oninput' para validar que solo haya letras y espacios.
 * @param {HTMLInputElement} input - El campo de entrada de texto.
 */
function validarNombre(input) {
    // RegEx: Busca cualquier cosa que NO sea (^) letra, acento o espacio (\s).
    const patronSoloLetras = /[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/g;

    // Reemplaza los caracteres no permitidos con una cadena vacía ('')
    input.value = input.value.replace(patronSoloLetras, '');
}

/**
 * Elimina una nota del array, actualiza LocalStorage y la interfaz.
 * Esta función es llamada por el botón 'X' en cada elemento de la lista.
 * @param {number} index - El índice (posición) de la nota a eliminar.
 */
function eliminarNota(index) {
    // 1. Usa splice para quitar 1 elemento desde la posición 'index'
    notasUsuarios.splice(index, 1); 

    // 2. Guarda el array actualizado en LocalStorage
    guardarNotas(); 

    // 3. Vuelve a dibujar la lista en el HTML
    renderizarNotas();
}

// =======================================================
// === 3. RENDERIZADO (DIBUJO EN HTML) ===================
// =======================================================

function renderizarNotas() {
    // Limpiar el contenido anterior
    listaNotasUL.innerHTML = ''; 

    if (notasUsuarios.length === 0) {
        listaNotasUL.innerHTML = '<li style="text-align: center; color: #6b7280;">Aún no hay notas registradas.</li>';
        return;
    }

    // Usar 'index' en el forEach es VITAL para el botón de borrado
    notasUsuarios.forEach((nota, index) => {
        const listItem = document.createElement('li');
        
        // Estilos para Aprobado/Reprobado
        let notaClass = (nota.nota < 3.0) ? 
            'background-color: #fee2e2; border-left: 5px solid #ef4444;' :
            'background-color: #ecfdf5; border-left: 5px solid #10b981;';

        listItem.style = notaClass;
        
        // Plantilla HTML con el botón de borrado:
        // El 'onclick' llama a eliminarNota, pasando el índice de la nota actual.
        listItem.innerHTML = `
            <div>
                <strong>[${nota.documento}] ${nota.nombre}</strong> 
            </div>
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="nota-valor">
                    Nota: ${nota.nota.toFixed(2)} 
                </div>
                <button class="boton-eliminar" onclick="eliminarNota(${index})">
                    X 
                </button>
            </div>
        `;
        
        listaNotasUL.appendChild(listItem);
    });
}

// =======================================================
// === 4. MANEJO DEL FORMULARIO ==========================
// =======================================================

function manejarEnvioFormulario(event) {
    // Previene la recarga de la página
    event.preventDefault(); 

    // Captura de valores (la nota se convierte a número decimal)
    const documento = document.getElementById('documento').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const nota = parseFloat(document.getElementById('nota').value); 

    // Validaciones finales
    if (!documento || !nombre || isNaN(nota) || nota < 0 || nota > 5) {
        alert("Por favor, revisa que todos los campos sean correctos.");
        return;
    }

    // Objeto con la nueva nota
    const nuevaNota = {
        documento: documento,
        nombre: nombre,
        nota: parseFloat(nota.toFixed(2)) 
    };

    // Agregar y guardar
    notasUsuarios.push(nuevaNota);
    guardarNotas(); 

    // Actualizar interfaz y limpiar
    renderizarNotas();
    formulario.reset();
}

// =======================================================
// === 5. INICIALIZACIÓN DE LA APLICACIÓN ================
// =======================================================

// 1. Cargar las notas al inicio (si hay datos guardados)
cargarNotas();

// 2. Escuchar el evento 'submit' (envío del formulario)
formulario.addEventListener('submit', manejarEnvioFormulario);

// 3. Renderizar la lista inicial (muestra las notas cargadas)
renderizarNotas();
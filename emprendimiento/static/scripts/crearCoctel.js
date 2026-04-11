let seleccion = {
    base: null,
    mixer: null,
    sabor: null,
    adornos: null,
    tamano: null
};

const coloresLiquido = {
    "Concentrado Piña": "linear-gradient(to bottom, #f9d423, #ff4e50)",
    "Concentrado Frutilla": "linear-gradient(to bottom, #ff4e50, #e100ff)",
    "Sin Sabor Extra": "linear-gradient(to bottom, #56ab2f, #a8e063)"
};

const estadosMezcla = [
    "Añadiendo Base...",
    "Incorporando Sabor...",
    "Agitando con Hielo...",
    "¡Casi listo!",
    "¡Perfecto!"
];

const nombresPro = [
    "Sunset", "Rush", "Tropical", "Flow", "Wave", "Gold", "Fuego"
];

// =======================
// WIZARD LOGIC
// =======================
let currentStep = 0;
const totalSteps = 5;
const stepKeys = ['base', 'mixer', 'sabor', 'adornos', 'tamano'];

function updateWizard() {
    document.querySelectorAll('.wizard-step').forEach((step, index) => {
        if (index === currentStep) {
            step.classList.remove('d-none');
        } else {
            step.classList.add('d-none');
        }
    });

    const percentage = ((currentStep + 1) / totalSteps) * 100;
    document.getElementById('progress-fill').style.width = `${percentage}%`;
    document.getElementById('step-indicator').textContent = `Paso ${currentStep + 1} de ${totalSteps}`;

    const btnAtras = document.getElementById('btn-atras');
    const btnSiguiente = document.getElementById('btn-siguiente');
    const btnGenerar = document.getElementById('generar');

    if (currentStep === 0) btnAtras.classList.add('d-none');
    else btnAtras.classList.remove('d-none');

    if (currentStep === totalSteps - 1) {
        btnSiguiente.classList.add('d-none');
        btnGenerar.classList.remove('d-none');
    } else {
        btnSiguiente.classList.remove('d-none');
        btnGenerar.classList.add('d-none');
    }

    checkStepValidation();
}

function checkStepValidation() {
    const currentKey = stepKeys[currentStep];
    const btnSiguiente = document.getElementById('btn-siguiente');
    const btnGenerar = document.getElementById('generar');

    if (seleccion[currentKey]) {
        btnSiguiente.disabled = false;
        btnSiguiente.style.opacity = "1";
        btnGenerar.disabled = false;
        btnGenerar.style.opacity = "1";
    } else {
        btnSiguiente.disabled = true;
        btnSiguiente.style.opacity = "0.4";
        btnGenerar.disabled = true;
        btnGenerar.style.opacity = "0.4";
    }
}

document.getElementById('btn-siguiente').addEventListener('click', () => {
    if (currentStep < totalSteps - 1) {
        currentStep++;
        updateWizard();
    }
});

document.getElementById('btn-atras').addEventListener('click', () => {
    if (currentStep > 0) {
        currentStep--;
        updateWizard();
    }
});

function updateSummary() {
    const sumBox = document.getElementById('live-summary');
    const sumText = document.getElementById('summary-text');
    let parts = [];
    if(seleccion.base) parts.push(seleccion.base);
    if(seleccion.mixer) parts.push('+ ' + seleccion.mixer);
    if(seleccion.sabor && seleccion.sabor !== "Sin Sabor Extra") parts.push('+ ' + seleccion.sabor);
    if(seleccion.adornos && seleccion.adornos !== "Sin Adornos") parts.push('+ ' + seleccion.adornos);
    if(seleccion.tamano) parts.push(`(${seleccion.tamano}cc)`);

    if(parts.length > 0) {
        sumBox.classList.remove('d-none');
        sumText.textContent = parts.join(" ");
    } else {
        sumBox.classList.add('d-none');
    }
}

const nombre = `${seleccion.base} ${nombresPro[Math.floor(Math.random() * nombresPro.length)]}`;

const opcionesSabor = {
    "Frutal": ["Mango", "Frambuesa"],
    "Dulce": ["Azúcar", "Jarabe"],
    "Cítrico": ["Limón", "Naranja"]
};

// CLICK OPCIONES (CARDS)
document.querySelectorAll(".opcion-card").forEach(op => {
    op.addEventListener("click", () => {
        const grupo = op.closest(".opciones");

        grupo.querySelectorAll(".opcion-card").forEach(o => o.classList.remove("activa"));
        op.classList.add("activa");

        const tipo = grupo.dataset.grupo;
        if (!tipo) return; 

        seleccion[tipo] = op.dataset.value;
        checkStepValidation();
        updateSummary();
    });
});


// BOTÓN GENERAR
document.getElementById("generar").addEventListener("click", function () {
    // (La validación ya está cubierta por el flujo del Wizard)

    const modalContenido = document.querySelector(".modal-contenido");
    const formCoctel = document.getElementById("form-coctel"); // Necesitamos envolver el form en el HTML
    const mixingArea = document.getElementById("mixing-area");
    const liquid = document.getElementById("liquid");
    const shaker = document.getElementById("shaker");
    const statusText = document.getElementById("mixing-status");
    const resultado = document.getElementById("resultado");

    // 1. Iniciar Estado: Ocultar form, mostrar zona de mezcla, resetear líquido
    formCoctel.classList.add("hidden-step");
    resultado.classList.add("d-none"); // Asegurar que el resultado anterior no se vea
    mixingArea.classList.remove("d-none");
    this.classList.add("d-none"); // Ocultar botón generar
    liquid.style.height = "0";
    liquid.style.background = coloresLiquido[seleccion.sabor] || coloresLiquido["Sin Sabor Extra"];
    statusText.textContent = estadosMezcla[0];


    // --- LINEA DE TIEMPO DE ANIMACIÓN (Promesas o setTimeout) ---

    // PASO 1: Llenado (0s - 1s)
    setTimeout(() => {
        liquid.style.height = "80%"; // El vaso se llena
        statusText.textContent = estadosMezcla[1];
    }, 100);

    // PASO 2: Empezar a agitar y crear partículas (1s - 3s)
    setTimeout(() => {
        statusText.textContent = estadosMezcla[2];
        shaker.classList.add("shaking");
        crearParticulas(); // Función auxiliar
    }, 1100);

    // PASO 3: Detener agitación y preparar revelación (3s - 3.8s)
    setTimeout(() => {
        shaker.classList.remove("shaking");
        statusText.textContent = estadosMezcla[3];
        liquid.style.height = "95%"; // Sube un poco más por la espuma
    }, 3100);

    // PASO 4: ¡EL GRAN FINAL! Revelar resultado (3.8s)
    setTimeout(() => {
        // Sonido opcional (descomentar si tienes un archivo de sonido corto)
        // new Audio('path/to/magic-sparkle.mp3').play();

        // Trigger Destello visual
        triggerBurst();

        statusText.textContent = estadosMezcla[4];

        // Procesar la lógica del cóctel (tu código original)
        finalizarCreacionCoctel();

    }, 3800);
});

function crearParticulas() {
    const contenedor = document.getElementById("particles-container");
    if (!contenedor) return;

    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const p = document.createElement("div");
            p.classList.add("particle");

            // Tamaño aleatorio
            const size = Math.random() * 8 + 4 + "px";
            p.style.width = size;
            p.style.height = size;

            // Posición X aleatoria dentro del shaker
            p.style.left = Math.random() * 60 + 10 + "px";
            p.style.bottom = "20px";

            // Color aleatorio (blanco o amarillo muy claro)
            p.style.background = Math.random() > 0.5 ? "rgba(255,255,255,0.8)" : "rgba(245, 197, 66, 0.5)";

            // Animación CSS
            p.style.animation = `particle-float ${Math.random() * 1 + 0.5}s ease-out forwards`;

            contenedor.appendChild(p);

            // Limpiar DOM
            setTimeout(() => p.remove(), 1500);
        }, i * 100); // Salen una tras otra
    }
}

function triggerBurst() {
    const shaker = document.getElementById("shaker");
    const burst = document.createElement("div");
    burst.classList.add("confetti-burst");

    // Color principal del cóctel para el destello
    const color = liquid.style.background.includes("ff4e50") ? "#ff4e50" : (liquid.style.background.includes("56ab2f") ? "#56ab2f" : "#e100ff");
    burst.style.background = `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0) 70%)`;

    shaker.appendChild(burst);
    burst.classList.add("animate-burst");

    setTimeout(() => burst.remove(), 700);
}

function finalizarCreacionCoctel() {
    const nombreCoctel = `Slymesh ${nombresPro[Math.floor(Math.random() * nombresPro.length)]}`;

    const descripcion = `
    Cóctel base ${seleccion.base}, mezclado con ${seleccion.mixer.toLowerCase()}, toque de ${seleccion.sabor.toLowerCase()} y de detalle: ${seleccion.adornos.toLowerCase()}.
    `.replace(/\s+/g, " ");

    // 💰 PRECIO BASADO EN EL NUEVO ESTÁNDAR
    let precio = (seleccion.tamano === "1000") ? 11000 : 8000;

    const coctelPersonalizado = {
        id: `custom-${Date.now()}`,
        nombre: `🍸 ${nombreCoctel}`,
        precio: precio,
        tipo: `Base: ${seleccion.base} | Mezclador: ${seleccion.mixer} | Toque: ${seleccion.sabor} | Extras: ${seleccion.adornos} | Tamaño: ${seleccion.tamano}cc`,
        cantidad: 1
    };

    // Asumimos que esta función existe en tu base.html o globalmente
    if (typeof agregarAlCarrito === 'function') {
        agregarAlCarrito(coctelPersonalizado);
    } else {
        console.log("agregarAlCarrito no definida, coctel:", coctelPersonalizado);
    }


    // Actualizar UI de resultado
    document.getElementById("resultado").classList.remove("d-none");
    document.getElementById("nombre").textContent = coctelPersonalizado.nombre;
    document.getElementById("descripcion").textContent = descripcion;
    document.getElementById("precio").textContent = `$${precio}`;

    // Mostrar Toast Épico
    mostrarToast();

}

// TOAST
function mostrarToast() {
    const toast = document.getElementById("toast");
    if (!toast) return;

    // Reiniciar en caso de que ya se esté mostrando
    toast.classList.remove("d-none", "show");

    // Forzar reflow
    void toast.offsetWidth;

    toast.classList.remove("d-none");
    setTimeout(() => toast.classList.add("show"), 50);

    // Tiempo de espera antes de ocultar
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.classList.add("d-none"), 500);
    }, 3500);
}

function cerrarYResetearModal() {
    const modal = document.getElementById("modal-coctel");
    const formCoctel = document.getElementById("form-coctel");
    const mixingArea = document.getElementById("mixing-area");
    const btnGenerar = document.getElementById("generar");
    const resultado = document.getElementById("resultado");

    modal.classList.add("d-none");

    // Volver a mostrar el formulario y ocultar animaciones/resultados para la próxima vez
    setTimeout(() => {
        formCoctel.classList.remove("hidden-step");
        mixingArea.classList.add("d-none");
        btnGenerar.classList.remove("d-none");
        resultado.classList.add("d-none");

        // Reset completo del Wizard
        seleccion = { base: null, mixer: null, sabor: null, adornos: null, tamano: null };
        document.querySelectorAll('.opcion-card.activa').forEach(o => o.classList.remove('activa'));
        currentStep = 0;
        updateWizard();
        updateSummary();
    }, 500); // Esperar a que el modal se oculte visualmente
}

// MODAL EVENTOS
document.getElementById("abrir-modal").onclick = () => {
    document.getElementById("modal-coctel").classList.remove("d-none");
    updateWizard();
    updateSummary();
}

document.getElementById("cerrar-modal").onclick = cerrarYResetearModal;

document.querySelector(".modal-overlay").onclick = cerrarYResetearModal;

// BOTÓN IR AL CARRITO (Desde Resultado)
document.getElementById("btn-ir-al-carrito").onclick = () => {
    // 1. Cerrar y resetear modal de coctel
    cerrarYResetearModal();
    // 2. Abrir el modal del carrito (usando el toggle o clase hidden)
    const carritoModal = document.getElementById("carrito-modal");
    if (carritoModal) {
        carritoModal.classList.remove("hidden");
    }
}

function compartirInstagram() {
    // 1. Extraemos los datos actuales del cóctel creado
    const nombreCoctel = document.getElementById("nombre").textContent;
    const precioCoctel = document.getElementById("precio").textContent;

    // 2. Creamos un mensaje más personalizado y atractivo
    const textoCompartir = `✨ ¡Acabo de crear mi propio cóctel en Slymesh! 🍸\n\n` +
        `Nombre: ${nombreCoctel}\n` +
        `Precio: ${precioCoctel}\n\n` +
        `¡Ven a crear el tuyo! 🔥 #Slymesh #Mixology #CocktailTime`;

    // 3. Intentamos usar la API nativa de compartir (Funciona en móviles)
    if (navigator.share) {
        navigator.share({
            title: 'Mi Cóctel Personalizado',
            text: textoCompartir,
            url: window.location.href // Opcional: link a tu web
        })
            .then(() => console.log('Compartido con éxito'))
            .catch((error) => console.log('Error al compartir', error));
    } else {
        // 4. Fallback: Si está en PC, copiamos al portapapeles como ya hacías
        navigator.clipboard.writeText(textoCompartir).then(() => {
            // Usamos un alert más bonito o tu Toast
            alert("🚀 ¡Texto optimizado copiado! Pégalo en tu Story de Instagram.");
        });
    }
}
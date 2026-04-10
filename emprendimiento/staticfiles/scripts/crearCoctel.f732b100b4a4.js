let seleccion = {
    base: null,
    sabor: null,
    tamano: null,
    estilo: null,
    dulzor: null
};

const preciosBase = {
    "Ron": 4000,
    "Pisco": 4500,
    "Cachaza": 5000
};

const coloresLiquido = {
    "Frutal": "linear-gradient(to bottom, #ff4e50, #f9d423)", // Rojo-Naranja
    "Cítrico": "linear-gradient(to bottom, #56ab2f, #a8e063)", // Verde
    "Dulce": "linear-gradient(to bottom, #e100ff, #7f00ff)"   // Rosa-Morado
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

const nombre = `${seleccion.base} ${nombresPro[Math.floor(Math.random() * nombresPro.length)]}`;

const opcionesSabor = {
    "Frutal": ["Mango", "Frambuesa"],
    "Dulce": ["Azúcar", "Jarabe"],
    "Cítrico": ["Limón", "Naranja"]
};

// CLICK OPCIONES
document.querySelectorAll(".opcion").forEach(op => {
    op.addEventListener("click", () => {
        const grupo = op.parentElement;

        grupo.querySelectorAll(".opcion").forEach(o => o.classList.remove("activa"));
        op.classList.add("activa");

        // Soporte para ID o data-grupo
        const tipo = grupo.id || grupo.dataset.grupo;
        if (!tipo) return; // Seguridad

        seleccion[tipo] = op.dataset.value;

        if (tipo === "sabor") {
            cargarIngredientes(op.dataset.value);
        }
    });
});

// INGREDIENTES
function cargarIngredientes(sabor) {
    const select = document.getElementById("ingrediente");
    const contenedor = document.getElementById("detalle-sabor");

    if (!select || !contenedor) return;

    select.innerHTML = "";

    const opcionesSabor = {
        "Frutal": ["Mango", "Frambuesa"],
        "Dulce": ["Azúcar", "Jarabe"],
        "Cítrico": ["Limón", "Naranja"]
    };

    if (opcionesSabor[sabor]) {
        opcionesSabor[sabor].forEach(i => {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = i;
            select.appendChild(opt);
        });
        contenedor.classList.remove("d-none");
    } else {
        contenedor.classList.add("d-none");
    }
}

// BOTÓN GENERAR
document.getElementById("generar").addEventListener("click", function () {

    // VALIDACIÓN PREVIA
    if (!seleccion.base || !seleccion.sabor || !seleccion.tamano) {
        alert("Por favor, completa Base, Sabor y Tamaño para crear tu obra maestra.");
        // Un pequeño shake de error en el botón
        this.classList.add("shake");
        setTimeout(() => this.classList.remove("shake"), 500);
        return;
    }

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
    liquid.style.background = coloresLiquido[seleccion.sabor] || coloresLiquido["Frutal"];
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
    const ingredienteExtra = document.getElementById("ingrediente")?.value || "Mix especial";
    const nombreCoctel = `Slymesh ${seleccion.base} ${nombresPro[Math.floor(Math.random() * nombresPro.length)]}`;

    const descripcion = `
    Cóctel ${seleccion.sabor.toLowerCase()} con base de ${seleccion.base}
    , estilo ${seleccion.estilo || "refrescante"}
    y nivel de dulzor ${seleccion.dulzor || "medio"}.
    `.replace(/\s+/g, " ");

    // 💰 PRECIO BIEN CALCULADO
    let precio = preciosBase[seleccion.base] || 4000;

    if (seleccion.tamano === "1000") {
        precio += 3500;
    }
    if (seleccion.estilo === "Frozen") {
        precio += 1000;
    } else if (seleccion.estilo === "Frappé") {
        precio += 500; // Por el trabajo de picar el hielo
    }

    if (seleccion.dulzor === "Alto") {
        precio += 500;
    }
    const coctelPersonalizado = {
        id: `custom-${Date.now()}`,
        nombre: `🍸 ${nombreCoctel}`,
        precio: precio,
        tipo: `${seleccion.sabor} | ${seleccion.estilo || "Refrescante"} | ${seleccion.dulzor || "Medio"}`,
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

        // Opcional: Resetear selecciones
        // seleccion = { base: null, sabor: null, ... };
        // document.querySelectorAll('.opcion.activa').forEach(o => o.classList.remove('activa'));
    }, 500); // Esperar a que el modal se oculte visualmente
}

// MODAL EVENTOS
document.getElementById("abrir-modal").onclick = () => {
    document.getElementById("modal-coctel").classList.remove("d-none");
}

document.getElementById("cerrar-modal").onclick = cerrarYResetearModal;

document.querySelector(".modal-overlay").onclick = cerrarYResetearModal;

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
/********************************************************
 * SIDEBAR
 ********************************************************/
document.addEventListener("DOMContentLoaded", () => {

    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggle-btn");
    const toggleIcon = document.getElementById("toggle-icon");
    const mobileToggle = document.getElementById("mobile-toggle");

    // Función centralizada (solo mobile)
    const cerrarSidebarMobile = () => {
        sidebar.classList.remove("active");
        mobileToggle.classList.remove("hidden");
    };

    /* ---------- DESKTOP ---------- */
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {

            // Desktop
            if (window.innerWidth > 768) {
                sidebar.classList.toggle("collapsed");

                if (toggleIcon) {
                    toggleIcon.classList.toggle("fa-chevron-left");
                    toggleIcon.classList.toggle("fa-chevron-right");
                }
            }
            // Mobile → cerrar sidebar
            else {
                cerrarSidebarMobile();
            }
        });
    }

    /* ---------- MOBILE ---------- */
    if (mobileToggle) {
        mobileToggle.addEventListener("click", (e) => {
            e.stopPropagation();

            sidebar.classList.add("active");
            mobileToggle.classList.add("hidden"); // 🔥 ocultar hamburguesa
        });
    }

    /* ---------- CLICK FUERA (MOBILE) ---------- */
    document.addEventListener("click", (e) => {
        if (
            window.innerWidth <= 768 &&
            sidebar.classList.contains("active") &&
            !sidebar.contains(e.target) &&
            !mobileToggle.contains(e.target)
        ) {
            cerrarSidebarMobile();
        }
    });

    /* ---------- SUBMENU CONTACTO ---------- */
    const contactToggle = document.getElementById("contactToggle");
    const contactMenu = document.getElementById("contactMenu");

    if (contactToggle && contactMenu) {
        contactToggle.addEventListener("click", () => {
            contactMenu.classList.toggle("open");
        });
    }
});


/********************************************************
 * CARRITO (PERSISTENTE)
 ********************************************************/
const STORAGE_KEY = "slymesh_carrito";
let carrito = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// ELEMENTOS
const carritoBtn = document.getElementById("btn-carrito");
const carritoModal = document.getElementById("carrito-modal");
const cerrarCarritoBtn = document.getElementById("cerrar-carrito");
const carritoItems = document.getElementById("carrito-items");
const carritoTotal = document.getElementById("carrito-total");
const carritoCount = document.getElementById("carrito-count");

// ABRIR / CERRAR CARRITO
if (carritoBtn && carritoModal) {
    carritoBtn.addEventListener("click", () => {
        carritoModal.classList.toggle("hidden");
    });
}

if (cerrarCarritoBtn) {
    cerrarCarritoBtn.addEventListener("click", () => {
        carritoModal.classList.add("hidden");
    });
}

// AGREGAR PRODUCTOS
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart");
    if (!btn) return;

    const contenedor = btn.closest(".product-card") || btn.parentElement;
    const cantidadInput = contenedor.querySelector(".quantity-input");
    const cantidad = cantidadInput ? parseInt(cantidadInput.value, 10) : 1;

    // VALIDACIÓN REAL
    if (isNaN(cantidad) || cantidad < 1) {
        Swal.fire({
            icon: "error",
            title: "Cantidad inválida",
            text: "Debes agregar al menos 1 unidad.",
            confirmButtonColor: "#d4af37"
        });
        return;
    } else if (cantidad >= 1) {
        Swal.fire({
            title: "Añadido Correctamente!",
            icon: "success",
            draggable: true
        });
    }

    const producto = {
        id: btn.dataset.id,
        nombre: btn.dataset.nombre,
        precio: parseInt(btn.dataset.precio, 10),
        tipo: btn.dataset.tipo || "Normal",
        cantidad: cantidad
    };

    agregarAlCarrito(producto);
});


// LÓGICA
function agregarAlCarrito(producto) {
    const existente = carrito.find(
        p => p.id === producto.id && p.tipo === producto.tipo
    );

    if (existente) {
        existente.cantidad += producto.cantidad;
    } else {
        carrito.push(producto);
    }

    persistirCarrito();
    actualizarCarrito();
}

function cambiarCantidad(id, tipo, cambio) {
    const item = carrito.find(p => p.id === id && p.tipo === tipo);
    if (!item) return;

    item.cantidad += cambio;

    if (item.cantidad <= 0) {
        carrito = carrito.filter(p => !(p.id === id && p.tipo === tipo));
    }

    persistirCarrito();
    actualizarCarrito();
}

// RENDER
function actualizarCarrito() {
    if (!carritoItems) return;

    carritoItems.innerHTML = "";

    let total = 0;
    let cantidadTotal = 0;

    carrito.forEach(item => {
        total += item.precio * item.cantidad;
        cantidadTotal += item.cantidad;

        const div = document.createElement("div");
        div.classList.add("carrito-item");

        div.innerHTML = `
            <div>
                <strong>${item.nombre}</strong>
                <small style="opacity:0.7">${item.tipo}</small><br>
                $${item.precio} x ${item.cantidad}
            </div>
            <div class="carrito-actions">
                <button onclick="cambiarCantidad('${item.id}', '${item.tipo}', -1)">−</button>
                <button onclick="cambiarCantidad('${item.id}', '${item.tipo}', 1)">+</button>
            </div>
        `;

        carritoItems.appendChild(div);
    });

    if (carritoTotal) carritoTotal.textContent = total;
    if (carritoCount) carritoCount.textContent = cantidadTotal;
}

// STORAGE
function persistirCarrito() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
}

// WHATSAPP
const btnWhatsapp = document.getElementById("btn-whatsapp");

if (btnWhatsapp) {
    btnWhatsapp.addEventListener("click", () => {

        // Estética Slymesh para las alertas
        const alertConfig = {
            background: '#1a1a1a',
            color: '#ffffff',
            confirmButtonColor: '#c5a059',
            customClass: { popup: 'border-gold-alert' }
        };

        // 1. Captura y Limpieza
        const nombre = document.getElementById("nombreCliente")?.value.trim() || "";
        const telefono = document.getElementById("telefonoCliente")?.value.trim() || "";
        const direccion = document.getElementById("direccionCliente")?.value.trim() || "";
        const metodoPago = document.getElementById("metodoPagoCliente")?.value || "";

        // --- VALIDACIONES ESPECÍFICAS ---

        // A. Validación de Nombre (Mínimo 2 palabras, solo letras)
        const nombreRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{3,50}$/;
        if (!nombreRegex.test(nombre)) {
            Swal.fire({
                ...alertConfig,
                icon: "error",
                title: "NOMBRE INVÁLIDO",
                text: "Por favor, ingresa un nombre real (solo letras)."
            });
            return;
        }

        // B. Validación Teléfono Chileno
        // Formatos válidos: 912345678 o +56912345678
        const telRegex = /^(\+?56)?\s?9\s?\d{4}\s?\d{4}$/;
        if (!telRegex.test(telefono.replace(/\s/g, ""))) {
            Swal.fire({
                ...alertConfig,
                icon: "error",
                title: "TELÉFONO INVÁLIDO",
                text: "Ingresa un número chileno válido (Ej: 9 1234 5678)."
            });
            return;
        }

        // C. Validación de Dirección (Mínimo 5 caracteres, que incluya letras y números)
        if (direccion.length < 5 || !/\d/.test(direccion)) {
            Swal.fire({
                ...alertConfig,
                icon: "error",
                title: "DIRECCIÓN INCOMPLETA",
                text: "Asegúrate de incluir el número de casa o departamento."
            });
            return;
        }

        // D. Validación del Método de Pago
        if (!metodoPago) {
            Swal.fire({
                ...alertConfig,
                icon: "error",
                title: "MÉTODO DE PAGO REQUERIDO",
                text: "Por favor, selecciona cómo deseas pagar."
            });
            return;
        }

        // 2. Si pasa todo, construir mensaje
        if (carrito.length === 0) {
            Swal.fire({ ...alertConfig, icon: "warning", title: "CARRITO VACÍO" });
            return;
        }

        let productosTexto = "";
        let totalPedido = 0;
        carrito.forEach(item => {
            const sub = item.precio * item.cantidad;
            totalPedido += sub;
            productosTexto += `• ${item.nombre} ${item.tipo !== 'Normal' ? `(${item.tipo}) ` : ''}x${item.cantidad} - $${sub}\n`;
        });

        const mensaje = encodeURIComponent(
            `🍸 *NUEVO PEDIDO - SLYMESH*

👤 *Cliente:* ${nombre}
📱 *Teléfono:* ${telefono}
📍 *Dirección:* ${direccion}
💳 *Pago:* ${metodoPago}

---
${productosTexto}---
💰 *TOTAL: $${totalPedido}*`
        );

        Swal.fire({
            ...alertConfig,
            icon: "success",
            title: "¡DATOS VERIFICADOS!",
            text: "Te estamos redirigiendo a WhatsApp para confirmar tu pedido...",
            iconColor: '#c5a059',
            showConfirmButton: false,
            timer: 2500, // 2.5 segundos de cortesía
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
            willClose: () => {
                // Abrir WhatsApp justo al cerrar la alerta
                window.open(`https://wa.me/56987829955?text=${mensaje}`, "_blank");
            }
        });
    });
}

// INIT
actualizarCarrito();
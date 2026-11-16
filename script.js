/**
 * EDILGASS - Lógica interactiva de la Landing Page
 * Enfoque: Atención 100% Directa por el Técnico Titular
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Actualizar año en el pie de página dinámicamente
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }

    // 2. Control del Menú Móvil
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Cerrar menú móvil al hacer click en cualquier enlace
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // 3. Efecto de sombra al hacer scroll en el Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('shadow-md');
        } else {
            header.classList.remove('shadow-md');
        }
    });
});

/**
 * Función para preseleccionar un servicio desde las tarjetas y llevar al formulario
 * @param {string} serviceName - Nombre del servicio a preseleccionar
 */
function prefillQuote(serviceName) {
    const serviceSelect = document.getElementById('servicio');
    const quoteSection = document.getElementById('cotizacion');

    if (serviceSelect) {
        serviceSelect.value = serviceName;
    }

    if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Maneja el envío del formulario de cotización por correo electrónico directo al técnico
 */
function handleQuoteSubmit(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const ubicacion = document.getElementById('ubicacion').value.trim() || 'No especificada';
    const servicio = document.getElementById('servicio').value;
    const inmueble = document.getElementById('inmueble').value;
    const detalles = document.getElementById('detalles').value.trim();

    if (!nombre || !correo || !telefono || !servicio || !detalles) {
        alert('Por favor completa todos los campos requeridos (*).');
        return;
    }

    // Correo oficial directo del técnico titular de EDILGASS
    const emailDestino = 'edilbertogomezia@hotmail.com';
    const asunto = `[Cotización EDILGASS] - ${servicio} - ${nombre}`;

    // Construcción del mensaje para el técnico
    const cuerpo = `Hola EDILGASS,

Deseo solicitar una cotización formal y directa para el siguiente servicio de gas natural:

========================================
DATOS DE CONTACTO DEL CLIENTE:
========================================
- Nombre Completo: ${nombre}
- Correo Electrónico: ${correo}
- Teléfono / WhatsApp: ${telefono}
- Ubicación / Dirección: ${ubicacion}

========================================
DETALLES DEL TRABAJO / SERVICIO:
========================================
- Servicio Requerido: ${servicio}
- Tipo de Inmueble: ${inmueble}
- Descripción del trabajo, falla o requerimiento normativo:
${detalles}

========================================
Solicito información de disponibilidad para visita técnica o presupuesto estimado.

Atentamente,
${nombre}
`;

    // Codificar para URL mailto
    const mailtoUrl = `mailto:${emailDestino}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;

    // Mostrar confirmación visual en pantalla
    const successBox = document.getElementById('quote-success-msg');
    const successDesc = document.getElementById('success-description');

    if (successBox && successDesc) {
        successDesc.innerHTML = `Se ha preparado tu solicitud para <strong>${nombre}</strong>. Si tu cliente de correo no se abrió automáticamente, puedes enviar estos datos a <strong>${emailDestino}</strong>.`;
        successBox.classList.remove('hidden');
    }

    // Abrir cliente de correo
    window.location.href = mailtoUrl;
}

/**
 * Envío de cotización directa al WhatsApp personal del técnico titular
 */
function sendViaWhatsApp() {
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const ubicacion = document.getElementById('ubicacion').value.trim();
    const servicio = document.getElementById('servicio').value;
    const inmueble = document.getElementById('inmueble').value;
    const detalles = document.getElementById('detalles').value.trim();

    const telefonoWhatsApp = '573112453049'; // WhatsApp de EDILGASS

    let texto = `*SOLICITUD DE COTIZACIÓN - EDILGASS*\n`;
    texto += `\n`;
    texto += `*Cliente:* ${nombre || 'No indicado'}\n`;
    if (telefono) texto += `*Teléfono:* ${telefono}\n`;
    if (correo) texto += `*Correo:* ${correo}\n`;
    if (ubicacion) texto += `*Ciudad/Ubicación:* ${ubicacion}\n`;
    texto += `*Servicio:* ${servicio || 'Por definir'}\n`;
    texto += `*Inmueble:* ${inmueble}\n`;
    texto += `*Detalles:* ${detalles || 'Solicito asesoría técnica directa'}\n`;

    const url = `https://wa.me/${telefonoWhatsApp}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
}

/**
 * Visor de fotos: ampliar, pasar a la anterior/siguiente (botones, teclado o deslizando)
 */
let lbItems = [], lbIndex = 0, lbTouchX = null;

function openImageModal(src, title) {
    const tiles = [...document.querySelectorAll('#gallery-grid [data-src]:not(.hidden)')];
    lbItems = tiles.map(t => ({ src: t.dataset.src, title: t.dataset.title }));
    lbIndex = lbItems.findIndex(i => i.src === src);
    if (lbIndex < 0) { lbItems = [{ src, title }]; lbIndex = 0; }
    renderLightbox();
    document.getElementById('image-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function renderLightbox() {
    const it = lbItems[lbIndex];
    const img = document.getElementById('modal-img');
    img.src = it.src;
    img.alt = it.title || '';
    document.getElementById('modal-title').textContent = it.title || '';
    document.getElementById('modal-count').textContent = lbItems.length > 1 ? `${lbIndex + 1} / ${lbItems.length}` : '';
    ['modal-prev', 'modal-next'].forEach(id => document.getElementById(id).classList.toggle('hidden', lbItems.length < 2));
}

function stepImage(d) {
    if (lbItems.length < 2) return;
    lbIndex = (lbIndex + d + lbItems.length) % lbItems.length;
    renderLightbox();
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', (e) => {
    const open = !document.getElementById('image-modal').classList.contains('hidden');
    if (!open) return;
    if (e.key === 'Escape') closeImageModal();
    if (e.key === 'ArrowLeft') stepImage(-1);
    if (e.key === 'ArrowRight') stepImage(1);
});

document.getElementById('image-modal').addEventListener('touchstart', (e) => { lbTouchX = e.touches[0].clientX; }, { passive: true });
document.getElementById('image-modal').addEventListener('touchend', (e) => {
    if (lbTouchX === null) return;
    const dx = e.changedTouches[0].clientX - lbTouchX;
    if (Math.abs(dx) > 50) stepImage(dx < 0 ? 1 : -1);
    lbTouchX = null;
});

/**
 * Filtro de la galería de trabajos por categoría
 */
function filterGallery(cat) {
    document.querySelectorAll('#gallery-grid [data-cat]').forEach(el => {
        el.classList.toggle('hidden', cat !== 'todos' && !el.dataset.cat.split(' ').includes(cat));
    });
    document.querySelectorAll('.gallery-filter').forEach(b => {
        const on = b.dataset.filter === cat;
        b.classList.toggle('bg-brand-orange', on);
        b.classList.toggle('border-brand-orange', on);
        b.classList.toggle('text-white', on);
        b.classList.toggle('border-white/20', !on);
        b.classList.toggle('text-slate-300', !on);
    });
}

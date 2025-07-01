// ==============================================
// CONSTANTES Y CONFIGURACIÓN
// ==============================================
const CONTENT_MAP = {
  'inicio': 'partials/inicio.html',
  'nosotros': 'partials/nosotros.html',
  'quehacemos': 'partials/quehacemos.html',
  'novedades': 'partials/novedades.html',
  'contacto': 'partials/contacto.html'
};

const VALID_SECTIONS = Object.keys(CONTENT_MAP);

// ==============================================
// FUNCIONES PRINCIPALES
// ==============================================

/**
 * Carga contenido HTML en un elemento específico
 * @param {string} url - Ruta del archivo HTML
 * @param {string} elementId - ID del elemento contenedor
 * @param {function} [callback] - Función a ejecutar después de cargar
 */
async function loadHTML(url, elementId, callback) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const html = await response.text();
    const container = document.getElementById(elementId);
    
    if (container) {
      container.innerHTML = html;
      if (callback) callback();
      initDynamicElements();
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error loading ${url}:`, error);
    const container = document.getElementById(elementId);
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <p>Error al cargar el contenido. Por favor intenta nuevamente.</p>
          <button onclick="location.reload()">Recargar página</button>
        </div>
      `;
    }
    return false;
  }
}

/**
 * Carga una sección de contenido en el área principal
 * @param {string} section - Nombre de la sección a cargar
 */
async function loadContent(section) {
  if (!CONTENT_MAP[section]) return;
  
  // Mostrar loader mientras carga
  const mainContent = document.getElementById('main-content');
  if (mainContent) mainContent.innerHTML = '<div class="loader"></div>';
  
  const loaded = await loadHTML(CONTENT_MAP[section], 'main-content', () => {
    // Actualizar URL sin recargar
    history.pushState({ section }, '', `#${section}`);
    document.title = `ALESA - ${section.charAt(0).toUpperCase() + section.slice(1)}`;
    
    // Desplazamiento suave al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  if (!loaded) {
    // Fallback a inicio si hay error
    if (section !== 'inicio') loadContent('inicio');
  }
}

/**
 * Carga y muestra un modal específico
 * @param {string} modalType - Tipo de modal ('login' o 'registro')
 */
async function loadModal(modalType) {
  const modalFile = `partials/modales/modal-${modalType}.html`;
  const modalId = `${modalType}Modal`;
  
  try {
    const response = await fetch(modalFile);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const html = await response.text();
    const modal = document.getElementById(modalId);
    
    if (modal) {
      modal.innerHTML = html;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Bloquear scroll
      
      // Enfocar primer input
      const firstInput = modal.querySelector('input');
      if (firstInput) firstInput.focus();
    }
  } catch (error) {
    console.error(`Error loading modal ${modalType}:`, error);
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.innerHTML = `
        <div class="modal-error">
          <p>Error al cargar el formulario. Por favor intenta nuevamente.</p>
          <button onclick="closeModal('${modalType}')">Cerrar</button>
        </div>
      `;
      modal.style.display = 'flex';
    }
  }
}

/**
 * Cierra un modal específico
 * @param {string} modalType - Tipo de modal ('login' o 'registro')
 */
function closeModal(modalType) {
  const modal = document.getElementById(`${modalType}Modal`);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restaurar scroll
    // Limpiar después de la animación
    setTimeout(() => { modal.innerHTML = ''; }, 300);
  }
}

// ==============================================
// MANEJO DE EVENTOS Y NAVEGACIÓN
// ==============================================

/**
 * Configura los event listeners dinámicos
 */
function initDynamicElements() {
  // Delegación de eventos para elementos dinámicos
  document.addEventListener('click', handleGlobalClicks);
  
  // Configurar Intersection Observers
  initIntersectionObservers();
  
  // Manejar tecla ESC para cerrar modales
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal[style*="display: flex"]');
      if (openModal) {
        const modalType = openModal.id.replace('Modal', '');
        closeModal(modalType);
      }
    }
  });
}

/**
 * Maneja los clicks globales
 * @param {Event} e - Evento de click
 */
function handleGlobalClicks(e) {
  // Clic en enlaces del menú
  if (e.target.matches('.menu a')) {
    e.preventDefault();
    const section = e.target.textContent.toLowerCase().replace('¿', '').replace('?', '').replace(' ', '');
    if (VALID_SECTIONS.includes(section)) loadContent(section);
  }
  
  // Clic en botones de login/registro
  if (e.target.id === 'btnLogin') {
    e.preventDefault();
    loadModal('login');
  }
  
  if (e.target.id === 'btnRegister') {
    e.preventDefault();
    loadModal('registro');
  }
  
  // Clic en botones de switch entre modales
  if (e.target.hasAttribute('data-modal-switch')) {
    e.preventDefault();
    const targetModal = e.target.getAttribute('data-modal-switch');
    const currentModal = e.target.closest('.modal').id.replace('Modal', '');
    closeModal(currentModal);
    loadModal(targetModal);
  }
  
  // Clic fuera del modal para cerrar
  if (e.target.classList.contains('modal')) {
    const modalType = e.target.id.replace('Modal', '');
    closeModal(modalType);
  }
  
  // Clic en botón cerrar (×)
  if (e.target.classList.contains('close-modal')) {
    const modal = e.target.closest('.modal');
    if (modal) {
      const modalType = modal.id.replace('Modal', '');
      closeModal(modalType);
    }
  }
  
  // Clic en botón del menú hamburguesa
  if (e.target.classList.contains('menu-toggle') || e.target.closest('.menu-toggle')) {
    toggleMenu();
  }
}

/**
 * Maneja el estado del historial/popstate
 */
function handlePopState() {
  const hash = window.location.hash.substring(1);
  if (hash && VALID_SECTIONS.includes(hash)) {
    loadContent(hash);
  } else {
    loadContent('inicio');
  }
}

// ==============================================
// ANIMACIONES Y EFECTOS
// ==============================================

/**
 * Inicializa los Intersection Observers para animaciones
 */
function initIntersectionObservers() {
  const animatedSections = document.querySelectorAll(
    '.quienes-somos, .lineamientos, .objetivos-especificos, ' +
    '.que-hacemos-section, .que-ofrecemos, .clientes-section, ' +
    '.contacto-section, .hacemos-card, .producto-card, .cliente-card'
  );

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedSections.forEach(section => {
    observer.observe(section);
  });
}

/**
 * Alterna el menú móvil
 */
function toggleMenu() {
  const menu = document.querySelector('.menu');
  const menuToggle = document.querySelector('.menu-toggle');
  
  if (menu && menuToggle) {
    menu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  }
}

// ==============================================
// MANEJO DE FORMULARIOS
// ==============================================

/**
 * Maneja el envío de formularios
 * @param {Event} e - Evento de submit
 */
async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  
  // Mostrar estado de carga
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';
  
  try {
    // Simular envío (en producción, usar fetch a tu backend)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mostrar mensaje de éxito
    form.innerHTML = `
      <div class="form-success">
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
        </svg>
        <h3>¡Gracias!</h3>
        <p>Tu mensaje ha sido enviado correctamente.</p>
        <button onclick="closeModal('${form.closest('.modal')?.id.replace('Modal', '') || 'this.closest(\'form\').reset();location.reload()'}')">
          Cerrar
        </button>
      </div>
    `;
  } catch (error) {
    console.error('Error submitting form:', error);
    submitBtn.textContent = 'Error. Intenta nuevamente';
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }, 2000);
  }
}

// ==============================================
// INICIALIZACIÓN
// ==============================================

/**
 * Inicializa la aplicación
 */
async function initApp() {
  // Cargar header y footer
  await Promise.all([
    loadHTML('partials/header.html', 'header-container'),
    loadHTML('partials/footer.html', 'footer-container')
  ]);
  
  // Configurar navegación inicial
  handlePopState();
  
  // Configurar eventos globales
  window.addEventListener('popstate', handlePopState);
  document.addEventListener('submit', handleFormSubmit);
  
  // Inicializar elementos dinámicos
  initDynamicElements();
}

// Iniciar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
// Función para cargar contenido HTML
function loadHTML(url, elementId) {
  fetch(url)
    .then(response => response.text())
    .then(html => {
      document.getElementById(elementId).innerHTML = html;
    })
    .catch(err => {
      console.error(`Error al cargar ${url}:`, err);
    });
}

// Función para cargar una sección específica
function loadContent(section) {
  const contentMap = {
    'inicio': 'partials/inicio.html',
    'nosotros': 'partials/nosotros.html',
    'quehacemos': 'partials/quehacemos.html',
    'novedades': 'partials/novedades.html',
    'contacto': 'partials/contacto.html'
  };

  if (contentMap[section]) {
    loadHTML(contentMap[section], 'main-content');
    // Actualizar la URL sin recargar la página
    history.pushState({ section: section }, '', `#${section}`);
  }
}

// Cargar header y footer al inicio
document.addEventListener('DOMContentLoaded', function() {
  loadHTML('partials/header.html', 'header-container');
  loadHTML('partials/footer.html', 'footer-container');
  
  // Verificar hash de URL al cargar
  const hash = window.location.hash.substring(1);
  const validSections = ['inicio', 'nosotros', 'quehacemos', 'novedades', 'contacto'];
  
  if (hash && validSections.includes(hash)) {
    loadContent(hash);
  } else {
    // Cargar inicio por defecto
    loadContent('inicio');
  }
});

// Manejar el botón de retroceso/avance del navegador
window.addEventListener('popstate', function(event) {
  if (event.state && event.state.section) {
    loadContent(event.state.section);
  }
});
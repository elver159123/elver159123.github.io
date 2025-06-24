document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los items del menú
    const menuItems = document.querySelectorAll('.menu-item input[type="checkbox"]');
    const mainContent = document.querySelector('.main-content .content-container');
    
    // Contenido para cada sección
    const sectionContents = {
        'home': '<h2>Inicio</h2><p>Bienvenido al panel de control principal.</p>',
        'clientes': '<h2>Clientes</h2><p>Gestión de clientes y contactos.</p>',
        'proveedores': '<h2>Proveedores</h2><p>Administración de proveedores.</p>',
        'reportes': '<h2>Reportes</h2><p>Generación de reportes y estadísticas.</p>'
    };
    
    // Función para cambiar de sección
    function changeSection(sectionId) {
        if(mainContent && sectionContents[sectionId]) {
            mainContent.innerHTML = sectionContents[sectionId];
        }
    }
    
    // Añadir event listeners
    menuItems.forEach(item => {
        item.addEventListener('change', function() {
            if(this.checked) {
                menuItems.forEach(otherItem => {
                    if(otherItem !== this) otherItem.checked = false;
                });
                changeSection(this.id);
            }
        });
    });
    
    // Activar la sección Home al cargar
    const homeItem = document.getElementById('home');
    if(homeItem) {
        homeItem.checked = true;
        changeSection('home');
    }
    
    // Opcional: Manejar el botón de logout
    const logoutBtn = document.querySelector('.logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('alesa-current-user');
            window.location.href = 'index.html';
        });
    }
});
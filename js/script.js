document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if(menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const icon = this.querySelector('i');
            if(icon) {
                icon.classList.toggle('fa-times');
                icon.classList.toggle('fa-bars');
            }
        });
    }

    // Funcionalidad de búsqueda
    const searchBar = document.querySelector('.search-bar input');
    const searchIcon = document.querySelector('.search-bar i');
    
    if(searchBar) {
        // Focus en la barra de búsqueda al hacer clic en el icono
        if(searchIcon) {
            searchIcon.addEventListener('click', function() {
                searchBar.focus();
            });
        }

        // Buscar al presionar Enter
        searchBar.addEventListener('keypress', function(e) {
            if(e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });

        // Mostrar sugerencias mientras se escribe
        searchBar.addEventListener('input', function() {
            showSearchSuggestions(this.value);
        });

        // Cerrar sugerencias al perder foco
        searchBar.addEventListener('blur', function() {
            setTimeout(() => {
                const suggestions = document.querySelector('.search-suggestions');
                if(suggestions) suggestions.style.display = 'none';
            }, 200);
        });
    }

    // Función para realizar la búsqueda
    function performSearch(query) {
        query = query.trim();
        if(query === '') return;
        
        console.log('Realizando búsqueda:', query);
        
        // Aquí puedes implementar la lógica de búsqueda real
        // Ejemplo: Redirigir a una página de resultados
        // window.location.href = `/busqueda?q=${encodeURIComponent(query)}`;
        
        // O mostrar resultados dinámicos (ejemplo básico)
        displaySearchResults(query);
        
        // Limpiar el campo de búsqueda
        searchBar.value = '';
        
        // Ocultar sugerencias
        const suggestions = document.querySelector('.search-suggestions');
        if(suggestions) suggestions.style.display = 'none';
    }

    // Función para mostrar sugerencias de búsqueda
    function showSearchSuggestions(query) {
        query = query.trim();
        const suggestionsContainer = document.querySelector('.search-suggestions');
        
        if(query === '') {
            if(suggestionsContainer) {
                suggestionsContainer.style.display = 'none';
            }
            return;
        }

        // Crear contenedor si no existe
        if(!suggestionsContainer) {
            const container = document.createElement('div');
            container.className = 'search-suggestions';
            document.querySelector('.search-bar').appendChild(container);
        } else {
            suggestionsContainer.style.display = 'block';
        }

        // Obtener sugerencias (en una implementación real, sería una petición AJAX)
        const suggestions = getSearchSuggestions(query);
        
        // Mostrar sugerencias
        displaySuggestions(suggestions);
    }

    // Función para obtener sugerencias de búsqueda
    function getSearchSuggestions(query) {
        // Datos de ejemplo - en una implementación real esto vendría de una API
        const allServices = [
            "Mantenimiento industrial",
            "Reparación de maquinaria",
            "Fabricación de equipos",
            "Automatización de procesos",
            "Venta de repuestos",
            "Asesoría técnica",
            "Instalación de equipos",
            "Capacitación operativa",
            "Maquinaria pesada",
            "Equipos industriales",
            "Servicio técnico especializado",
            "Ingeniería industrial"
        ];
        
        return allServices.filter(service => 
            service.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }

    // Función para mostrar sugerencias en el DOM
    function displaySuggestions(suggestions) {
        const container = document.querySelector('.search-suggestions');
        if(!container) return;
        
        container.innerHTML = '';
        
        if(suggestions.length === 0) {
            container.innerHTML = '<div class="suggestion-item">No se encontraron sugerencias</div>';
            return;
        }
        
        suggestions.forEach(item => {
            const suggestion = document.createElement('div');
            suggestion.className = 'suggestion-item';
            suggestion.textContent = item;
            
            suggestion.addEventListener('click', function() {
                searchBar.value = item;
                performSearch(item);
            });
            
            container.appendChild(suggestion);
        });
    }

    // Función para mostrar resultados (ejemplo básico)
    function displaySearchResults(query) {
        // En una implementación real, esto mostraría resultados reales
        console.log('Mostrando resultados para:', query);
        
        // Ejemplo: Crear una sección de resultados dinámicos
        const existingResults = document.querySelector('.search-results');
        if(existingResults) existingResults.remove();
        
        const resultsSection = document.createElement('div');
        resultsSection.className = 'search-results';
        resultsSection.innerHTML = `
            <section class="search-results-section" style="padding: 60px 0; background: #fff;">
                <div class="container">
                    <h2>Resultados de búsqueda para: "${query}"</h2>
                    <div class="results-grid" style="margin-top: 30px;">
                        <p>En una implementación real, aquí se mostrarían los productos/servicios encontrados.</p>
                        <p>Actualmente es una demostración con datos simulados.</p>
                    </div>
                </div>
            </section>
        `;
        
        document.body.appendChild(resultsSection);
        
        // Desplazarse a los resultados
        window.scrollTo({
            top: resultsSection.offsetTop - 90,
            behavior: 'smooth'
        });
    }

    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', function(e) {
        if(!e.target.closest('.search-bar')) {
            const suggestions = document.querySelector('.search-suggestions');
            if(suggestions) suggestions.style.display = 'none';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 90,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if(mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    if(icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });
    
    // Animation on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .client-logo, .about-content, .contact-content');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if(elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial state for animated elements
    const animatedElements = document.querySelectorAll('.service-card, .client-logo, .about-content, .contact-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
});
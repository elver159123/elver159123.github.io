// Mostrar los modales
document.getElementById('btnLogin').addEventListener('click', function (e) {
  e.preventDefault();
  document.getElementById('loginModal').style.display = 'flex';
});

document.getElementById('btnRegister').addEventListener('click', function (e) {
  e.preventDefault();
  document.getElementById('registroModal').style.display = 'flex';
});

// Cerrar al hacer clic fuera del formulario
window.addEventListener('click', function (e) {
  const loginModal = document.getElementById('loginModal');
  const registroModal = document.getElementById('registroModal');

  if (e.target === loginModal) {
    loginModal.style.display = 'none';
  }
  if (e.target === registroModal) {
    registroModal.style.display = 'none';
  }
});

// Botón hamburguesa opcional
function toggleMenu() {
  const menu = document.querySelector(".menu");
  menu.classList.toggle("active");
}

// Intersection Observer for section animations
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.quienes-somos, .lineamientos, .objetivos-especificos');

  const observerOptions = {
    root: null, // relative to the viewport
    rootMargin: '0px',
    threshold: 0.1 // 10% of the section must be visible to trigger
  };

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing once visible
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });
});
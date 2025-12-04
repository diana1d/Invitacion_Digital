// ==============================
// FORM VALIDATION AND COUNTDOWN
// ==============================

// Form validation and submission
document.getElementById("confirmationForm").addEventListener("submit", function (e) {
  e.preventDefault()
  const nameInput = this.querySelector('input[type="text"]')
  const name = nameInput.value.trim()
  if (name.length < 6) {
    alert("Por favor, escribe tu nombre completo (mínimo 6 caracteres).")
    return
  }
  alert("Gracias por confirmar tu asistencia, " + name + "! Te esperamos en la graduación.")
  nameInput.value = ""
})

// Configura la fecha del evento
const eventDate = new Date("December 20, 2025 17:00:00").getTime();
function updateCountdown() {
  const now = new Date().getTime();
  const distance = eventDate - now;
  if (distance < 0) {
    document.getElementById("days").innerText = 0;
    document.getElementById("hours").innerText = 0;
    document.getElementById("minutes").innerText = 0;
    document.getElementById("seconds").innerText = 0;
    clearInterval(countdownInterval);
    return;
  }
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
  document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
  document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
}
// Actualiza cada segundo
const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // llamada inicial

// ==============================
// ANIMACIONES CON SCROLL
// ==============================

document.addEventListener('DOMContentLoaded', function() {
  // Elementos que queremos animar al hacer scroll
  const elementsToAnimate = [
    // Main Section
    '.blessing', '.parents-names p', '.invitation-text', '.graduation-title',
    // Thanks Section
    '.thanks-title', '.thanks-text', '.thanks-decoration',
    // Countdown Section
    '.countdown-title', '.countdown-number', '.countdown-label', 
    '.countdown-para', '.event-date', '.countdown-separator',
    // Event Section
    '.event-title', '.event-info h3', '.event-info p', '.map-button',
    // Confirmation Section
    '.confirmation-title', '.confirmation-content p', 
    '.form-group input', '.confirm-button', '.confirmation-note',
    // Itinerary Section
    '.itinerary-title', '.itinerary-item',
  ];
  
  // Decoraciones que flotan cuando son visibles (SOLO diseño 1, 2 y 3)
  const floatDecorations = [
    '.hero-decoration.top-left', 
    '.hero-decoration.top-right',
    '.hero-decoration.bottom-left',
    '.middle-strip.strip-left',
    '.middle-strip.strip-right',
    '.countdown-strip.strip-top-left',
    '.countdown-strip.strip-top-right'
  ];
  
  // Decoraciones ESTÁTICAS (diseño 4 y otros elementos)
  const staticDecorations = [
    '.diagonal-strip img', // Diseño 4 - ESTÁTICO
    '.strip-left-side',
    '.strip-right-side', 
    '.strip-left-side-two',
    '.laurel-left',
    '.laurel-right'
  ];
  
  // Inicializar elementos con opacidad 0
  elementsToAnimate.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if (!el.classList.contains('animated-initially')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      }
    });
  });
  
  // Asegurar que las decoraciones estáticas NO tengan animación
  staticDecorations.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.animation = 'none !important';
      el.classList.add('static-decoration');
    });
  });
  
  // Función para verificar si un elemento está en la vista
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const threshold = 0.8; // 80% del elemento debe ser visible
    
    return (
      rect.top <= windowHeight * threshold &&
      rect.bottom >= 0
    );
  }
  
  // Función para animar elementos cuando están en la vista
  function animateOnScroll() {
    // Animar textos
    elementsToAnimate.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (isElementInViewport(el) && !el.classList.contains('animated')) {
          el.classList.add('animated');
          
          // Agregar retraso basado en la posición
          const delay = Array.from(document.querySelectorAll(selector)).indexOf(el) * 0.1;
          
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, delay * 1000);
        }
      });
    });
    
    // Animar solo las decoraciones que deben flotar (diseño 1, 2, 3)
    floatDecorations.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (isElementInViewport(el) && !el.classList.contains('floating')) {
          el.classList.add('floating');
          el.style.animation = 'floatAnimation 6s ease-in-out infinite';
          
          // Retraso aleatorio para cada decoración
          const randomDelay = Math.random() * 3;
          el.style.animationDelay = `${randomDelay}s`;
        }
      });
    });
  }
  
  // Función para verificar si estamos en mobile
  function isMobile() {
    return window.innerWidth <= 768;
  }
  
  // Debounce para optimizar el scroll
  let scrollTimeout;
  function debounceScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(animateOnScroll, 50);
  }
  
  // Escuchar el evento scroll
  window.addEventListener('scroll', debounceScroll);
  
  // Animar elementos visibles al cargar la página
  setTimeout(() => {
    animateOnScroll();
    
    // Forzar animación inicial de elementos que ya están visibles
    setTimeout(animateOnScroll, 300);
  }, 500);
  
  // También animar cuando se redimensiona la ventana
  window.addEventListener('resize', function() {
    if (!isMobile()) {
      setTimeout(animateOnScroll, 100);
    }
  });
  
  // ==============================
  // ANIMACIÓN ESPECIAL PARA EL COUNTDOWN
  // ==============================
  
  function animateCountdownNumbers() {
    const countdownNumbers = document.querySelectorAll('.countdown-number');
    const countdownLabels = document.querySelectorAll('.countdown-label');
    
    countdownNumbers.forEach((num, index) => {
      if (isElementInViewport(num) && !num.classList.contains('countdown-animated')) {
        num.classList.add('countdown-animated');
        
        // Animación escalonada para cada número
        setTimeout(() => {
          num.style.transition = 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
          num.style.transform = 'scale(1.1)';
          num.style.color = '#ffd700'; // Dorado más brillante
          
          setTimeout(() => {
            num.style.transform = 'scale(1)';
            num.style.color = '#d4af37'; // Volver al dorado original
          }, 300);
        }, index * 200);
      }
    });
    
    countdownLabels.forEach((label, index) => {
      if (isElementInViewport(label) && !label.classList.contains('label-animated')) {
        label.classList.add('label-animated');
        
        setTimeout(() => {
          label.style.transition = 'all 0.4s ease';
          label.style.opacity = '1';
          label.style.transform = 'translateY(0)';
        }, index * 200 + 100);
      }
    });
  }
  
  // Agregar countdown a la animación de scroll
  window.addEventListener('scroll', function() {
    animateCountdownNumbers();
  });
  
  // Animar countdown al cargar si está visible
  setTimeout(animateCountdownNumbers, 800);
  
  // ==============================
  // ANIMACIÓN PARA BOTONES AL HACER HOVER
  // ==============================
  
  const buttons = document.querySelectorAll('.map-button, .confirm-button');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
      if (!isMobile()) {
        this.style.transform = 'translateY(-3px) scale(1.05)';
        this.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0.2)';
      }
    });
    
    button.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.boxShadow = 'none';
    });
    
    // Efecto táctil para móviles
    button.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.98)';
      this.style.transition = 'transform 0.1s';
    });
    
    button.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
      this.style.transition = 'transform 0.2s';
    });
  });
  
  // ==============================
  // ANIMACIÓN SUAVE PARA EL SCROLL
  // ==============================
  
  // Suavizar scroll interno (si hay links de anclaje)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 20,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ==============================
  // ANIMACIÓN PARA LOS ÍTEMS DEL ITINERARIO
  // ==============================
  
  function animateItineraryItems() {
    const items = document.querySelectorAll('.itinerary-item');
    
    items.forEach((item, index) => {
      if (isElementInViewport(item) && !item.classList.contains('itinerary-animated')) {
        item.classList.add('itinerary-animated');
        
        // Animación escalonada para cada item
        setTimeout(() => {
          item.style.transition = 'all 0.6s ease';
          item.style.opacity = '1';
          item.style.transform = 'translateX(0)';
          
          // Animar el círculo de la línea de tiempo
          setTimeout(() => {
            const circle = item.querySelector('.itinerary-item::before') || item;
            item.style.boxShadow = '0 0 0 5px rgba(212, 175, 55, 0.3)';
            
            setTimeout(() => {
              item.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            }, 300);
          }, 200);
        }, index * 200);
      }
    });
  }
  
  // Agregar itinerario a la animación de scroll
  window.addEventListener('scroll', animateItineraryItems);
  
  // Animar itinerario al cargar si está visible
  setTimeout(animateItineraryItems, 1000);
  
  // ==============================
  // ANIMACIONES INICIALES PARA HERO SECTION
  // ==============================
  
  // Marcar elementos del hero como ya animados inicialmente
  document.querySelectorAll('.hero-text h3, .hero-text h1, .hero-text p, .graduation-hat').forEach(el => {
    el.classList.add('animated-initially');
  });
  
  // Animar decoraciones del hero (solo diseño 1, 2, 3)
  document.querySelectorAll('.hero-decoration').forEach((decoration, index) => {
    setTimeout(() => {
      decoration.style.opacity = '0.9';
    }, index * 500 + 1000);
  });
  
  // ==============================
  // PREVENIR ANIMACIONES EN DISEÑO 4
  // ==============================
  
  // Asegurar que todas las imágenes de diseño4 sean estáticas
  function makeDesign4Static() {
    // Seleccionar todas las imágenes que podrían ser diseño4
    const allImages = document.querySelectorAll('img[src*="diseño4"], img[src*="diseño4.png"]');
    const allStrips = document.querySelectorAll('.strip-1, .strip-2, .strip-3, .strip-left-side, .strip-right-side, .strip-left-side-two');
    
    // Combinar todas las selecciones
    const allDesign4Elements = [...allImages, ...allStrips];
    
    allDesign4Elements.forEach(el => {
      // Eliminar cualquier animación
      el.style.animation = 'none';
      el.style.animationName = 'none';
      el.style.animationDuration = '0s';
      el.style.animationDelay = '0s';
      
      // Agregar clase para identificarlos
      el.classList.add('design4-static');
      
      // Remover cualquier clase de animación
      el.classList.remove('floating', 'float-on-scroll');
    });
    
    console.log(`Hice estáticos ${allDesign4Elements.length} elementos de diseño4`);
  }
  
  // Ejecutar al cargar y después de un tiempo
  setTimeout(makeDesign4Static, 100);
  setTimeout(makeDesign4Static, 1000);
  setTimeout(makeDesign4Static, 3000);
  
  // También ejecutar cuando cambie el tamaño de la ventana
  window.addEventListener('resize', makeDesign4Static);
});
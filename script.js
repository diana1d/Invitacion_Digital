// ==============================
// FORM VALIDATION AND COUNTDOWN
// ==============================

document.addEventListener('DOMContentLoaded', function() {
    const confirmationForm = document.getElementById("confirmationForm");
    
    if (confirmationForm) {
        confirmationForm.addEventListener("submit", function(e) {
            e.preventDefault(); // Prevenir envío real del formulario
            
            const nombreInput = document.getElementById('nombreCompleto');
            const nombre = nombreInput.value.trim();
            
            // Validación básica
            if (nombre.length < 6) {
                showAlert("Por favor, escribe tu nombre completo (mínimo 6 caracteres).", "error");
                nombreInput.focus();
                return;
            }
            
            // Validar que el nombre tenga al menos un espacio (nombre y apellido)
            if (!nombre.includes(' ')) {
                showAlert("Por favor, escribe tu nombre y apellido completos.", "error");
                nombreInput.focus();
                return;
            }
            
            // Mostrar loading en el botón
            const submitButton = this.querySelector('.confirm-button');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="bi bi-hourglass-split"></i> CONFIRMANDO...';
            submitButton.disabled = true;
            
            // Simular envío (sin backend real)
            setTimeout(() => {
                // Simulación exitosa
                showAlert(`¡Gracias ${nombre}! Tu confirmación se ha registrado correctamente. Te esperamos en el evento.`, "success");
                
                // Limpiar el formulario
                nombreInput.value = '';
                
                // Restaurar botón
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                
                // Aquí puedes agregar código para guardar localmente si lo deseas
                saveConfirmationLocally(nombre);
                
                // Opcional: enviar datos a Google Sheets o similar
                // sendToGoogleSheets(nombre);
                
            }, 1500); // Simula 1.5 segundos de "procesamiento"
        });
    }
    
    // Función para mostrar alertas personalizadas
    function showAlert(message, type = "info") {
        // Crear elemento de alerta
        const alertDiv = document.createElement('div');
        alertDiv.className = `custom-alert ${type}`;
        alertDiv.innerHTML = `
            <div class="alert-content">
                <i class="bi ${type === 'success' ? 'bi-check-circle' : type === 'error' ? 'bi-exclamation-circle' : 'bi-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="alert-close">&times;</button>
        `;
        
        // Estilos para la alerta
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            padding: 15px 20px;
            border-radius: 5px;
            border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            max-width: 500px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        
        // Estilos para el contenido
        const alertContent = alertDiv.querySelector('.alert-content');
        alertContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
        `;
        
        // Estilos para el botón de cerrar
        const closeBtn = alertDiv.querySelector('.alert-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: inherit;
            line-height: 1;
            padding: 0;
            margin-left: 15px;
        `;
        
        // Animación de entrada
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Agregar al documento
        document.body.appendChild(alertDiv);
        
        // Configurar cierre automático
        setTimeout(() => {
            alertDiv.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 300);
        }, 5000);
        
        // Configurar cierre manual
        closeBtn.addEventListener('click', function() {
            alertDiv.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.parentNode.removeChild(alertDiv);
                }
            }, 300);
        });
    }
    
    // Función para guardar confirmaciones localmente
    function saveConfirmationLocally(nombre) {
        try {
            const confirmaciones = JSON.parse(localStorage.getItem('confirmacionesGraduacion')) || [];
            const nuevaConfirmacion = {
                nombre: nombre,
                fecha: new Date().toISOString(),
                timestamp: Date.now()
            };
            
            confirmaciones.push(nuevaConfirmacion);
            localStorage.setItem('confirmacionesGraduacion', JSON.stringify(confirmaciones));
            
            console.log('Confirmación guardada localmente:', nuevaConfirmacion);
            console.log('Total de confirmaciones:', confirmaciones.length);
        } catch (error) {
            console.error('Error al guardar localmente:', error);
        }
    }
    
    // Opcional: Función para enviar a Google Sheets (si configuras una API)
    function sendToGoogleSheets(nombre) {
        // URL de tu Google Apps Script (debes configurarlo primero)
        const scriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
        
        const data = {
            nombre: nombre,
            fecha: new Date().toLocaleString('es-ES'),
            evento: 'Graduación'
        };
        
        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', // Importante para Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            console.log('Datos enviados a Google Sheets');
        })
        .catch(error => {
            console.error('Error al enviar a Google Sheets:', error);
        });
    }
    
    // Mostrar contador de confirmaciones (opcional)
    function showConfirmationCount() {
        try {
            const confirmaciones = JSON.parse(localStorage.getItem('confirmacionesGraduacion')) || [];
            if (confirmaciones.length > 0) {
                console.log(`Total de personas confirmadas: ${confirmaciones.length}`);
                // Puedes mostrar esto en la página si quieres:
                // const countElement = document.createElement('p');
                // countElement.textContent = `${confirmaciones.length} personas ya confirmaron`;
                // countElement.style.cssText = 'text-align: center; color: #666; margin-top: 10px; font-style: italic;';
                // confirmationForm.appendChild(countElement);
            }
        } catch (error) {
            console.error('Error al leer confirmaciones:', error);
        }
    }
    
    // Mostrar contador al cargar
    showConfirmationCount();
});

// El resto de tu código (countdown, animaciones) permanece igual

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
  }
  
  // Ejecutar al cargar y después de un tiempo
  setTimeout(makeDesign4Static, 100);
  setTimeout(makeDesign4Static, 1000);
  setTimeout(makeDesign4Static, 3000);
  
  // También ejecutar cuando cambie el tamaño de la ventana
  window.addEventListener('resize', makeDesign4Static);
});
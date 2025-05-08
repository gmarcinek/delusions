/**
 * Główny plik JavaScript dla strony FilozofiaGPT
 */

document.addEventListener('DOMContentLoaded', function() {
    // Obsługa mobilnego menu
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Zmiana ikony hamburger/close
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Zamykanie menu po kliknięciu na link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Obsługa przewijania strony - dodanie cienia do headera
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Efekt pojawiania się elementów podczas przewijania
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.article-card, .section-title');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    // Dodaj klasę do elementów na początek
    document.querySelectorAll('.article-card, .section-title').forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    // Wywołaj funkcję przy ładowaniu strony
    animateOnScroll();
    
    // Wywołaj funkcję podczas przewijania
    window.addEventListener('scroll', animateOnScroll);
    
    // Powiększanie obrazków po kliknięciu
    initializeImageZoom();
});

/**
 * Walidacja adresu email
 * @param {string} email - Adres email do walidacji
 * @return {boolean} Czy email jest poprawny
 */
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Wyświetlanie powiadomień
 * @param {string} message - Treść powiadomienia
 * @param {string} type - Typ powiadomienia ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
    // Sprawdź czy div powiadomień już istnieje
    let notificationContainer = document.querySelector('.notification-container');
    
    // Jeśli nie, stwórz go
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Stwórz powiadomienie
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Dodaj do kontenera
    notificationContainer.appendChild(notification);
    
    // Dodaj obsługę przycisku zamknięcia
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        notification.classList.add('hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Automatyczne zamknięcie po 5 sekundach
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.add('hiding');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

/**
 * Inicjalizacja funkcjonalności powiększania obrazków
 */
function initializeImageZoom() {
    // Znajdź wszystkie obrazki w artykułach
    const images = document.querySelectorAll('.article-content img:not(.no-zoom)');
    
    images.forEach(img => {
        // Dodaj klasę "zoomable"
        img.classList.add('zoomable');
        
        img.addEventListener('click', function() {
            // Stwórz overlay
            const overlay = document.createElement('div');
            overlay.className = 'image-zoom-overlay';
            
            // Stwórz kontener
            const container = document.createElement('div');
            container.className = 'image-zoom-container';
            
            // Utwórz powiększony obrazek
            const zoomedImg = document.createElement('img');
            zoomedImg.src = this.src;
            zoomedImg.alt = this.alt;
            zoomedImg.className = 'zoomed-image';
            
            // Dodaj przycisk zamknięcia
            const closeBtn = document.createElement('button');
            closeBtn.className = 'zoom-close-btn';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            
            // Dodaj elementy do DOM
            container.appendChild(zoomedImg);
            container.appendChild(closeBtn);
            overlay.appendChild(container);
            document.body.appendChild(overlay);
            
            // Zapobiegaj przewijaniu strony
            document.body.style.overflow = 'hidden';
            
            // Obsługa zamknięcia
            const closeZoom = () => {
                overlay.classList.add('closing');
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    document.body.style.overflow = '';
                }, 300);
            };
            
            // Zamknij po kliknięciu na overlay lub przycisk
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    closeZoom();
                }
            });
            
            closeBtn.addEventListener('click', closeZoom);
            
            // Zamknij po naciśnięciu escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeZoom();
                }
            });
        });
    });
}
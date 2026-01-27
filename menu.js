/* 
 * Menu.js - Lógica del Sidebar compartida en todas las páginas
 * Maneja el toggle del menú y la animación del logo
 * Mantiene el estado del menú entre páginas usando localStorage
 */

document.addEventListener('DOMContentLoaded', () => {
    // Seleccionamos SOLO el logo (no los nav-items)
    const logoArea = document.querySelector('.logo');
    const sidebar = document.querySelector('.sidebar');

    // Restaurar el estado del menú desde localStorage
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    
    // Remover la clase temporal de inicialización
    document.documentElement.classList.remove('sidebar-collapsed-init');
    
    // Aplicar la clase definitiva si corresponde
    if (isCollapsed && sidebar) {
        sidebar.classList.add('collapsed');
    }

    // Función que ejecuta la animación y el toggle
    function toggleMenu(event) {
        // Evitamos que el logo actúe como link
        event.preventDefault(); 
        
        if (logoArea && sidebar) {
            // A. Reiniciar animación actual
            logoArea.classList.remove('animating');
            void logoArea.offsetWidth; // Forzar reflow para reiniciar animación

            // B. Alternar clase collapsed
            sidebar.classList.toggle('collapsed');

            // C. Guardar el estado en localStorage
            const isNowCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem('sidebarCollapsed', isNowCollapsed);

            // D. Activar animación de flip
            logoArea.classList.add('animating');

            // E. Limpiar después de la animación (0.6s)
            setTimeout(() => {
                logoArea.classList.remove('animating');
            }, 600);
        }
    }

    // Agregamos el evento click SOLO al logo
    if (logoArea) {
        logoArea.addEventListener('click', toggleMenu);
    }

    console.log('✅ Menu.js cargado - Toggle disponible en el logo de MyCard');
    console.log(`📌 Estado del menú: ${isCollapsed ? 'Colapsado' : 'Expandido'}`);
});

/**
 * Developer - MyCard Panel JS
 * Versión Beta 1.0 con Menú Animado Gooey
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- ELEMENTOS DEL DOM PARA NAVEGACIÓN ---
    const menu = document.querySelector(".menu");
    const menuItems = document.querySelectorAll(".menu__item");
    const menuBorder = document.querySelector(".menu__border");
    const tabPanels = document.querySelectorAll(".tab-panel");

    // --- ELEMENTOS DEL DOM PARA FUNCIONALIDAD ---
    const passwordInput = document.getElementById('password');
    const copyBtns = document.querySelectorAll('.copy-btn');
    const saveAlertsBtn = document.getElementById('saveAlerts');

    // Asegurar que los campos de perfil sean de solo lectura permanentemente
    const usernameInput = document.getElementById('username');
    if (usernameInput) usernameInput.setAttribute('readonly', true);
    if (passwordInput) passwordInput.setAttribute('readonly', true);
    
    // Generador de Token
    const generateTokenBtn = document.getElementById('generateToken');
    const regenerateTokenBtn = document.getElementById('regenerateToken');
    const noTokenWarning = document.getElementById('noTokenWarning');
    const tokenActions = document.getElementById('tokenActions');
    const tokenDisplay = document.getElementById('tokenDisplay');
    const tokenCreatedDate = document.getElementById('tokenCreatedDate');

    // --- LÓGICA DEL MENÚ ANIMADO ---
    function offsetMenuBorder(element, menuBorder) {
        const offsetActiveItem = element.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const left = Math.floor(offsetActiveItem.left - menuRect.left - (menuBorder.offsetWidth - offsetActiveItem.width) / 2) + "px";
        menuBorder.style.transform = `translate3d(${left}, 0 , 0)`;
        // Cambiar el color del borde al color del ítem activo
        menuBorder.style.backgroundColor = element.style.getPropertyValue('--bgColorItem');
    }

    // Inicializar posición de la curva
    if (menu && menuBorder) {
        offsetMenuBorder(menu.querySelector(".active"), menuBorder);
    }

    menuItems.forEach((item) => {
        item.addEventListener("click", () => {
            if (item.classList.contains("active")) return;

            // 1. Animación visual del menú
            menu.querySelector(".active").classList.remove("active");
            item.classList.add("active");
            offsetMenuBorder(item, menuBorder);

            // 2. Cambio de paneles (Tabs)
            const targetTab = item.dataset.tab;
            tabPanels.forEach(p => p.classList.remove('active'));
            document.getElementById(targetTab).classList.add('active');

            console.log(`📑 Sección cambiada a: ${targetTab}`);
        });
    });

    // Re-ajustar curva al cambiar tamaño de pantalla
    window.addEventListener("resize", () => {
        offsetMenuBorder(menu.querySelector(".active"), menuBorder);
    });

    // --- COPIAR AL PORTAPAPELES ---
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.copy || 'integrationToken';
            const targetElement = document.getElementById(targetId);
            const textToCopy = targetElement.textContent || targetElement.value;

            navigator.clipboard.writeText(textToCopy).then(() => {
                const icon = btn.querySelector('i');
                icon.className = 'fas fa-check';
                showNotification('Copiado al portapapeles', 'success');
                setTimeout(() => icon.className = 'fas fa-copy', 2000);
            }).catch(() => showNotification('Error al copiar', 'error'));
        });
    });

    // --- GENERAR / REGENERAR TOKEN ---
    function updateTokenUI() {
        const newToken = generateRandomKey('mc_int_tk_');
        const dateStr = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
        
        document.getElementById('integrationToken').textContent = newToken;
        tokenCreatedDate.textContent = dateStr;
        
        noTokenWarning.style.display = 'none';
        tokenActions.style.display = 'none';
        tokenDisplay.style.display = 'block';
    }

    if (generateTokenBtn) {
        generateTokenBtn.addEventListener('click', () => {
            updateTokenUI();
            showNotification('Token generado exitosamente', 'success');
        });
    }

    if (regenerateTokenBtn) {
        regenerateTokenBtn.addEventListener('click', () => {
            if (confirm('¿Regenerar token? El anterior dejará de funcionar.')) {
                updateTokenUI();
                showNotification('Token regenerado', 'success');
            }
        });
    }

    // --- FUNCIONES DE APOYO ---
    function generateRandomKey(prefix) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let key = prefix;
        for (let i = 0; i < 32; i++) key += chars.charAt(Math.floor(Math.random() * chars.length));
        return key;
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const iconClass = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };

        notification.className = `notification-toast ${type}`;
        notification.innerHTML = `<i class="fas ${iconClass[type]}"></i> <span>${message}</span>`;

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('closing');
            notification.addEventListener('animationend', () => notification.remove());
        }, 3000);
    }
});   

document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Obtener Número de Guía de la URL ---
    const urlParams = new URLSearchParams(window.location.search);
    const guideNumber = urlParams.get('guide') || 'MX-882910'; // Valor por defecto si no hay param
    
    const trackingDisplay = document.getElementById('trackingNumberDisplay');
    if (trackingDisplay) {
        trackingDisplay.textContent = guideNumber;
    }

    // Elementos del DOM
    const etaTimeEl = document.getElementById('etaTime');
    const etaCountdownEl = document.getElementById('etaCountdown');
    const distEl = document.getElementById('distanceRemaining');
    const timeEl = document.getElementById('timeRemaining');
    
    // Elementos del Stepper (Barra de Progreso)
    const progressLine = document.querySelector('.progress-line-fill');
    
    // Elementos de Detalles del Envío
    const lastUpdateDisplay = document.getElementById('lastUpdateDisplay');
    const lastLocationDisplay = document.getElementById('lastLocationDisplay');

    // Establecer estado estático (En Tránsito)
    if (progressLine) {
        progressLine.style.width = '75%';
    }

    // Actualizar ETA estático
    if (etaTimeEl) {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 45);
        etaTimeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (etaCountdownEl) etaCountdownEl.textContent = "Llega en 45 minutos";
    if (distEl) distEl.textContent = "12.5 km";
    if (timeEl) timeEl.textContent = "45 min";
    
    if (lastUpdateDisplay) {
        lastUpdateDisplay.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (lastLocationDisplay) {
        lastLocationDisplay.textContent = "En ruta a destino";
    }
});
document.addEventListener('DOMContentLoaded', () => {
    // Coordenadas iniciales (Simulación: CDMX)
    const startCoords = [19.4326, -99.1332]; // Zócalo
    const endCoords = [19.4150, -99.1700];   // Condesa aprox
    let currentCoords = [...startCoords];

    // Inicializar Mapa
    const map = L.map('trackingMap').setView(startCoords, 14);

    // Capa de Mapa (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Iconos Personalizados
    const truckIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:#6366f1; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 4px 8px rgba(0,0,0,0.3);'><i class='fas fa-truck' style='color:white; font-size:16px;'></i></div>",
        iconSize: [36, 36],
        iconAnchor: [18, 18]
    });

    const destIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:#ef4444; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 4px 8px rgba(0,0,0,0.3);'><i class='fas fa-home' style='color:white; font-size:14px;'></i></div>",
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    const pickupIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:#10b981; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 4px 8px rgba(0,0,0,0.3);'><i class='fas fa-store' style='color:white; font-size:14px;'></i></div>",
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    // Marcadores
    const truckMarker = L.marker(startCoords, { icon: truckIcon }).addTo(map);
    const destMarker = L.marker(endCoords, { icon: destIcon }).addTo(map);
    
    // Ruta (Línea simple para simulación)
    const routeLine = L.polyline([startCoords, endCoords], {
        color: '#6366f1',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10'
    }).addTo(map);

    // Ajustar vista para mostrar ruta completa
    map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

    // Variables de Simulación
    let progress = 0;
    const speed = 0.005; // Velocidad de avance
    let isGeofenceTriggered = false;
    let pickupMarkers = [];
    let heatmapLayer = null;

    // Elementos del DOM
    const etaTimeEl = document.getElementById('etaTime');
    const etaCountdownEl = document.getElementById('etaCountdown');
    const distEl = document.getElementById('distanceRemaining');
    const timeEl = document.getElementById('timeRemaining');
    const alertEl = document.getElementById('geofenceAlert');
    
    // Elementos del Stepper (Barra de Progreso)
    const progressLine = document.querySelector('.progress-line-fill');
    const stepItems = document.querySelectorAll('.step-item');

    // Función de Animación
    function animateTruck() {
        if (progress < 1) {
            progress += speed;
            
            // Interpolar posición
            const lat = startCoords[0] + (endCoords[0] - startCoords[0]) * progress;
            const lng = startCoords[1] + (endCoords[1] - startCoords[1]) * progress;
            
            const newPos = [lat, lng];
            truckMarker.setLatLng(newPos);

            // Actualizar línea recorrida (opcional, visualmente mejor si se divide la línea)
            
            // Calcular Distancia Restante (Euclidiana simple para demo)
            const dist = map.distance(newPos, endCoords); // Metros
            const distKm = (dist / 1000).toFixed(1);
            
            // Actualizar UI
            distEl.textContent = `${distKm} km`;
            
            // Calcular Tiempo (asumiendo 30km/h promedio en ciudad)
            const timeMin = Math.ceil((distKm / 30) * 60);
            timeEl.textContent = `${timeMin} min`;
            
            // Actualizar ETA
            const now = new Date();
            now.setMinutes(now.getMinutes() + timeMin);
            etaTimeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            etaCountdownEl.textContent = `Llega en ${timeMin} minutos`;

            // --- Sincronizar Barra de Progreso ---
            // Mapeamos el progreso del camión (0.0 a 1.0) al ancho visual de la barra (65% a 100%)
            if (progressLine) {
                const startWidth = 65; 
                const endWidth = 100;
                const currentWidth = startWidth + (progress * (endWidth - startWidth));
                progressLine.style.width = `${currentWidth}%`;
            }

            // Geofence Trigger (< 1km)
            if (dist < 1000 && !isGeofenceTriggered) {
                isGeofenceTriggered = true;
                showAlert();
            }

            requestAnimationFrame(animateTruck);
        } else {
            etaCountdownEl.textContent = "¡Ha llegado!";
            etaCountdownEl.style.color = "#10b981";
            
            // --- Actualizar Estados Finales ---
            if (stepItems && stepItems.length >= 4) {
                // Paso 3 (En Tránsito) -> Completado
                const inTransitStep = stepItems[2];
                inTransitStep.classList.remove('active');
                inTransitStep.classList.add('completed');
                const inTransitDate = inTransitStep.querySelector('.step-date');
                if (inTransitDate) inTransitDate.textContent = 'Completado';

                // Paso 4 (Entregado) -> Completado (Verde)
                const deliveredStep = stepItems[3];
                deliveredStep.classList.add('completed');
                const deliveredDate = deliveredStep.querySelector('.step-date');
                if (deliveredDate) deliveredDate.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                // Asegurar barra al 100%
                if (progressLine) progressLine.style.width = '100%';

                // Actualizar Badge lateral
                const statusBadge = document.querySelector('.status-badge');
                if (statusBadge) {
                    statusBadge.className = 'status-badge'; // Reset
                    statusBadge.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
                    statusBadge.style.color = '#10b981';
                    statusBadge.textContent = 'Entregado';
                }
            }
        }
    }

    // Iniciar simulación después de 1 segundo
    setTimeout(animateTruck, 1000);

    function showAlert() {
        alertEl.classList.add('show');
        // Sonido de notificación opcional
        // new Audio('notification.mp3').play().catch(e => {});
        
        setTimeout(() => {
            alertEl.classList.remove('show');
        }, 8000);
    }

    // --- Funcionalidad de Botones ---

    // 1. Botón Pickup Points
    const btnPickup = document.getElementById('btnPickup');
    let pickupVisible = false;

    btnPickup.addEventListener('click', () => {
        pickupVisible = !pickupVisible;
        btnPickup.classList.toggle('active');

        if (pickupVisible) {
            // Añadir puntos simulados cercanos
            const p1 = [19.4250, -99.1500];
            const p2 = [19.4200, -99.1600];
            
            const m1 = L.marker(p1, { icon: pickupIcon }).addTo(map).bindPopup("<b>Tienda Aliada: OXXO</b><br>Cierra 10:00 PM<br><button style='margin-top:5px; cursor:pointer;'>Cambiar aquí</button>");
            const m2 = L.marker(p2, { icon: pickupIcon }).addTo(map).bindPopup("<b>Locker Inteligente</b><br>24/7 Disponible<br><button style='margin-top:5px; cursor:pointer;'>Cambiar aquí</button>");
            
            pickupMarkers.push(m1, m2);
            map.fitBounds(L.latLngBounds([startCoords, endCoords, p1, p2]));
        } else {
            pickupMarkers.forEach(m => map.removeLayer(m));
            pickupMarkers = [];
        }
    });

    // 2. Botón Heatmap (Historial) - Simulación visual
    const btnHeatmap = document.getElementById('btnHeatmap');
    let heatmapVisible = false;

    btnHeatmap.addEventListener('click', () => {
        heatmapVisible = !heatmapVisible;
        btnHeatmap.classList.toggle('active');

        if (heatmapVisible) {
            // Simular heatmap con círculos semitransparentes
            // En producción usaría leaflet.heat
            const h1 = L.circle([19.4200, -99.1400], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.3,
                radius: 800,
                stroke: false
            }).addTo(map);
            
            const h2 = L.circle([19.4300, -99.1600], {
                color: 'orange',
                fillColor: '#f59e0b',
                fillOpacity: 0.3,
                radius: 600,
                stroke: false
            }).addTo(map);

            heatmapLayer = L.layerGroup([h1, h2]);
            map.addLayer(heatmapLayer);
            
            alert("Mostrando zonas frecuentes de entrega");
        } else {
            if (heatmapLayer) {
                map.removeLayer(heatmapLayer);
            }
        }
    });

    // 3. Botón Track (Centrar)
    document.getElementById('btnTrack').addEventListener('click', () => {
        map.setView(truckMarker.getLatLng(), 15);
    });
});
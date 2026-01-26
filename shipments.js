// Elementos del DOM
const trackingInput = document.getElementById('trackingNumber');
const searchBtn = document.getElementById('searchBtn');
const resultsSection = document.getElementById('resultsSection');
const emptyState = document.getElementById('emptyState');
const displayTrackingNumber = document.getElementById('displayTrackingNumber');
const statusBadge = document.getElementById('statusBadge');

// Datos de ejemplo de envíos
const shipmentsData = {
  '1234567890123456789012': {
    carrier: 'Estafeta',
    status: 'in-transit',
    statusText: 'En Tránsito',
    estimatedDate: '25 Enero 2026',
    lastLocation: 'Centro de Distribución CDMX',
    lastUpdate: 'Hoy, 10:30 AM',
    packageType: 'Tarjeta de Crédito',
    weight: '0.05 kg',
    insurance: 'Incluido',
    signatureRequired: 'Sí',
    timeline: [
      {
        time: 'Hoy, 10:30 AM',
        title: 'En tránsito a destino',
        location: 'Centro de Distribución CDMX',
        status: 'active'
      },
      {
        time: '23 Ene, 3:45 PM',
        title: 'Paquete en centro de distribución',
        location: 'Hub Querétaro',
        status: 'completed'
      },
      {
        time: '22 Ene, 8:20 AM',
        title: 'Paquete recolectado',
        location: 'Oficina MyCard - Monterrey',
        status: 'completed'
      },
      {
        time: '21 Ene, 2:00 PM',
        title: 'Orden creada',
        location: 'Sistema MyCard',
        status: 'completed'
      }
    ]
  },
  '9876543210': {
    carrier: 'DHL',
    status: 'delivered',
    statusText: 'Entregado',
    estimatedDate: '24 Enero 2026',
    lastLocation: 'Entregado - Domicilio',
    lastUpdate: 'Ayer, 2:15 PM',
    packageType: 'Tarjeta de Crédito',
    weight: '0.05 kg',
    insurance: 'Incluido',
    signatureRequired: 'Sí',
    timeline: [
      {
        time: 'Ayer, 2:15 PM',
        title: 'Paquete entregado',
        location: 'Domicilio del cliente',
        status: 'completed'
      },
      {
        time: 'Ayer, 9:00 AM',
        title: 'En ruta de entrega',
        location: 'Vehículo de reparto',
        status: 'completed'
      },
      {
        time: '23 Ene, 6:30 PM',
        title: 'Llegó a centro local',
        location: 'Centro DHL Local',
        status: 'completed'
      },
      {
        time: '22 Ene, 11:00 AM',
        title: 'Paquete recolectado',
        location: 'Oficina MyCard',
        status: 'completed'
      }
    ]
  },
  '123456789012': {
    carrier: 'FedEx',
    status: 'pending',
    statusText: 'Pendiente de Recolección',
    estimatedDate: '26 Enero 2026',
    lastLocation: 'Oficina MyCard - Tequisquiapan',
    lastUpdate: 'Hoy, 8:00 AM',
    packageType: 'Tarjeta de Crédito',
    weight: '0.05 kg',
    insurance: 'Incluido',
    signatureRequired: 'Sí',
    timeline: [
      {
        time: 'Hoy, 8:00 AM',
        title: 'Esperando recolección',
        location: 'Oficina MyCard - Tequisquiapan',
        status: 'active'
      },
      {
        time: 'Ayer, 4:30 PM',
        title: 'Orden creada',
        location: 'Sistema MyCard',
        status: 'completed'
      }
    ]
  }
};

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
trackingInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

// Formatear input mientras se escribe
trackingInput.addEventListener('input', (e) => {
  // Solo permitir números
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// Función principal de búsqueda
function handleSearch() {
  const trackingNumber = trackingInput.value.trim();
  
  // Validar que no esté vacío
  if (!trackingNumber) {
    showError('Por favor ingresa un número de guía');
    return;
  }
  
  // Validar longitud
  if (trackingNumber.length < 10) {
    showError('El número de guía debe tener al menos 10 dígitos');
    return;
  }
  
  // Buscar el envío
  const shipment = shipmentsData[trackingNumber];
  
  if (shipment) {
    displayShipmentInfo(trackingNumber, shipment);
  } else {
    showNotFound();
  }
}

// Mostrar información del envío
function displayShipmentInfo(trackingNumber, shipment) {
  // Ocultar empty state
  emptyState.style.display = 'none';
  
  // Mostrar sección de resultados
  resultsSection.style.display = 'block';
  
  // Actualizar número de guía
  displayTrackingNumber.textContent = trackingNumber;
  
  // Actualizar status badge
  statusBadge.className = `status-badge ${shipment.status}`;
  statusBadge.innerHTML = `
    <i class="fas fa-circle"></i>
    <span>${shipment.statusText}</span>
  `;
  
  // Actualizar detalles
  document.getElementById('carrier').textContent = shipment.carrier;
  document.getElementById('estimatedDate').textContent = shipment.estimatedDate;
  document.getElementById('lastLocation').textContent = shipment.lastLocation;
  document.getElementById('lastUpdate').textContent = shipment.lastUpdate;
  
  // Actualizar timeline
  updateTimeline(shipment.timeline);
  
  // Scroll suave a los resultados
  setTimeout(() => {
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
  
  console.log('✅ Envío encontrado:', trackingNumber);
}

// Actualizar timeline
function updateTimeline(timelineData) {
  const timeline = document.getElementById('timeline');
  timeline.innerHTML = '';
  
  timelineData.forEach(item => {
    const timelineItem = document.createElement('div');
    timelineItem.className = `timeline-item ${item.status}`;
    
    timelineItem.innerHTML = `
      <div class="timeline-marker">
        <i class="fas fa-check"></i>
      </div>
      <div class="timeline-content">
        <div class="timeline-time">${item.time}</div>
        <div class="timeline-title">${item.title}</div>
        <div class="timeline-location">${item.location}</div>
      </div>
    `;
    
    timeline.appendChild(timelineItem);
  });
}

// Mostrar error
function showError(message) {
  // Crear notificación de error
  const notification = document.createElement('div');
  notification.className = 'notification error';
  notification.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <span>${message}</span>
  `;
  
  // Agregar estilos inline
  notification.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    background: #ef4444;
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  // Remover después de 3 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
  
  // Agregar animaciones si no existen
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
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
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Mostrar no encontrado
function showNotFound() {
  // Crear notificación de no encontrado
  const notification = document.createElement('div');
  notification.className = 'notification warning';
  notification.innerHTML = `
    <i class="fas fa-search"></i>
    <div>
      <strong>Envío no encontrado</strong>
      <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">
        Verifica el número de guía e intenta nuevamente. 
        <br>Números de ejemplo: 1234567890123456789012, 9876543210, 123456789012
      </p>
    </div>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    background: #f59e0b;
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(245, 158, 11, 0.3);
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-weight: 500;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
    max-width: 400px;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Animación de entrada para elementos
window.addEventListener('load', () => {
  console.log('✅ Página de Shipments cargada');
  console.log('📦 Números de guía de ejemplo disponibles:');
  console.log('   - 1234567890123456789012 (Estafeta - En Tránsito)');
  console.log('   - 9876543210 (DHL - Entregado)');
  console.log('   - 123456789012 (FedEx - Pendiente)');
});

// Auto-focus en el input al cargar
trackingInput.focus();

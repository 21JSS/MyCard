// Datos de ejemplo de envíos
const shipmentsData = {
  "1234567890123456789012": {
    carrier: "Estafeta",
    status: "in-transit",
    statusText: "En Tránsito",
    estimatedDate: "25 Enero 2026",
    lastLocation: "Centro de Distribución CDMX",
    lastUpdate: "Hoy, 10:30 AM",
    packageType: "Tarjeta de Crédito",
    weight: "0.05 kg",
    insurance: "Incluido",
    signatureRequired: "Sí",
    timeline: [
      {
        time: "Hoy, 10:30 AM",
        title: "En tránsito a destino",
        location: "Centro de Distribución CDMX",
        status: "active",
      },
      {
        time: "23 Ene, 3:45 PM",
        title: "Paquete en centro de distribución",
        location: "Hub Querétaro",
        status: "completed",
      },
      {
        time: "22 Ene, 8:20 AM",
        title: "Paquete recolectado",
        location: "Oficina MyCard - Monterrey",
        status: "completed",
      },
      {
        time: "21 Ene, 2:00 PM",
        title: "Orden creada",
        location: "Sistema MyCard",
        status: "completed",
      },
    ],
  },
  9876543210: {
    carrier: "DHL",
    status: "delivered",
    statusText: "Entregado",
    estimatedDate: "24 Enero 2026",
    lastLocation: "Entregado - Domicilio",
    lastUpdate: "Ayer, 2:15 PM",
    packageType: "Tarjeta de Crédito",
    weight: "0.05 kg",
    insurance: "Incluido",
    signatureRequired: "Sí",
    timeline: [
      {
        time: "Ayer, 2:15 PM",
        title: "Paquete entregado",
        location: "Domicilio del cliente",
        status: "completed",
      },
      {
        time: "Ayer, 9:00 AM",
        title: "En ruta de entrega",
        location: "Vehículo de reparto",
        status: "completed",
      },
      {
        time: "23 Ene, 6:30 PM",
        title: "Llegó a centro local",
        location: "Centro DHL Local",
        status: "completed",
      },
      {
        time: "22 Ene, 11:00 AM",
        title: "Paquete recolectado",
        location: "Oficina MyCard",
        status: "completed",
      },
    ],
  },
  123456789012: {
    carrier: "FedEx",
    status: "pending",
    statusText: "Pendiente de Recolección",
    estimatedDate: "26 Enero 2026",
    lastLocation: "Oficina MyCard - Tequisquiapan",
    lastUpdate: "Hoy, 8:00 AM",
    packageType: "Tarjeta de Crédito",
    weight: "0.05 kg",
    insurance: "Incluido",
    signatureRequired: "Sí",
    timeline: [
      {
        time: "Hoy, 8:00 AM",
        title: "Esperando recolección",
        location: "Oficina MyCard - Tequisquiapan",
        status: "active",
      },
      {
        time: "Ayer, 4:30 PM",
        title: "Orden creada",
        location: "Sistema MyCard",
        status: "completed",
      },
    ],
  },
};

// Inicialización segura
document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const trackingInput = document.getElementById("trackingNumber");
  const searchBtn = document.getElementById("searchBtn");

  // Función de redirección a tracking.html
  function redirectToTracking() {
    if (!trackingInput) return;
    const trackingNum = trackingInput.value.trim();

    // Redirigir a tracking.html con el número de guía
    window.location.href = `tracking.html?guide=${trackingNum || "MX-DEMO"}`;
  }

  // Event Listeners
  if (searchBtn) {
    searchBtn.addEventListener("click", redirectToTracking);
  }

  if (trackingInput) {
    // Al presionar Enter, redirigir a tracking.html
    trackingInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        redirectToTracking();
      }
    });

    // Permitir solo números
    trackingInput.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, "");
    });

    // Auto-focus en el input
    trackingInput.focus();
  }

  console.log(
    "✅ Página de Shipments cargada - Solo redirección a tracking.html",
  );
});

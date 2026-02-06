// Configuración global de Chart.js
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = "#64748b";

// Datos de ejemplo por trimestre
const quarterlyData = {
  "Q2-2025": {
    successRate: 94.5,
    returnRate: 2.3,
    exceptions: 45,
    totalVolume: 1847,
    delivered: 1745,
    returns: 42,
    trendData: {
      labels: ["Abril", "Mayo", "Junio"],
      otd: [93, 95, 96],
      returns: [3, 2.5, 1.8],
    },
    carrierData: {
      carriers: ["Estafeta", "DHL", "FedEx", "UPS", "Redpack"],
      success: [95, 97, 92, 94, 89],
      returns: [2, 1.5, 3.5, 2.5, 4.2],
    },
  },
  "Q1-2025": {
    successRate: 92.8,
    returnRate: 3.1,
    exceptions: 58,
    totalVolume: 1654,
    delivered: 1535,
    returns: 51,
    trendData: {
      labels: ["Enero", "Febrero", "Marzo"],
      otd: [91, 93, 94],
      returns: [4, 3.2, 2.1],
    },
    carrierData: {
      carriers: ["Estafeta", "DHL", "FedEx", "UPS", "Redpack"],
      success: [93, 96, 90, 92, 87],
      returns: [3, 2, 4, 3.5, 5],
    },
  },
  "Q4-2024": {
    successRate: 91.2,
    returnRate: 3.8,
    exceptions: 72,
    totalVolume: 1923,
    delivered: 1754,
    returns: 73,
    trendData: {
      labels: ["Octubre", "Noviembre", "Diciembre"],
      otd: [90, 91, 93],
      returns: [4.5, 3.8, 3.1],
    },
    carrierData: {
      carriers: ["Estafeta", "DHL", "FedEx", "UPS", "Redpack"],
      success: [92, 95, 88, 91, 85],
      returns: [3.5, 2.5, 5, 4, 6],
    },
  },
  "Q3-2024": {
    successRate: 93.5,
    returnRate: 2.8,
    exceptions: 51,
    totalVolume: 1789,
    delivered: 1673,
    returns: 50,
    trendData: {
      labels: ["Julio", "Agosto", "Septiembre"],
      otd: [92, 94, 95],
      returns: [3.5, 2.8, 2.1],
    },
    carrierData: {
      carriers: ["Estafeta", "DHL", "FedEx", "UPS", "Redpack"],
      success: [94, 96, 91, 93, 88],
      returns: [2.5, 1.8, 4, 3, 4.5],
    },
  },
};

// Variables globales para los gráficos
let trendChart = null;
let carrierChart = null;

// Elementos del DOM
const quarterSelect = document.getElementById("quarterSelect");
const generateReportBtn = document.getElementById("generateReport");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");

// Inicializar la página
window.addEventListener("load", () => {
  // Cargar datos del trimestre seleccionado
  updateDashboard("Q2-2025");

  // Inicializar círculos de paqueterías con todos los trimestres
  updateCarrierCircleCharts();

  // Establecer fechas por defecto
  const today = new Date();
  const lastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate(),
  );

  endDateInput.valueAsDate = today;
  startDateInput.valueAsDate = lastMonth;

  // Inicializar nuevas gráficas de tendencia y estado
  initShipmentsTimelineChart();
  initStatusDistributionChart();

  console.log("✅ Página de Analytics cargada");
});

// Event Listeners
quarterSelect.addEventListener("change", (e) => {
  updateDashboard(e.target.value);
});

generateReportBtn.addEventListener("click", generateReport);

// Función principal para actualizar el dashboard
function updateDashboard(quarter) {
  const data = quarterlyData[quarter];

  // Actualizar métricas
  updateMetrics(data);

  // Actualizar gráficos
  updateTrendChart(data.trendData);
  // Ya no llamamos a updateCarrierChart(data.carrierData) aquí

  console.log(`📊 Dashboard actualizado para ${quarter}`);
}

// Actualizar métricas trimestrales
function updateMetrics(data) {
  // Animar valores
  animateValue(
    document.getElementById("successRate"),
    0,
    data.successRate,
    1000,
    "%",
  );
  animateValue(
    document.getElementById("returnRate"),
    0,
    data.returnRate,
    1000,
    "%",
  );
  animateValue(
    document.getElementById("exceptionCount"),
    0,
    data.exceptions,
    1000,
    "",
  );
  animateValue(
    document.getElementById("totalVolume"),
    0,
    data.totalVolume,
    1000,
    "",
  );

  // Actualizar detalles
  document.getElementById("deliveredCount").textContent = data.delivered;
  document.getElementById("returnCount").textContent = data.returns;

  const exceptionPercent = ((data.exceptions / data.totalVolume) * 100).toFixed(
    1,
  );
  document.getElementById("exceptionPercent").textContent =
    exceptionPercent + "%";
}

// Función de animación de valores
function animateValue(element, start, end, duration, suffix = "") {
  const startTime = performance.now();
  const isDecimal = end % 1 !== 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const current = start + (end - start) * progress;
    const displayValue = isDecimal ? current.toFixed(1) : Math.floor(current);

    element.textContent = displayValue + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Actualizar gráfico de tendencia
function updateTrendChart(data) {
  const ctx = document.getElementById("trendChart");

  if (trendChart) {
    trendChart.destroy();
  }

  // Crear gradientes
  const canvasCtx = ctx.getContext("2d");

  const gradientGreen = canvasCtx.createLinearGradient(0, 0, 0, 300);
  gradientGreen.addColorStop(0, "rgba(16, 185, 129, 0.3)");
  gradientGreen.addColorStop(1, "rgba(16, 185, 129, 0.01)");

  const gradientRed = canvasCtx.createLinearGradient(0, 0, 0, 300);
  gradientRed.addColorStop(0, "rgba(239, 68, 68, 0.3)");
  gradientRed.addColorStop(1, "rgba(239, 68, 68, 0.01)");

  trendChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "OTD % (Éxito)",
          data: data.otd,
          borderColor: "#10b981",
          backgroundColor: gradientGreen,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "#10b981",
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 3,
        },
        {
          label: "Retorno % (Problema)",
          data: data.returns,
          borderColor: "#ef4444",
          backgroundColor: gradientRed,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "#ef4444",
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          mode: "index",
          intersect: false,
          backgroundColor: "#ffffff",
          titleColor: "#1e293b",
          bodyColor: "#64748b",
          borderColor: "#e2e8f0",
          borderWidth: 1,
          padding: 12,
          borderRadius: 8,
          titleFont: {
            size: 13,
            weight: "600",
          },
          bodyFont: {
            size: 14,
            weight: "600",
          },
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function (context) {
              return context.dataset.label + ": " + context.parsed.y + "%";
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            font: {
              size: 12,
              weight: "500",
            },
            color: "#64748b",
          },
        },
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: "#f1f5f9",
            drawBorder: false,
          },
          ticks: {
            font: {
              size: 12,
            },
            color: "#94a3b8",
            callback: function (value) {
              return value + "%";
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    },
  });
}

// Actualizar gráfico de paqueterías - DEPRECADO (mantenido para compatibilidad)
function updateCarrierChart(data) {
  // Esta función ahora está vacía ya que usamos updateCarrierCircleCharts
  // Se mantiene para evitar errores
}

// Nueva función para actualizar los círculos de paqueterías con anillos concéntricos múltiples (Activity Rings)
function updateCarrierCircleCharts() {
  // Colores vibrantes para cada trimestre - MISMO ORDEN que en la leyenda
  const quarterColors = [
    "#00c2ff", // Q2-2025: Cyan brillante (anillo externo)
    "#ff00ff", // Q1-2025: Magenta (anillo medio-exterior)
    "#ffd700", // Q4-2024: Amarillo/Dorado (anillo medio-interior)
    "#00ff7f", // Q3-2024: Verde brillante (anillo interno)
  ];

  const quarters = ["Q2-2025", "Q1-2025", "Q4-2024", "Q3-2024"];
  const carriers = ["Estafeta", "DHL", "FedEx", "UPS", "Redpack"];

  carriers.forEach((carrier, carrierIndex) => {
    const canvasId = `carrierChart${carrierIndex + 1}`;
    const ctx = document.getElementById(canvasId);

    if (!ctx) return;

    // Obtener datos de éxito para cada trimestre de esta paquetería
    const successData = quarters.map((quarter) => {
      return quarterlyData[quarter].carrierData.success[carrierIndex];
    });

    // Crear datasets para cada anillo (4 anillos concéntricos)
    const datasets = [];

    // Cada anillo tiene su propio dataset
    quarters.forEach((quarter, index) => {
      const value = successData[index];
      const remaining = 100 - value;

      datasets.push({
        label: quarter,
        data: [value, remaining],
        backgroundColor: [
          quarterColors[index],
          "rgba(200, 200, 200, 0.15)", // Color gris muy tenue para la parte no completada
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
        hoverOffset: 0,
        spacing: 0,
        // Configuración para crear anillos concéntricos
        weight: 1, // Todos los anillos tienen el mismo grosor
        // Almacenar el valor para usarlo en el tooltip
        quarterValue: value,
        quarterName: quarter,
      });
    });

    new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: datasets.reverse(), // Invertimos para que el más externo sea Q2-2025
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: "40%", // Ajustado para los 4 anillos concéntricos
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            external: function (context) {
              // Obtener el logo central de esta paquetería
              const logoEl = ctx.parentNode.querySelector(
                ".circle-center-logo",
              );

              // Crear o obtener el elemento del tooltip
              let tooltipEl = document.getElementById(
                "chartjs-tooltip-" + canvasId,
              );

              // Crear elemento si no existe
              if (!tooltipEl) {
                tooltipEl = document.createElement("div");
                tooltipEl.id = "chartjs-tooltip-" + canvasId;
                tooltipEl.style.cssText = `
                  position: absolute;
                  background: rgba(30, 41, 59, 0.95);
                  color: white;
                  border: 1px solid #475569;
                  border-radius: 8px;
                  padding: 12px;
                  pointer-events: none;
                  font-family: 'Inter', sans-serif;
                  font-size: 14px;
                  font-weight: 600;
                  transition: all 0.2s ease;
                  z-index: 9999;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                `;
                ctx.parentNode.parentNode.appendChild(tooltipEl);
              }

              // Ocultar si el tooltip debe estar oculto
              const tooltipModel = context.tooltip;
              if (tooltipModel.opacity === 0) {
                tooltipEl.style.opacity = 0;
                // Mostrar el logo nuevamente cuando el tooltip se oculta
                if (logoEl) {
                  logoEl.style.visibility = "visible";
                  logoEl.style.opacity = "";
                  console.log(`Tooltip oculto - Logo ${carrier} visible`);
                }
                return;
              }

              // Ocultar el logo cuando el tooltip está visible
              if (logoEl) {
                logoEl.style.visibility = "hidden";
                console.log(
                  `Tooltip visible - Logo ${carrier} OCULTO (visibility hidden)`,
                );
              } else {
                console.error(
                  `No se encontró logoEl para ${carrier} en tooltip`,
                );
              }

              // Establecer contenido del tooltip
              if (
                tooltipModel.dataPoints &&
                tooltipModel.dataPoints.length > 0
              ) {
                const dataPoint = tooltipModel.dataPoints[0];
                const datasetIndex = dataPoint.datasetIndex;
                const quarter = quarters[datasets.length - 1 - datasetIndex]; // Ajustar por el reverse
                const value = successData[datasets.length - 1 - datasetIndex];

                let innerHtml =
                  '<div style="margin-bottom: 4px; font-weight: 700; font-size: 13px;">';
                innerHtml += carrier;
                innerHtml += "</div>";
                innerHtml += "<div>" + quarter + ": " + value + "%</div>";

                tooltipEl.innerHTML = innerHtml;
              }

              // Posicionar el tooltip
              const position = context.chart.canvas.getBoundingClientRect();
              const tooltipWidth = tooltipEl.offsetWidth;
              const tooltipHeight = tooltipEl.offsetHeight;

              // Calcular posición para que aparezca en el centro del gráfico
              let left =
                position.left + window.pageXOffset + position.width / 2;
              let top = position.top + window.pageYOffset + position.height / 2;

              // Centrar el tooltip
              left = left - tooltipWidth / 2;
              top = top - tooltipHeight / 2;

              // Asegurar que no se salga de la pantalla
              if (left < 0) left = 10;
              if (left + tooltipWidth > window.innerWidth)
                left = window.innerWidth - tooltipWidth - 10;
              if (top < 0) top = 10;

              tooltipEl.style.opacity = 1;
              tooltipEl.style.left = left + "px";
              tooltipEl.style.top = top + "px";
            },
            callbacks: {
              title: function (context) {
                return carrier;
              },
              label: function (context) {
                // Solo mostrar si es el segmento de valor (completado)
                if (context.dataIndex === 0) {
                  const dataset = context.dataset;
                  const quarterName = dataset.quarterName || dataset.label;
                  const quarterValue = dataset.quarterValue || context.parsed;
                  return `${quarterName}: ${quarterValue}%`;
                }
                return null;
              },
            },
          },
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500,
          easing: "easeInOutQuart",
        },
      },
    });

    // Asegurar que el logo esté visible al inicio con !important
    const logoEl = ctx.parentNode.querySelector(".circle-center-logo");
    if (logoEl) {
      logoEl.style.setProperty("opacity", "1", "important");
      logoEl.style.transition = "opacity 0.3s ease";
      logoEl.style.display = "flex";
      logoEl.style.visibility = "visible";
      console.log(`Logo ${carrier} inicializado`);
    } else {
      console.error(`No se encontró logo para ${carrier}`);
    }

    // Evento para restaurar el logo cuando el mouse sale del canvas completamente
    ctx.addEventListener("mouseleave", function () {
      setTimeout(() => {
        if (logoEl) {
          logoEl.style.visibility = "visible";
          logoEl.style.opacity = "";
          console.log(`Mouse salió de ${carrier} - Logo restaurado`);
        }
      }, 100); // Small delay para permitir que el tooltip se oculte primero
    });
  });

  console.log("✅ Todos los Activity Rings han sido creados");
}

// Generar reporte PDF
function generateReport() {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (!startDate || !endDate) {
    showNotification("Por favor selecciona ambas fechas", "error");
    return;
  }

  if (new Date(startDate) > new Date(endDate)) {
    showNotification(
      "La fecha de inicio debe ser anterior a la fecha fin",
      "error",
    );
    return;
  }

  // Simular generación de reporte
  showNotification("Generando reporte PDF...", "info");

  setTimeout(() => {
    showNotification("Reporte generado exitosamente", "success");
    console.log(`📄 Reporte generado: ${startDate} a ${endDate}`);
  }, 2000);
}

// Mostrar notificación
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;

  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    info: "fa-info-circle",
  };

  const colors = {
    success: "#10b981",
    error: "#ef4444",
    info: "#6366f1",
  };

  notification.innerHTML = `
    <i class="fas ${icons[type]}"></i>
    <span>${message}</span>
  `;

  notification.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    background: ${colors[type]};
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    gap: 12px;
    font-weight: 600;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  }, 3000);

  // Agregar animaciones si no existen
  if (!document.getElementById("notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
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

console.log("📊 Analytics Dashboard inicializado");
console.log("📈 Datos disponibles para Q1-Q4 2024 y Q1-Q2 2025");

// ===== NUEVAS GRÁFICAS =====

function initShipmentsTimelineChart() {
  const shipmentsTimelineCtx = document.getElementById("shipmentsTimelineChart");
  if (shipmentsTimelineCtx) {
    const ctx = shipmentsTimelineCtx.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(99, 102, 241, 0.4)");
    gradient.addColorStop(1, "rgba(99, 102, 241, 0.0)");

    new Chart(shipmentsTimelineCtx, {
      type: "line",
      data: {
        labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
        datasets: [{
          label: "Tarjetas Enviadas",
          data: [45, 52, 48, 61, 58, 67, 72],
          borderColor: "#6366f1",
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: "#ffffff",
          pointBorderColor: "#6366f1",
          pointBorderWidth: 2,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "#6366f1",
          pointHoverBorderColor: "#ffffff",
          pointHoverBorderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#ffffff",
            titleColor: "#1e293b",
            bodyColor: "#64748b",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            padding: 12,
            titleFont: { size: 13, family: "'Inter', sans-serif", weight: "600" },
            bodyFont: { size: 13, family: "'Inter', sans-serif", weight: "500" },
            displayColors: false,
            callbacks: {
              label: function (context) {
                return `Volumen: ${context.parsed.y} envíos`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "#f1f5f9", borderDash: [5, 5] },
            ticks: { font: { size: 11, family: "'Inter', sans-serif", weight: "500" }, color: "#94a3b8" },
            border: { display: false },
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11, family: "'Inter', sans-serif", weight: "500" }, color: "#94a3b8" },
            border: { display: false },
          },
        },
      },
    });
  }
}

function initStatusDistributionChart() {
  const statusDistributionCtx = document.getElementById("statusDistributionChart");
  if (statusDistributionCtx) {
    new Chart(statusDistributionCtx, {
      type: "doughnut",
      data: {
        labels: ["Entregados", "En Tránsito", "Excepción", "Retornos"],
        datasets: [{
          data: [65, 20, 10, 5],
          backgroundColor: [
            "#10b981", // verde
            "#3b82f6", // azul
            "#f59e0b", // naranja
            "#ef4444", // rojo
          ],
          borderWidth: 2,
          borderColor: "#ffffff",
          hoverOffset: 10,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            position: "right",
            labels: {
              padding: 20,
              font: { size: 12, family: "'Inter', sans-serif", weight: "500" },
              usePointStyle: true,
              pointStyle: "circle",
              color: "#64748b",
            },
          },
          tooltip: {
            backgroundColor: "#ffffff",
            titleColor: "#1e293b",
            bodyColor: "#64748b",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            padding: 12,
            bodyFont: { size: 13, family: "'Inter', sans-serif", weight: "500" },
            callbacks: {
              label: function (context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return ` ${context.label}: ${percentage}% (${context.parsed})`;
              },
            },
          },
        },
      },
    });
  }
}

// Event Listener para Filtros
const applyFiltersBtn = document.getElementById("applyFilters");
if (applyFiltersBtn) {
  applyFiltersBtn.addEventListener("click", () => {
    const dateRange = document.getElementById("dateRange").value;
    const carrier = document.getElementById("carrierFilter").value;
    const status = document.getElementById("statusFilter").value;

    console.log("Aplicando filtros:", { dateRange, carrier, status });

    // Mostrar notificación
    showNotification("Filtros aplicados correctamente", "success");

    // Aquí iría la lógica para actualizar las gráficas con los filtros
    // Por ahora solo mostramos un mensaje
  });
}

console.log("✅ Nuevas gráficas de Analytics cargadas");

// ===== ANÁLISIS GEOGRÁFICO (SIMULACIÓN) =====

const geoCtx = document.getElementById("geoHeatmapChart");
if (geoCtx) {
  // Simulación de coordenadas relativas en un mapa abstracto de México
  // X: Longitud aprox, Y: Latitud aprox (invertida para canvas a veces, pero aquí normal)
  const geoData = [
    { x: 50, y: 45, r: 25, city: "Centro (CDMX/EdoMex)", value: 850 }, // Centro - Gran volumen
    { x: 45, y: 55, r: 15, city: "Bajío (Guadalajara/León)", value: 420 }, // Bajío
    { x: 48, y: 75, r: 12, city: "Norte (Monterrey)", value: 310 }, // Monterrey
    { x: 20, y: 85, r: 8, city: "Noroeste (Tijuana)", value: 120 }, // Tijuana
    { x: 85, y: 40, r: 8, city: "Sureste (Cancún/Mérida)", value: 147 }, // Cancún
    { x: 65, y: 30, r: 6, city: "Sur (Oaxaca/Chiapas)", value: 80 }, // Sur
  ];

  new Chart(geoCtx, {
    type: "bubble",
    data: {
      datasets: [
        {
          label: "Volumen de Envíos",
          data: geoData,
          backgroundColor: [
            "rgba(239, 68, 68, 0.6)", // Rojo intenso (Centro)
            "rgba(245, 158, 11, 0.6)", // Naranja (Bajío)
            "rgba(245, 158, 11, 0.5)", // Naranja suave (Norte)
            "rgba(16, 185, 129, 0.5)", // Verde (Noroeste)
            "rgba(16, 185, 129, 0.5)", // Verde (Sureste)
            "rgba(59, 130, 246, 0.5)", // Azul (Sur)
          ],
          borderColor: [
            "rgba(239, 68, 68, 1)",
            "rgba(245, 158, 11, 1)",
            "rgba(245, 158, 11, 1)",
            "rgba(16, 185, 129, 1)",
            "rgba(16, 185, 129, 1)",
            "rgba(59, 130, 246, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: false, // Ocultar ejes para simular mapa
          min: 0,
          max: 100,
        },
        y: {
          display: false, // Ocultar ejes
          min: 0,
          max: 100,
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(30, 41, 59, 0.9)",
          padding: 12,
          callbacks: {
            label: function (context) {
              const point = context.raw;
              return `${point.city}: ${point.value} envíos`;
            },
          },
        },
      },
      layout: {
        padding: 20,
      },
    },
  });
}

// Poblar Tabla de Rendimiento Regional
const regionTableBody = document.getElementById("regionTableBody");
if (regionTableBody) {
  const regions = [
    { name: "Centro", time: "1.2 días", diff: "-0.8 días", status: "positive" },
    { name: "Bajío", time: "1.8 días", diff: "-0.2 días", status: "positive" },
    { name: "Norte", time: "3.2 días", diff: "+1.2 días", status: "negative" },
    {
      name: "Sureste",
      time: "3.5 días",
      diff: "+1.5 días",
      status: "negative",
    },
    {
      name: "Noroeste",
      time: "4.1 días",
      diff: "+2.1 días",
      status: "negative",
    },
  ];

  regions.forEach((region) => {
    const tr = document.createElement("tr");

    let badgeClass =
      region.status === "positive" ? "success-text" : "danger-text";
    let badgeBg =
      region.status === "positive"
        ? "rgba(16, 185, 129, 0.1)"
        : "rgba(239, 68, 68, 0.1)";

    tr.innerHTML = `
            <td style="font-weight: 500;">${region.name}</td>
            <td>${region.time}</td>
            <td>
                <span style="background: ${badgeBg}; color: ${region.status === "positive" ? "#10b981" : "#ef4444"}; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                    ${region.diff}
                </span>
            </td>
        `;
    regionTableBody.appendChild(tr);
  });
}

console.log("✅ Análisis Geográfico inicializado");

// Configuración global de Chart.js
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#64748b';

// Datos de ejemplo por trimestre
const quarterlyData = {
  'Q2-2025': {
    successRate: 94.5,
    returnRate: 2.3,
    exceptions: 45,
    totalVolume: 1847,
    delivered: 1745,
    returns: 42,
    trendData: {
      labels: ['Abril', 'Mayo', 'Junio'],
      otd: [93, 95, 96],
      returns: [3, 2.5, 1.8]
    },
    carrierData: {
      carriers: ['Estafeta', 'DHL', 'FedEx', 'UPS', 'Redpack'],
      success: [95, 97, 92, 94, 89],
      returns: [2, 1.5, 3.5, 2.5, 4.2]
    }
  },
  'Q1-2025': {
    successRate: 92.8,
    returnRate: 3.1,
    exceptions: 58,
    totalVolume: 1654,
    delivered: 1535,
    returns: 51,
    trendData: {
      labels: ['Enero', 'Febrero', 'Marzo'],
      otd: [91, 93, 94],
      returns: [4, 3.2, 2.1]
    },
    carrierData: {
      carriers: ['Estafeta', 'DHL', 'FedEx', 'UPS', 'Redpack'],
      success: [93, 96, 90, 92, 87],
      returns: [3, 2, 4, 3.5, 5]
    }
  },
  'Q4-2024': {
    successRate: 91.2,
    returnRate: 3.8,
    exceptions: 72,
    totalVolume: 1923,
    delivered: 1754,
    returns: 73,
    trendData: {
      labels: ['Octubre', 'Noviembre', 'Diciembre'],
      otd: [90, 91, 93],
      returns: [4.5, 3.8, 3.1]
    },
    carrierData: {
      carriers: ['Estafeta', 'DHL', 'FedEx', 'UPS', 'Redpack'],
      success: [92, 95, 88, 91, 85],
      returns: [3.5, 2.5, 5, 4, 6]
    }
  },
  'Q3-2024': {
    successRate: 93.5,
    returnRate: 2.8,
    exceptions: 51,
    totalVolume: 1789,
    delivered: 1673,
    returns: 50,
    trendData: {
      labels: ['Julio', 'Agosto', 'Septiembre'],
      otd: [92, 94, 95],
      returns: [3.5, 2.8, 2.1]
    },
    carrierData: {
      carriers: ['Estafeta', 'DHL', 'FedEx', 'UPS', 'Redpack'],
      success: [94, 96, 91, 93, 88],
      returns: [2.5, 1.8, 4, 3, 4.5]
    }
  }
};

// Variables globales para los gráficos
let trendChart = null;
let carrierChart = null;

// Elementos del DOM
const quarterSelect = document.getElementById('quarterSelect');
const generateReportBtn = document.getElementById('generateReport');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

// Inicializar la página
window.addEventListener('load', () => {
  // Cargar datos del trimestre seleccionado
  updateDashboard('Q2-2025');
  
  // Establecer fechas por defecto
  const today = new Date();
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  
  endDateInput.valueAsDate = today;
  startDateInput.valueAsDate = lastMonth;
  
  console.log('✅ Página de Analytics cargada');
});

// Event Listeners
quarterSelect.addEventListener('change', (e) => {
  updateDashboard(e.target.value);
});

generateReportBtn.addEventListener('click', generateReport);

// Función principal para actualizar el dashboard
function updateDashboard(quarter) {
  const data = quarterlyData[quarter];
  
  // Actualizar métricas
  updateMetrics(data);
  
  // Actualizar gráficos
  updateTrendChart(data.trendData);
  updateCarrierChart(data.carrierData);
  
  console.log(`📊 Dashboard actualizado para ${quarter}`);
}

// Actualizar métricas trimestrales
function updateMetrics(data) {
  // Animar valores
  animateValue(document.getElementById('successRate'), 0, data.successRate, 1000, '%');
  animateValue(document.getElementById('returnRate'), 0, data.returnRate, 1000, '%');
  animateValue(document.getElementById('exceptionCount'), 0, data.exceptions, 1000, '');
  animateValue(document.getElementById('totalVolume'), 0, data.totalVolume, 1000, '');
  
  // Actualizar detalles
  document.getElementById('deliveredCount').textContent = data.delivered;
  document.getElementById('returnCount').textContent = data.returns;
  
  const exceptionPercent = ((data.exceptions / data.totalVolume) * 100).toFixed(1);
  document.getElementById('exceptionPercent').textContent = exceptionPercent + '%';
}

// Función de animación de valores
function animateValue(element, start, end, duration, suffix = '') {
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
  const ctx = document.getElementById('trendChart');
  
  if (trendChart) {
    trendChart.destroy();
  }
  
  // Crear gradientes
  const canvasCtx = ctx.getContext('2d');
  
  const gradientGreen = canvasCtx.createLinearGradient(0, 0, 0, 300);
  gradientGreen.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
  gradientGreen.addColorStop(1, 'rgba(16, 185, 129, 0.01)');
  
  const gradientRed = canvasCtx.createLinearGradient(0, 0, 0, 300);
  gradientRed.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
  gradientRed.addColorStop(1, 'rgba(239, 68, 68, 0.01)');
  
  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'OTD % (Éxito)',
          data: data.otd,
          borderColor: '#10b981',
          backgroundColor: gradientGreen,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#10b981',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 3
        },
        {
          label: 'Retorno % (Problema)',
          data: data.returns,
          borderColor: '#ef4444',
          backgroundColor: gradientRed,
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#ef4444',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: '#ffffff',
          titleColor: '#1e293b',
          bodyColor: '#64748b',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          padding: 12,
          borderRadius: 8,
          titleFont: {
            size: 13,
            weight: '600'
          },
          bodyFont: {
            size: 14,
            weight: '600'
          },
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + context.parsed.y + '%';
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            font: {
              size: 12,
              weight: '500'
            },
            color: '#64748b'
          }
        },
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: '#f1f5f9',
            drawBorder: false
          },
          ticks: {
            font: {
              size: 12
            },
            color: '#94a3b8',
            callback: function(value) {
              return value + '%';
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  });
}

// Actualizar gráfico de paqueterías
function updateCarrierChart(data) {
  const ctx = document.getElementById('carrierChart');
  
  if (carrierChart) {
    carrierChart.destroy();
  }
  
  carrierChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.carriers,
      datasets: [
        {
          label: 'Tasa de Éxito (%)',
          data: data.success,
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: '#10b981',
          borderWidth: 2,
          borderRadius: 6
        },
        {
          label: 'Tasa de Retorno (%)',
          data: data.returns,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: '#ef4444',
          borderWidth: 2,
          borderRadius: 6
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: '#ffffff',
          titleColor: '#1e293b',
          bodyColor: '#64748b',
          borderColor: '#e2e8f0',
          borderWidth: 1,
          padding: 12,
          borderRadius: 8,
          titleFont: {
            size: 13,
            weight: '600'
          },
          bodyFont: {
            size: 14,
            weight: '600'
          },
          boxPadding: 6,
          usePointStyle: true,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + context.parsed.x + '%';
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: '#f1f5f9',
            drawBorder: false
          },
          ticks: {
            font: {
              size: 11
            },
            color: '#94a3b8',
            callback: function(value) {
              return value + '%';
            }
          }
        },
        y: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            font: {
              size: 12,
              weight: '500'
            },
            color: '#64748b'
          }
        }
      }
    }
  });
}

// Generar reporte PDF
function generateReport() {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  
  if (!startDate || !endDate) {
    showNotification('Por favor selecciona ambas fechas', 'error');
    return;
  }
  
  if (new Date(startDate) > new Date(endDate)) {
    showNotification('La fecha de inicio debe ser anterior a la fecha fin', 'error');
    return;
  }
  
  // Simular generación de reporte
  showNotification('Generando reporte PDF...', 'info');
  
  setTimeout(() => {
    showNotification('Reporte generado exitosamente', 'success');
    console.log(`📄 Reporte generado: ${startDate} a ${endDate}`);
  }, 2000);
}

// Mostrar notificación
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle'
  };
  
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#6366f1'
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

console.log('📊 Analytics Dashboard inicializado');
console.log('📈 Datos disponibles para Q1-Q4 2024 y Q1-Q2 2025');

// Configuración global de Chart.js
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#64748b';

// Gráfico de Rendimiento de Entregas (Líneas suaves con áreas)
const performanceCtx = document.getElementById('performanceChart');
if (performanceCtx) {
  // Crear gradientes
  const ctx = performanceCtx.getContext('2d');
  
  const gradientGreen = ctx.createLinearGradient(0, 0, 0, 300);
  gradientGreen.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
  gradientGreen.addColorStop(1, 'rgba(16, 185, 129, 0.01)');
  
  const gradientRed = ctx.createLinearGradient(0, 0, 0, 300);
  gradientRed.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
  gradientRed.addColorStop(1, 'rgba(239, 68, 68, 0.01)');
  
  new Chart(performanceCtx, {
    type: 'line',
    data: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'A Tiempo',
          data: [45, 52, 48, 61, 58, 42, 38],
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
          label: 'Fuera de Tiempo',
          data: [8, 12, 9, 7, 11, 6, 5],
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
              return context.dataset.label + ': ' + context.parsed.y + ' envíos';
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
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
          display: true,
          beginAtZero: true,
          grid: {
            color: '#f1f5f9',
            drawBorder: false
          },
          ticks: {
            font: {
              size: 12
            },
            color: '#94a3b8',
            stepSize: 20
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

/* Animación de Header y Tarjeta al hacer Scroll */
document.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const body = document.body;
    
    // Si bajamos más de 100px (ajusta este número según cuando quieras el efecto)
    if (scrollY > 100) {
        body.classList.add('is-scrolled');
    } else {
        body.classList.remove('is-scrolled');
    }
});

// Gráfico de Alertas (Retornos y Excepciones)
const alertsCtx = document.getElementById('alertsChart');
if (alertsCtx) {
  new Chart(alertsCtx, {
    type: 'bar',
    data: {
      labels: ['Retornos\n(Últ. Sem)', 'Retornos\n(Esta Sem)', 'Excepción\n(Esta Sem)'],
      datasets: [
        {
          label: 'Tasa',
          data: [0.08, 0.05, 0.03],
          backgroundColor: [
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(148, 163, 184, 0.8)'
          ],
          borderColor: [
            '#f59e0b',
            '#ef4444',
            '#94a3b8'
          ],
          borderWidth: 2,
          borderRadius: 8,
          barThickness: 60
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
          backgroundColor: '#1e293b',
          padding: 12,
          borderRadius: 8,
          titleFont: {
            size: 13,
            weight: '600'
          },
          bodyFont: {
            size: 14,
            weight: '700'
          },
          callbacks: {
            label: function(context) {
              return 'Tasa: ' + (context.parsed.y * 100).toFixed(1) + '%';
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            font: {
              size: 11,
              weight: '500'
            },
            color: '#64748b'
          }
        },
        y: {
          display: true,
          beginAtZero: true,
          max: 0.1,
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
              return (value * 100) + '%';
            }
          }
        }
      }
    }
  });
}

// Animación de entrada para las tarjetas
const statCards = document.querySelectorAll('.stat-card');
statCards.forEach((card, index) => {
  card.style.animationDelay = `${index * 0.05}s`;
});

const cards = document.querySelectorAll('.card');
cards.forEach((card, index) => {
  card.style.animationDelay = `${(statCards.length * 0.05) + (index * 0.1)}s`;
});

// Efecto hover en tarjetas de estadísticas
statCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
  });
});

// Animación de números (contador)
function animateValue(element, start, end, duration) {
  if (end === 0) {
    element.textContent = '0';
    return;
  }
  
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Función para actualizar datos del dashboard
function updateDashboardData(data) {
  // Actualizar tarjetas de estadísticas
  if (data.totalEnvios !== undefined) {
    const totalCard = document.querySelector('.stat-card.blue .stat-value');
    if (totalCard) totalCard.textContent = data.totalEnvios;
    
    const totalMeta = document.querySelector('.stat-card.blue .stat-meta');
    if (totalMeta) totalMeta.textContent = 'Últimos 7 días';
  }
  
  if (data.entregados !== undefined) {
    const entregadosCard = document.querySelector('.stat-card.green .stat-value');
    if (entregadosCard) entregadosCard.textContent = data.entregados;
    
    const entregadosMeta = document.querySelector('.stat-card.green .stat-meta');
    if (entregadosMeta) {
      const tasa = data.totalEnvios > 0 ? ((data.entregados / data.totalEnvios) * 100).toFixed(1) : 0;
      entregadosMeta.textContent = `Tasa de Éxito (±4D): ${tasa}%`;
    }
  }
  
  if (data.enTransito !== undefined) {
    const transitoCard = document.querySelector('.stat-card.cyan .stat-value');
    if (transitoCard) transitoCard.textContent = data.enTransito;
    
    const transitoMeta = document.querySelector('.stat-card.cyan .stat-meta');
    if (transitoMeta) {
      const tasa = data.totalEnvios > 0 ? ((data.enTransito / data.totalEnvios) * 100).toFixed(1) : 0;
      transitoMeta.textContent = `Tasa: ${tasa}%`;
    }
  }
  
  if (data.excepcion !== undefined) {
    const excepcionCard = document.querySelector('.stat-card.orange .stat-value');
    if (excepcionCard) excepcionCard.textContent = data.excepcion;
    
    const excepcionMeta = document.querySelector('.stat-card.orange .stat-meta');
    if (excepcionMeta) {
      const tasa = data.totalEnvios > 0 ? ((data.excepcion / data.totalEnvios) * 100).toFixed(1) : 0;
      excepcionMeta.textContent = `Tasa de Excepción (±4D): ${tasa}%`;
    }
  }
  
  if (data.retornos !== undefined) {
    const retornosCard = document.querySelector('.stat-card.red .stat-value');
    if (retornosCard) retornosCard.textContent = data.retornos;
    
    const retornosMeta = document.querySelector('.stat-card.red .stat-meta');
    if (retornosMeta) {
      const tasa = data.totalEnvios > 0 ? ((data.retornos / data.totalEnvios) * 100).toFixed(1) : 0;
      retornosMeta.textContent = `Tasa de Retorno (±4D): ${tasa}%`;
    }
  }
  
  // Actualizar valores de alertas
  const alertValues = document.querySelectorAll('.alert-value');
  if (alertValues.length >= 3) {
    alertValues[0].textContent = '8%';  // Retorno última semana
    alertValues[1].textContent = '5%';  // Retorno esta semana
    alertValues[2].textContent = '3%';  // Predicción próxima semana
  }
  
  console.log('✅ Dashboard actualizado con nuevos datos');
}

// Animar valores de estadísticas al cargar la página
window.addEventListener('load', () => {
  // Primero actualizar con datos de ejemplo
  const datosEjemplo = {
    totalEnvios: 402,
    entregados: 344,
    enTransito: 43,
    excepcion: 9,
    retornos: 6
  };
  
  // Actualizar las tarjetas con los datos
  updateDashboardData(datosEjemplo);
  
  // Luego animar los valores
  setTimeout(() => {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach((element, index) => {
      const currentValue = parseInt(element.textContent) || 0;
      if (currentValue > 0) {
        element.textContent = '0';
        setTimeout(() => {
          animateValue(element, 0, currentValue, 1500);
        }, index * 100);
      }
    });
  }, 100);

  // Funcionalidad para el botón/tarjeta CrewdiVale (Redirección a Perfil)
  const crewdiValeCard = document.querySelector('.plata-card');
  if (crewdiValeCard) {
      crewdiValeCard.addEventListener('click', () => {
          window.location.href = 'perfil-usuario.html';
      });
  }

  // Funcionalidad para el botón de perfil (CredVale)
  const userProfileBtn = document.querySelector('.user-profile');
  if (userProfileBtn) {
      userProfileBtn.addEventListener('click', () => {
          window.location.href = 'perfil-usuario.html';
      });
  }
});

// Funcionalidad para redirigir al hacer click en la tarjeta azul de Total de Envíos
document.addEventListener('DOMContentLoaded', () => {
    const totalEnviosCard = document.querySelector('.stat-card.blue');
    if (totalEnviosCard) {
        totalEnviosCard.style.cursor = 'pointer';
        totalEnviosCard.addEventListener('click', () => {
            window.location.href = 'envios-status.html';
        });
    }
});

console.log('✅ Dashboard MyCard cargado correctamente');
console.log('📊 Gráficos inicializados con datos de ejemplo');
console.log('🎨 Animaciones activadas');
console.log('📦 Total de envíos: 402 | Entregados: 344 | En tránsito: 43 | Excepciones: 9 | Retornos: 6');
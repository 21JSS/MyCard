// Elementos del DOM
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const togglePasswordBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const copyBtns = document.querySelectorAll('.copy-btn');
const editProfileBtn = document.getElementById('editProfile');
const changePasswordBtn = document.getElementById('changePassword');
const saveAlertsBtn = document.getElementById('saveAlerts');

// Switches de preferencias
const delayAlertSwitch = document.getElementById('delayAlert');
const deliveryConfirmationSwitch = document.getElementById('deliveryConfirmation');

// Navegación entre tabs
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.dataset.tab;
    
    // Remover active de todos los botones y paneles
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    
    // Activar el botón y panel seleccionado
    btn.classList.add('active');
    document.getElementById(targetTab).classList.add('active');
    
    console.log(`📑 Tab cambiado a: ${targetTab}`);
  });
});

// Toggle password visibility
if (togglePasswordBtn) {
  togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    const icon = togglePasswordBtn.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
  });
}

// Copy to clipboard functionality
copyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.copy;
    const targetElement = document.getElementById(targetId);
    const textToCopy = targetElement.textContent;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Cambiar icono temporalmente
      const icon = btn.querySelector('i');
      icon.classList.remove('fa-copy');
      icon.classList.add('fa-check');
      
      showNotification('Copiado al portapapeles', 'success');
      
      setTimeout(() => {
        icon.classList.remove('fa-check');
        icon.classList.add('fa-copy');
      }, 2000);
    }).catch(err => {
      showNotification('Error al copiar', 'error');
      console.error('Error al copiar:', err);
    });
  });
});

// Edit Profile
if (editProfileBtn) {
  editProfileBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('#perfil .form-input');
    const isReadOnly = inputs[0].hasAttribute('readonly');
    
    if (isReadOnly) {
      // Habilitar edición
      inputs.forEach(input => {
        if (input.id !== 'username') { // Username no editable
          input.removeAttribute('readonly');
          input.style.background = 'white';
        }
      });
      editProfileBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
      editProfileBtn.classList.remove('btn-outline');
      editProfileBtn.classList.add('btn-primary');
    } else {
      // Guardar cambios
      inputs.forEach(input => {
        input.setAttribute('readonly', true);
        input.style.background = '';
      });
      editProfileBtn.innerHTML = '<i class="fas fa-edit"></i> Editar Perfil';
      editProfileBtn.classList.remove('btn-primary');
      editProfileBtn.classList.add('btn-outline');
      
      showNotification('Perfil actualizado exitosamente', 'success');
    }
  });
}

// Change Password
if (changePasswordBtn) {
  changePasswordBtn.addEventListener('click', () => {
    showPasswordChangeModal();
  });
}

// Save Alerts Configuration
if (saveAlertsBtn) {
  saveAlertsBtn.addEventListener('click', () => {
    const config = {
      delayAlert: delayAlertSwitch.checked,
      deliveryConfirmation: deliveryConfirmationSwitch.checked
    };
    
    console.log('💾 Configuración de alertas guardada:', config);
    showNotification('Configuración de alertas guardada', 'success');
  });
}

// Generate Token
const generateTokenBtn = document.getElementById('generateToken');
const regenerateTokenBtn = document.getElementById('regenerateToken');
const noTokenWarning = document.getElementById('noTokenWarning');
const tokenActions = document.getElementById('tokenActions');
const tokenDisplay = document.getElementById('tokenDisplay');
const tokenCreatedDate = document.getElementById('tokenCreatedDate');

if (generateTokenBtn) {
  generateTokenBtn.addEventListener('click', () => {
    const newToken = generateRandomKey('mc_int_tk_');
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
    
    document.getElementById('integrationToken').textContent = newToken;
    tokenCreatedDate.textContent = dateStr;
    
    // Ocultar warning y botón, mostrar token
    noTokenWarning.style.display = 'none';
    tokenActions.style.display = 'none';
    tokenDisplay.style.display = 'block';
    
    showNotification('Token de integración generado exitosamente', 'success');
    console.log('🔑 Token de integración generado');
  });
}

// Regenerate Token
if (regenerateTokenBtn) {
  regenerateTokenBtn.addEventListener('click', () => {
    if (confirm('¿Estás seguro de regenerar el token? El token anterior dejará de funcionar.')) {
      const newToken = generateRandomKey('mc_int_tk_');
      const now = new Date();
      const dateStr = now.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
      
      document.getElementById('integrationToken').textContent = newToken;
      tokenCreatedDate.textContent = dateStr;
      
      showNotification('Token regenerado exitosamente', 'success');
      console.log('🔄 Token de integración regenerado');
    }
  });
}

// Generar clave aleatoria
function generateRandomKey(prefix) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let key = prefix;
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

// Mostrar modal de cambio de contraseña
function showPasswordChangeModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>Cambiar Contraseña</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Contraseña Actual</label>
          <input type="password" id="currentPassword" class="form-input" placeholder="Ingresa tu contraseña actual">
        </div>
        <div class="form-group">
          <label>Nueva Contraseña</label>
          <input type="password" id="newPassword" class="form-input" placeholder="Ingresa tu nueva contraseña">
        </div>
        <div class="form-group">
          <label>Confirmar Nueva Contraseña</label>
          <input type="password" id="confirmPassword" class="form-input" placeholder="Confirma tu nueva contraseña">
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline modal-cancel">Cancelar</button>
        <button class="btn btn-primary modal-confirm">Cambiar Contraseña</button>
      </div>
    </div>
  `;
  
  // Estilos del modal
  const style = document.createElement('style');
  style.textContent = `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }
    .modal {
      background: white;
      border-radius: 16px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
      animation: slideUp 0.3s ease-out;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #e2e8f0;
    }
    .modal-header h3 {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
    }
    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      color: #64748b;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: all 0.2s ease;
    }
    .modal-close:hover {
      background: #f1f5f9;
      color: #1e293b;
    }
    .modal-body {
      padding: 24px;
    }
    .modal-footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding: 24px;
      border-top: 1px solid #e2e8f0;
    }
    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(modal);
  
  // Event listeners del modal
  const closeBtn = modal.querySelector('.modal-close');
  const cancelBtn = modal.querySelector('.modal-cancel');
  const confirmBtn = modal.querySelector('.modal-confirm');
  
  const closeModal = () => {
    modal.style.animation = 'fadeOut 0.2s ease-out';
    setTimeout(() => modal.remove(), 200);
  };
  
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  
  confirmBtn.addEventListener('click', () => {
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    
    if (!current || !newPass || !confirm) {
      showNotification('Por favor completa todos los campos', 'error');
      return;
    }
    
    if (newPass !== confirm) {
      showNotification('Las contraseñas no coinciden', 'error');
      return;
    }
    
    if (newPass.length < 8) {
      showNotification('La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }
    
    // Simular cambio de contraseña
    closeModal();
    showNotification('Contraseña cambiada exitosamente', 'success');
    console.log('🔒 Contraseña actualizada');
  });
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
      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Event listeners para preferencias
[delayAlertSwitch, deliveryConfirmationSwitch].forEach(switchEl => {
  if (switchEl) {
    switchEl.addEventListener('change', (e) => {
      const label = e.target.closest('.preference-item').querySelector('h4').textContent;
      const status = e.target.checked ? 'activada' : 'desactivada';
      console.log(`⚙️ ${label} ${status}`);
    });
  }
});

// Inicialización
window.addEventListener('load', () => {
  console.log('✅ Página de Developer cargada');
  console.log('👤 Usuario: C6est');
  console.log('🔑 Token de integración disponible');
  console.log('🔔 Configuración de alertas disponible');
  console.log('⚙️ Preferencias de alertas configurables');
});

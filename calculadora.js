// Variables globales
let historialCuentas = [];
let selectedTipOption = null;

// Elementos del DOM
const calculatorForm = document.getElementById('calculatorForm');
const tipSection = document.getElementById('tipSection');
const customTip = document.getElementById('customTip');
const resultSection = document.getElementById('resultSection');
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');

// Inicialización
setupEventListeners();
loadHistoryFromStorage();
setupNavbarToggle();

function setupEventListeners() {
    // Manejar cambios en la selección de propina
    document.querySelectorAll('input[name="includeTip"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes') {
                tipSection.style.display = 'block';
            } else {
                tipSection.style.display = 'none';
                selectedTipOption = null;
                customTip.classList.remove('show');
            }
        });
    });

    // Manejar selección de opciones de propina
    document.querySelectorAll('.tip-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remover selección previa
            document.querySelectorAll('.tip-option').forEach(opt => opt.classList.remove('selected'));
            
            // Seleccionar la opción actual
            this.classList.add('selected');
            selectedTipOption = this.dataset.tip;
            
            // Mostrar/ocultar campo de propina personalizada
            if (selectedTipOption === 'custom') {
                customTip.classList.add('show');
            } else {
                customTip.classList.remove('show');
            }
        });
    });

    // Manejar envío del formulario
    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calcularDivisionCuenta();
    });

    // Botones de historial
    document.getElementById('showHistory').addEventListener('click', function() {
        toggleHistorySection();
    });

    document.getElementById('clearHistory').addEventListener('click', function() {
        clearHistory();
    });
}

function calcularDivisionCuenta() {
    // Obtener valores del formulario
    const totalPrice = parseFloat(document.getElementById('totalPrice').value);
    const peopleCount = parseInt(document.getElementById('peopleCount').value);
    const includeTip = document.querySelector('input[name="includeTip"]:checked')?.value === 'yes';

    // Validaciones
    if (isNaN(totalPrice) || totalPrice <= 0) {
        showError('Por favor, ingrese un precio válido mayor a 0.');
        return;
    }

    if (isNaN(peopleCount) || peopleCount <= 0) {
        showError('Por favor, ingrese una cantidad válida de comensales mayor a 0.');
        return;
    }

    if (includeTip && !selectedTipOption) {
        showError('Por favor, seleccione una opción de propina.');
        return;
    }

    // Calcular propina
    let tipAmount = 0;
    if (includeTip && selectedTipOption !== '0') {
        if (selectedTipOption === 'custom') {
            const customTipPercent = parseFloat(document.getElementById('customTipPercent').value);
            if (!customTipPercent || customTipPercent < 0 || customTipPercent > 50) {
                showError('Por favor, ingrese un porcentaje de propina válido entre 0 y 50.');
                return;
            }
            tipAmount = totalPrice * (customTipPercent / 100);
        } else {
            tipAmount = totalPrice * (parseInt(selectedTipOption) / 100);
        }
    }

    // Calcular total con propina
    const totalWithTip = totalPrice + tipAmount;
    const amountPerPerson = totalWithTip / peopleCount;

    // Crear objeto de resultado
    const resultado = {
        precioTotal: totalPrice,
        cantidadComensales: peopleCount,
        incluirPropina: includeTip,
        propina: tipAmount,
        totalConPropina: totalWithTip,
        montoPorPersona: amountPerPerson
    };

    // Mostrar resultado
    mostrarResultado(resultado);
    
    // Guardar en historial
    guardarEnHistorial(resultado);
    
    // Limpiar formulario
    calculatorForm.reset();
    tipSection.style.display = 'none';
    customTip.classList.remove('show');
    selectedTipOption = null;
    document.querySelectorAll('.tip-option').forEach(opt => opt.classList.remove('selected'));
}

function mostrarResultado(resultado) {
    // Actualizar valores en la interfaz
    document.getElementById('originalPrice').textContent = `$${resultado.precioTotal.toFixed(2)}`;
    document.getElementById('tipAmount').textContent = `$${resultado.propina.toFixed(2)}`;
    document.getElementById('totalWithTip').textContent = `$${resultado.totalConPropina.toFixed(2)}`;
    document.getElementById('peopleCountResult').textContent = resultado.cantidadComensales;
    document.getElementById('perPersonAmount').textContent = `$${resultado.montoPorPersona.toFixed(2)}`;

    // Mostrar sección de resultados
    resultSection.classList.add('show');
    
    // Scroll suave a los resultados
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

function guardarEnHistorial(resultado) {
    const cuentaHistorial = {
        ...resultado,
        fecha: new Date().toLocaleString()
    };
    
    historialCuentas.push(cuentaHistorial);
    
    // Guardar en localStorage
    localStorage.setItem('historialCalculadora', JSON.stringify(historialCuentas));
    
    // Actualizar historial en la interfaz
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    if (historialCuentas.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #666; font-family: \'Montserrat\', sans-serif;">No hay cuentas en el historial.</p>';
        return;
    }

    historyList.innerHTML = '';
    
    historialCuentas.forEach((cuenta, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        historyItem.innerHTML = `
            <h4>Cuenta #${index + 1} - ${cuenta.fecha}</h4>
            <div class="history-details">
                <div class="history-detail">
                    <div class="label">Precio Original</div>
                    <div class="value">$${cuenta.precioTotal.toFixed(2)}</div>
                </div>
                <div class="history-detail">
                    <div class="label">Comensales</div>
                    <div class="value">${cuenta.cantidadComensales}</div>
                </div>
                ${cuenta.incluirPropina ? `
                <div class="history-detail">
                    <div class="label">Propina</div>
                    <div class="value">$${cuenta.propina.toFixed(2)}</div>
                </div>
                <div class="history-detail">
                    <div class="label">Total con Propina</div>
                    <div class="value">$${cuenta.totalConPropina.toFixed(2)}</div>
                </div>
                ` : ''}
                <div class="history-detail">
                    <div class="label">Cada uno paga</div>
                    <div class="value">$${cuenta.montoPorPersona.toFixed(2)}</div>
                </div>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

function toggleHistorySection() {
    if (historySection.classList.contains('show')) {
        historySection.classList.remove('show');
    } else {
        historySection.classList.add('show');
        updateHistoryDisplay();
        historySection.scrollIntoView({ behavior: 'smooth' });
    }
}

function clearHistory() {
    // Crear modal de confirmación
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3 class="modal-title">¿Limpiar historial?</h3>
            <p class="modal-message">¿Está seguro de que desea eliminar todo el historial de cuentas?</p>
            <div class="modal-buttons">
                <button id="confirmClear" class="modal-btn modal-btn-primary">Sí, limpiar</button>
                <button id="cancelClear" class="modal-btn modal-btn-secondary">Cancelar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners para los botones
    document.getElementById('confirmClear').addEventListener('click', function() {
        historialCuentas = [];
        localStorage.removeItem('historialCalculadora');
        updateHistoryDisplay();
        document.body.removeChild(modal);
        showSuccessMessage('Historial limpiado exitosamente.');
    });
    
    document.getElementById('cancelClear').addEventListener('click', function() {
        document.body.removeChild(modal);
    });
}

function loadHistoryFromStorage() {
    const savedHistory = localStorage.getItem('historialCalculadora');
    if (savedHistory) {
        try {
            historialCuentas = JSON.parse(savedHistory);
        } catch (e) {
            historialCuentas = [];
        }
    }
}

function showError(message) {
    // Crear notificación de error
    const notification = document.createElement('div');
    notification.className = 'notification notification-error';
    notification.textContent = message;
    
    // Asegurar que la notificación sea visible
    notification.style.zIndex = '9999';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 4000);
}

function showSuccessMessage(message) {
    // Crear notificación de éxito
    const notification = document.createElement('div');
    notification.className = 'notification notification-success';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 3000);
}

function setupNavbarToggle() {
    const togglerButton = document.querySelector('.navbar-toggler');
    const navbarContent = document.querySelector('#navbarContenido');
    
    if (togglerButton && navbarContent) {
        document.addEventListener('click', function (e) {
            if (!navbarContent.contains(e.target) && !togglerButton.contains(e.target)) {
                if (navbarContent.classList.contains('show')) {
                    navbarContent.classList.remove('show');
                }
            }
        });
    }
} 
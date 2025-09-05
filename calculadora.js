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

    document.querySelectorAll('.tip-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.tip-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedTipOption = this.dataset.tip;
            
            if (selectedTipOption === 'custom') {
                customTip.classList.add('show');
            } else {
                customTip.classList.remove('show');
            }
        });
    });

    calculatorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        calcularDivisionCuenta();
    });

    document.getElementById('showHistory').addEventListener('click', function() {
        toggleHistorySection();
    });

    document.getElementById('clearHistory').addEventListener('click', function() {
        clearHistory();
    });
}

function calcularDivisionCuenta() {
    const totalPrice = parseFloat(document.getElementById('totalPrice').value);
    const peopleCount = parseInt(document.getElementById('peopleCount').value);
    const includeTip = document.querySelector('input[name="includeTip"]:checked')?.value === 'yes';

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

    const totalWithTip = totalPrice + tipAmount;
    const amountPerPerson = totalWithTip / peopleCount;

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
    // Perdón por poner esto acá :(    
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
    
    // Eventos para los botones
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
    const notification = document.createElement('div');
    notification.className = 'notification notification-error';
    notification.textContent = message;
    notification.style.zIndex = '9999';
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 4000);
}

function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'notification notification-success';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
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
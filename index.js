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

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadHistoryFromStorage();
});

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
    if (!totalPrice || totalPrice <= 0) {
        showError('Por favor, ingrese un precio válido mayor a 0.');
        return;
    }

    if (!peopleCount || peopleCount <= 0) {
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
    localStorage.setItem('historialCuentas', JSON.stringify(historialCuentas));
    
    // Actualizar historial en la interfaz
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    if (historialCuentas.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #666;">No hay cuentas en el historial.</p>';
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
    if (historySection.classList.contains('hidden')) {
        historySection.classList.remove('hidden');
        updateHistoryDisplay();
        historySection.scrollIntoView({ behavior: 'smooth' });
    } else {
        historySection.classList.add('hidden');
    }
}

function clearHistory() {
    if (confirm('¿Está seguro de que desea limpiar todo el historial?')) {
        historialCuentas = [];
        localStorage.removeItem('historialCuentas');
        updateHistoryDisplay();
        alert('Historial limpiado exitosamente.');
    }
}

function loadHistoryFromStorage() {
    const savedHistory = localStorage.getItem('historialCuentas');
    if (savedHistory) {
        try {
            historialCuentas = JSON.parse(savedHistory);
        } catch (e) {
            console.error('Error al cargar historial:', e);
            historialCuentas = [];
        }
    }
}

function showError(message) {
    alert(message); // Por ahora usamos alert, pero podrías crear una función más elegante
}

// Función para formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

console.log('Calculadora de Cuenta Restaurante iniciada');
console.log('Interfaz web cargada correctamente');
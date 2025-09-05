# 🍽️ Calculadora de Cuenta Restaurante

Una aplicación web interactiva desarrollada en JavaScript que permite calcular la división de cuentas de restaurante entre múltiples comensales, incluyendo opciones de propina personalizables.

## ✨ Características

- **División automática de cuentas**: Calcula cuánto debe pagar cada persona
- **Sistema de propinas flexible**: 
  - Opciones predefinidas (10%, 15%, 20%)
  - Propina personalizada (0-20%)
  - Opción de no dejar propina
- **Historial de cuentas**: Guarda todas las divisiones realizadas
- **Validación de datos**: Asegura que los valores ingresados sean válidos
- **Interfaz intuitiva**: Utiliza prompts y alerts para una experiencia clara

## 🚀 Cómo usar

1. Abre el archivo `index.html` en tu navegador web
2. La aplicación se iniciará automáticamente
3. Sigue las instrucciones en pantalla:
   - Ingresa el precio total de la cuenta
   - Especifica la cantidad de comensales
   - Decide si incluir propina
   - Selecciona el porcentaje de propina deseado
4. Revisa el resultado y el historial de cuentas

## 📋 Funcionalidades detalladas

### Opciones de propina disponibles:
- **10%** - Propina estándar
- **15%** - Propina generosa
- **20%** - Propina muy generosa
- **Otra** - Porcentaje personalizado (0-20%)
- **No dejar propina** - Sin propina

### Historial de cuentas:
- Guarda automáticamente cada división realizada
- Muestra fecha y hora de cada cálculo
- Incluye todos los detalles: precio, comensales, propina y monto por persona

## 🛠️ Tecnologías utilizadas

- **HTML5**: Estructura básica de la página
- **JavaScript vanilla**: Lógica de la aplicación
- **CSS**: Estilos básicos del navegador

## 📁 Estructura del proyecto

```
javascript-entrega1/
├── index.html          # Página principal
├── index.js           # Lógica de la aplicación
└── README.md          # Documentación del proyecto
```

## 🎯 Funciones principales

- `iniciarCalculadora()`: Función principal que controla el flujo de la aplicación
- `solicitarDatosCuenta()`: Recopila la información necesaria del usuario
- `calcularDivisionCuenta()`: Realiza los cálculos matemáticos
- `solicitarPropina()`: Maneja la selección de propina
- `mostrarResultado()`: Presenta los resultados al usuario
- `guardarEnHistorial()`: Almacena los datos en el historial
- `mostrarHistorial()`: Muestra el historial de cuentas

## 🔧 Instalación y ejecución

1. Clona o descarga este repositorio
2. Navega hasta la carpeta del proyecto
3. Abre `index.html` en tu navegador web preferido
4. ¡Listo! La aplicación se ejecutará automáticamente

## 📱 Compatibilidad

- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Cualquier navegador moderno con soporte para JavaScript

## 🤝 Contribuciones

Este es un proyecto educativo desarrollado como parte del curso de JavaScript. Las contribuciones son bienvenidas para mejorar la funcionalidad y la experiencia del usuario.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

**Desarrollado con ❤️ para facilitar la división de cuentas en restaurantes**



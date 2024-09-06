
const cargarDatosConPromesa = () => {
    return fetch('sectores.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Error al cargar el archivo JSON:', error);
        });
};


let sectores = {};


cargarDatosConPromesa().then(data => {
    if (data && data.sectores) {
        
        sectores = data.sectores.reduce((acc, sector) => {
            acc[sector.id] = sector;
            return acc;
        }, {});
        asignarManejadoresEventos();
        cargarEntradasDesdeStorage();
    }
});


const obtenerNombreSector = (numeroSector) => sectores[numeroSector]?.nombre || 'Sector desconocido';

const obtenerOpcionesEntradas = (numeroSector) => sectores[numeroSector]?.tickets || [];


const mostrarOpcionesEntradas = (numeroSector) => {
    const nombreSector = obtenerNombreSector(numeroSector);
    const tickets = obtenerOpcionesEntradas(numeroSector);
    if (tickets.length === 0) {
        document.getElementById('entradas').innerHTML = `<p>No hay tickets disponibles para este sector.</p>`;
        return;
    }
    const ticket = tickets[0];
    const ticketInfo = `
        <h3 class="animate__animated animate__fadeIn">Opciones para ${nombreSector}</h3>
        <p class="animate__animated animate__fadeIn">${ticket.type} - $${ticket.precio}</p>
        <input type="number" id="cantidad-entradas" min="1" placeholder="Cantidad de entradas">
        <button class="animate__animated animate__bounceIn" onclick="seleccionarEntrada(${numeroSector})">Confirmar</button>
    `;

    document.getElementById('entradas').innerHTML = ticketInfo;
    localStorage.setItem('sectorSeleccionado', numeroSector);
};


let entradasSeleccionadas = [];


const seleccionarEntrada = (numeroSector) => {
    const cantidadInput = document.getElementById('cantidad-entradas');
    const cantidad = parseInt(cantidadInput.value, 10);

    
    if (isNaN(cantidad) || cantidad <= 0) {
        Swal.fire({
            title: 'Error',
            text: 'Por favor ingresa una cantidad válida mayor a 0',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const tickets = obtenerOpcionesEntradas(numeroSector);
    if (tickets.length === 0) {
        Swal.fire({
            title: 'Error',
            text: 'No hay tickets disponibles para este sector.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const ticket = tickets[0];

    const seleccion = {
        sector: obtenerNombreSector(numeroSector),
        tipo: ticket.type,
        precio: ticket.precio,
        cantidad: cantidad,
        total: calcularTotal(ticket.precio, cantidad)
    };

    entradasSeleccionadas.push(seleccion);
    localStorage.setItem('entradasSeleccionadas', JSON.stringify(entradasSeleccionadas));
    actualizarResumenEntradas();
};


const actualizarResumenEntradas = () => {
    let resumenHTML = '<h3 class="animate__animated animate__fadeIn">Resumen de tus entradas:</h3>';
    let totalFinal = 0;

    entradasSeleccionadas.forEach((entrada) => {
        resumenHTML += `
            <p class="animate__animated animate__fadeIn"><strong>Sector:</strong> ${entrada.sector}</p>
            <p class="animate__animated animate__fadeIn"><strong>Tipo:</strong> ${entrada.tipo}</p>
            <p class="animate__animated animate__fadeIn"><strong>Cantidad:</strong> ${entrada.cantidad}</p>
            <p class="animate__animated animate__fadeIn"><strong>Total:</strong> $${entrada.total}</p>
            <hr class="animate__animated animate__fadeIn">
        `;
        totalFinal += entrada.total;
    });

    resumenHTML += `<h4 class="animate__animated animate__fadeIn">Total acumulado a pagar: $${totalFinal}</h4>`;
    resumenHTML += `<button id="iniciar-pago" class="animate__animated animate__bounceIn" style="margin-top: 20px;">Iniciar Pago</button>`;

    document.getElementById('total').innerHTML = resumenHTML;

    document.getElementById('iniciar-pago').addEventListener('click', () => {
        iniciarProcesoPago();
    });
};


const iniciarProcesoPago = () => {
    Swal.fire({
        title: '¿Eres mayor de edad para realizar la compra?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                '¡Perfecto!',
                'Puedes proceder con la compra.',
                'success'
            ).then(() => {
                entradasSeleccionadas = [];
                localStorage.removeItem('entradasSeleccionadas');
                location.reload();
            });
        } else {
            Swal.fire(
                'Lo sentimos',
                'Debes ser mayor de edad para realizar la compra.',
                'error'
            );
        }
    });
};


const cargarEntradasDesdeStorage = () => {
    const entradasGuardadas = localStorage.getItem('entradasSeleccionadas');
    if (entradasGuardadas) {
        entradasSeleccionadas = JSON.parse(entradasGuardadas);
        actualizarResumenEntradas();
    }
};


const calcularTotal = (precio, cantidad) => precio * cantidad;


const asignarManejadoresEventos = () => {
    document.querySelectorAll('.sector').forEach(sector => {
        sector.addEventListener('click', (event) => {
            const numeroSector = event.target.getAttribute('data-sector');
            mostrarOpcionesEntradas(numeroSector);
        });
    });
};

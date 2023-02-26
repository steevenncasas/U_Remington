let clienteId = [
    { name: 'Francisco', value: 100 },
    { name: 'Pedro', value: 200 }
];


clienteseleccionado.addEventListener("change", () => {
    let clienteseleccionado = document.querySelector('#clienteseleccionado').value
    document.querySelector('#saldoActual').innerHTML = clienteId[clienteseleccionado].value
});

clienteseleccionadoTranfer.addEventListener("change", () => {
    let clienteseleccionadoTranfer = document.querySelector('#clienteseleccionadoTranfer').value
    console.log(clienteseleccionadoTranfer)
    document.querySelector('#saldoActualTransfer').innerHTML = clienteId[clienteseleccionadoTranfer].value
});

let navActivo = 'depositar'
document.querySelector('#navRetirar').addEventListener('click', () => menuActivo('retirar'))
document.querySelector('#navDepositar').addEventListener('click', () => menuActivo('depositar'))
document.querySelector('#navTransferencia').addEventListener('click', () => menuActivo('transferir'))


function menuActivo(nav) {
    let msj = document.querySelector('#msj');
    if (nav == 'depositar') {
        navActivo = 'depositar'
        document.getElementById('navDepositar').classList.add('active');
        document.getElementById('navRetirar').classList.remove('active');
        document.getElementById('navTransferencia').classList.remove('active');
        document.getElementById('clienteseleccionadoTranfer').parentNode.parentNode.classList.add('d-none')
        document.getElementById('saldoActualTransfer').parentNode.parentNode.parentNode.classList.add('d-none')
        msj.innerHTML = ('Por favor ingrese el valor a depositar')
    } else if (nav == 'retirar') {
        navActivo = 'retirar'
        document.getElementById('navRetirar').classList.add('active')
        document.getElementById('navDepositar').classList.remove('active');
        document.getElementById('navTransferencia').classList.remove('active');
        document.getElementById('clienteseleccionadoTranfer').parentNode.parentNode.classList.add('d-none')
        document.getElementById('saldoActualTransfer').parentNode.parentNode.parentNode.classList.add('d-none')
        msj.innerHTML = ('Por favor ingrese el valor a retirar')
    } else if (nav == 'transferir') {
        navActivo = 'transferir'
        document.getElementById('navRetirar').classList.remove('active')
        document.getElementById('navDepositar').classList.remove('active');
        document.getElementById('navTransferencia').classList.add('active');
        document.getElementById('clienteseleccionadoTranfer').parentNode.parentNode.classList.remove('d-none')
        document.getElementById('saldoActualTransfer').parentNode.parentNode.parentNode.classList.remove('d-none')
        document.getElementById('navTransferencia').classList.add('active')
        msj.innerHTML = ('Por favor ingrese el valor a transferir')
    }
}

let btnValor = document.querySelector('#btnValor')
btnValor.addEventListener('click', btnGuardar);

function btnGuardar() {
    let valorInput = document.querySelector('#valor').value
    let clienteseleccionado = document.querySelector('#clienteseleccionado').value

    if (valorInput > 0 && clienteseleccionado) {
        if (navActivo == 'depositar') {
            deposito(valorInput, clienteseleccionado)
        } else if (navActivo == 'retirar' && valorInput <= saldoActual) {
            retiro(valorInput, clienteseleccionado)
        } else if (navActivo == 'transferir') {
            transferencia(valorInput, clienteseleccionado)
        }
    } else {
        alert('Debe seleccionar un cliente o ingresar un valor mayor a 0')
    }
}

/* Se agregar la función de depósito*/

function deposito(valorInput, clienteseleccionado) {

    clienteId[clienteseleccionado].value += parseInt(valorInput)
    document.querySelector('#saldoActual').innerHTML = clienteId[clienteseleccionado].value
}

/*Se agregar la función de retiro */

function retiro(valorInput, clienteseleccionado) {
    if (valorInput <= clienteId[clienteseleccionado].value) {
        clienteId[clienteseleccionado].value -= parseInt(valorInput)

        document.querySelector('#saldoActual').innerHTML = clienteId[clienteseleccionado].value;
    } else {
        alert('El valor del retiro no debe superar el monto o ser negativo.')
    }
}

/*Se agregar la función de transferencia */

function transferencia(valorInput, clienteseleccionado) {
    let clienteseleccionadoTranfer = document.querySelector('#clienteseleccionadoTranfer').value
    if (!clienteseleccionado) {
        alert('Debe seleccionar un cliente origen')
    } else if (!clienteseleccionadoTranfer) {
        alert('Debe seleccionar un cliente destino')
    } else if (clienteseleccionado == clienteseleccionadoTranfer) {
        alert('Los cliente no deben ser iguales')
    } else if (valorInput > clienteId[clienteseleccionado].value) {
        alert('El valor a transferir debe ser menor o igual al saldo de la cuenta.')
    } else {
        clienteId[clienteseleccionado].value -= parseInt(valorInput)
        clienteId[clienteseleccionadoTranfer].value += parseInt(valorInput)
        document.querySelector('#saldoActual').innerHTML = clienteId[clienteseleccionado].value
        document.querySelector('#saldoActualTransfer').innerHTML = clienteId[clienteseleccionadoTranfer].value
    }
}

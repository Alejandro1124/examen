document.addEventListener('DOMContentLoaded', function() {
    // Llamar a la función iniciarReconocimiento() directamente después de cargar la página
    iniciarReconocimiento();

    // Función para iniciar el reconocimiento de voz
    function iniciarReconocimiento() {
        const reconocimientoVoz = new webkitSpeechRecognition() || new SpeechRecognition();
        reconocimientoVoz.lang = 'es-ES';

        reconocimientoVoz.onstart = function() {
            console.log('Escuchando...');
        };

        reconocimientoVoz.onresult = function(event) {
            const voz = event.results[0][0].transcript.trim();
            const usuario = sessionStorage.getItem('usuario');
            const fechaHora = new Date().toLocaleString();

            // Evaluar la orden recibida y enviarla si coincide con las órdenes registradas
            enviarOrden(voz, usuario, fechaHora);
        };

        reconocimientoVoz.onend = function() {
            // Reiniciar el reconocimiento al finalizar
            iniciarReconocimiento();
        };

        reconocimientoVoz.start();
    }

    // Función para enviar órdenes al servidor si coinciden con las órdenes registradas
    function enviarOrden(orden, usuario, fechaHora) {
        // Evaluar la orden recibida
        switch (orden.toLowerCase()) {
            // sala
            case 'prender sala':
            case 'apagar sala':
            // cuarto
            case 'prender cuarto':
            case 'apagar cuarto':
            // cortinas
            case 'abrir cortinas':
            case 'cerrar cortinas':
            // ventilador
            case 'prender ventilador':
            case 'apagar ventilador':
            // jardin
            case 'prender luces':
            case 'apagar luces':
            // camaras
            case 'prender cámaras':
            case 'apagar cámaras':
            // alarma
            case 'enciende alarma':
            case 'apaga alarma':
            // cerrar sesión
            case 'cerrar sesión':
                // Enviar la orden al servidor si coincide con alguna de las órdenes registradas
                enviarOrdenServidor(orden, usuario, fechaHora);
                break;
            default:
                console.log('Orden no reconocida.');
        }
    }

    // Función para enviar órdenes al servidor
    function enviarOrdenServidor(orden, usuario, fechaHora) {
        // Datos a enviar al MockAPI
        const datos = {
            orden: orden,
            fechaHora: fechaHora,
            usuario: usuario
        };

        // Opciones de la solicitud
        const opciones = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        };

        // URL del MockAPI
        const urlMockAPI = 'https://663042b0c92f351c03d96363.mockapi.io/casa';

        // Enviar la solicitud POST
        fetch(urlMockAPI, opciones)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud POST a MockAPI');
                }
                return response.json();
            })
            .then(data => {
                console.log('Registro exitoso en MockAPI:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
});

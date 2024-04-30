const usuarios = [
    { nombre: "ana", clave: "0706" },
    { nombre: "eli", clave: "1111" },
    // Agrega más usuarios según sea necesario
];

function reconocerVoz() {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'es-ES';

    recognition.onresult = function(event) {
        const vozCapturada = event.results[0][0].transcript.toLowerCase();
        console.log("Has dicho: " + vozCapturada);

        let usuarioEncontrado = null;

        // Buscar el usuario en la lista de usuarios
        for (const usuario of usuarios) {
            if (vozCapturada.includes(usuario.nombre)) {
                usuarioEncontrado = usuario;
                break;
            }
        }

        // Si no se encontró el usuario, mostrar un mensaje y volver a iniciar el reconocimiento
        if (!usuarioEncontrado) {
            const mensaje = "Usuario no reconocido.";
            mostrarMensajeYReconocimiento(mensaje);
            return;
        }

        // Si se encontró el usuario, verificar el pin
        if (vozCapturada.includes(usuarioEncontrado.clave)) {
            console.log("Usuario " + usuarioEncontrado.nombre + " autenticado correctamente.");
            // Guardar el usuario en el almacenamiento de sesión
            sessionStorage.setItem('usuario', usuarioEncontrado.nombre);
            // Redirigir al usuario a index.html después de 3 segundos
            setTimeout(function() {
                window.location.href = "index.html";
            }, 3000);
        } else {
            const mensaje = "Contraseña incorrecta. Por favor, intenta de nuevo.";
            mostrarMensajeYReconocimiento(mensaje);
        }
    };

    recognition.start();
}

function mostrarMensajeYReconocimiento(mensaje) {
    // Mostrar mensaje en la interfaz
    document.getElementById("mensaje").innerHTML = mensaje;
    // Reproducir mensaje de retroalimentación con voz de mujer
    const synth = window.speechSynthesis;
    const mensajeVoz = new SpeechSynthesisUtterance(mensaje);
    const voces = synth.getVoices().filter(voice => voice.lang === 'es-ES' && voice.name.includes('female'));
    if (voces.length > 0) {
        mensajeVoz.voice = voces[0];
    }
    synth.speak(mensajeVoz);
    // Reiniciar el reconocimiento de voz
    setTimeout(reconocerVoz, 2000);
}

function iniciarReconocimientoVoz() {
    const synth = window.speechSynthesis;
    const mensajeVoz = new SpeechSynthesisUtterance("Por favor, identifíquese con su usuario y contraseña.");
    const voces = synth.getVoices().filter(voice => voice.lang === 'es-ES' && voice.name.includes('female'));
    if (voces.length > 0) {
        mensajeVoz.voice = voces[0];
    }
    synth.speak(mensajeVoz);
    mensajeVoz.onend = function() {
        reconocerVoz();
    };
}

// Llamamos a la función para iniciar el reconocimiento de voz cuando se haga clic en el botón "Empezar"
document.getElementById("startButton").addEventListener("click", function() {
    iniciarReconocimientoVoz();
});
require('dotenv').config();
const twilio = require('twilio');
const readline = require('readline');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;

const client = twilio(accountSid, authToken);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function crearServicioVerificacion() {
  client.verify.services.create({
    friendlyName: 'MyVerifyService', // Puedes cambiar esto según tus preferencias
    codeLength: 6, // Longitud del código de verificación
    // Otros parámetros opcionales pueden ser agregados según tus necesidades
  })
  .then(service => {
    console.log(`Servicio de verificación creado con SID: ${service.sid}`);
    iniciarConNumero(service.sid); // Llamamos a la función de inicio con el SID del servicio
  })
  .catch(error => console.error(`Error al crear el servicio de verificación: ${error.message}`));
}

function generarCodigoTemporal() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function enviarCodigoTwilio(numeroTelefono, codigoTemporal, servicioVerificacionSid) {
  return client.verify.services(servicioVerificacionSid)
    .verifications
    .create({ to: numeroTelefono, channel: "sms", code: codigoTemporal });
}

function verificarCodigoTwilio(numeroTelefono, codigoTemporalIngresado, servicioVerificacionSid) {
  return client.verify.services(servicioVerificacionSid)
    .verificationChecks
    .create({ to: numeroTelefono, code: codigoTemporalIngresado });
}

function abrirPopup(mensaje, callback) {
  rl.question(mensaje, (respuesta) => {
    callback(respuesta);
  });
}

function mostrarAlerta(mensaje) {
  console.log(mensaje);
}

function iniciarConNumero(servicioVerificacionSid) {
  abrirPopup('Por favor, ingrese su número de teléfono:', (numeroTelefono) => {
    if (numeroTelefono) {
      var codigoTemporalGenerado = generarCodigoTemporal();

      // Enviar código temporal por mensaje SMS usando Twilio
      enviarCodigoTwilio(numeroTelefono, codigoTemporalGenerado, servicioVerificacionSid)
        .then(verification => {
          console.log(`Mensaje SMS enviado con SID: ${verification.sid}`);

          // Mostrar pop-up para ingresar el código temporal después de enviarlo
          abrirPopup('Por favor, ingrese el código temporal enviado:', (codigoTemporalIngresado) => {
            // Verificar el código temporal con Twilio
            verificarCodigoTwilio(numeroTelefono, codigoTemporalIngresado, servicioVerificacionSid)
              .then(verificationCheck => {
                console.log(`Verificación del código temporal: ${verificationCheck.status}`);
                if (verificationCheck.status === 'approved') {
                  console.log('Código temporal verificado. Inicio de sesión exitoso.');
                  mostrarAlerta('Código temporal verificado. Inicio de sesión exitoso.');
                } else {
                  console.log('Código temporal no válido. Puede intentar nuevamente después de 60 segundos.');
                  mostrarAlerta('Código temporal no válido. Puede intentar nuevamente después de 60 segundos.');
                }
              })
              .catch(error => console.error(`Error al verificar código temporal: ${error.message}`));
          });
        })
        .catch(error => console.error(`Error al enviar mensaje SMS: ${error.message}`));
    } else {
      mostrarAlerta('Debe ingresar un número de teléfono válido.');
    }
  });
}

// Llamada inicial para crear el servicio de verificación
crearServicioVerificacion();

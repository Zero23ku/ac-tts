let msgQueue = [];
let intervalId;
let initiated = false;
function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
}

var synth = new Animalese('./public/sounds/animalese.wav', function () { });

function generateWav(text, shorten, ptich) {
    return synth.Animalese(text,
        shorten,
        ptich).dataURI;
}

function checkForMsg() {
    fetch('http://localhost:3000/message/read')
        .then(response => response.json()) // Parsea la respuesta como JSON
        .then(data => {
            if(!initiated) {
                initiated = true;
                document.getElementById('init').classList.add('d-none');
                document.getElementById('stop').classList.remove('d-none');
            }
            if (JSON.stringify(data) != '{}') {
                const msg = data.msg;
                console.log(msg);
                var audio = new Audio();
                audio.src = generateWav(msg, true, 1.5);    //TODO: pasar los parámetros de forma dinámica desde SAMMI
                audio.play();
            }

        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

function initTTS() {
    document.getElementById('init').setAttribute("disabled", "disabled");
    document.getElementById('init').innerText  = "Iniciando...";
    intervalId = setInterval(checkForMsg, 5000);
}

function stopTTS() {
    clearInterval(intervalId);
    document.getElementById('init').removeAttribute("disabled");
    document.getElementById('init').innerText  = "Iniciar";
    document.getElementById('stop').classList.add('d-none');
    document.getElementById('init').classList.remove('d-none');
}

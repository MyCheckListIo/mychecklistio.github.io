let stream;
let scanAttempts = 0;
let lastScannedCode = null;
let consecutiveMatches = 0;
const requiredMatches = 3;

const openCameraButton = document.getElementById('openCameraButton');
const captureImageButton = document.getElementById('captureImageButton');
const saveIdentifiedProductButton = document.getElementById('saveIdentifiedProductButton');
const saveProductButton = document.getElementById('saveProductButton');
const capturePhotoButton = document.getElementById('capturePhotoButton');
const recognizeTextButton = document.getElementById('recognizeTextButton');

if (openCameraButton) openCameraButton.addEventListener('click', openCamera);
if (captureImageButton) captureImageButton.addEventListener('click', captureProductImage);
if (saveIdentifiedProductButton) saveIdentifiedProductButton.addEventListener('click', saveIdentifiedProduct);
if (saveProductButton) saveProductButton.addEventListener('click', createProduct);
if (capturePhotoButton) capturePhotoButton.addEventListener('click', capturePhoto);
if (recognizeTextButton) recognizeTextButton.addEventListener('click', recognizeTextFromCapturedImage);

const productImageInput = document.getElementById('productImageInput');
if (productImageInput) {
    productImageInput.addEventListener('change', event => {
        const file = event.target.files[0];
        if (file) {
            const imageURL = URL.createObjectURL(file);
            const previewImage = document.getElementById('previewImage');
            previewImage.src = imageURL;
            previewImage.style.display = 'block';
        }
    });
}

function openCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(mediaStream => {
            stream = mediaStream;
            const videoElement = document.getElementById('video');
            videoElement.srcObject = mediaStream;
            videoElement.style.display = 'block';
            videoElement.play();
            toggleSteps('scan');
            videoElement.addEventListener('click', focusOnClick);
            startScanner();
        })
        .catch(error => showError("Error al acceder a la cámara: " + error.message));
}

function startScanner() {
    Quagga.init({
        inputStream: {
            type: "LiveStream",
            target: document.querySelector("#video"),
            constraints: { facingMode: "environment" }
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "upc_reader"]
        }
    }, err => {
        if (err) {
            showError("Error inicializando el escáner: " + err.message);
            return;
        }
        Quagga.start();
    });
}

Quagga.onDetected(data => {
    const code = data.codeResult.code;
    if (!code) return;

    if (lastScannedCode === code) {
        consecutiveMatches++;
    } else {
        consecutiveMatches = 1;
        lastScannedCode = code;
    }

    scanAttempts++;

    if (consecutiveMatches >= requiredMatches) {
        finishScanning(code);
    } else if (scanAttempts >= 10) {
        alert("No se pudo escanear de forma confiable. Intente nuevamente.");
        stopScanner();
    }
});

function finishScanning(code) {
    stopScanner();
    toggleSteps('identify');
    document.getElementById('barcodeResult').textContent = `Código de barras: ${code}`;
    identifyProduct(code);
}

function stopScanner() {
    Quagga.stop();
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    scanAttempts = 0;
    lastScannedCode = null;
    consecutiveMatches = 0;
}

function toggleSteps(step) {
    const steps = ['scanStep', 'identifyStep', 'createStep'];
    steps.forEach(s => document.getElementById(s)?.classList.add('hidden'));
    if (step === 'scan') document.getElementById('scanStep')?.classList.remove('hidden');
    if (step === 'identify') document.getElementById('identifyStep')?.classList.remove('hidden');
    if (step === 'create') document.getElementById('createStep')?.classList.remove('hidden');
}

function showError(message) {
    const errorElement = document.getElementById('errorDisplay');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        alert(message);
    }
}

function focusOnClick(event) {
    const video = event.target;
    const track = stream?.getVideoTracks()[0];
    const capabilities = track?.getCapabilities?.();

    if (capabilities?.focusMode?.includes('manual')) {
        const rect = video.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const focusPoint = clickX / rect.width;

        track.applyConstraints({
            advanced: [{ focusMode: 'manual', focusDistance: focusPoint }]
        }).catch(error => showError("Error aplicando enfoque manual: " + error.message));
    }
}

function captureProductImage() {
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/png');
    document.getElementById('previewImage').src = imageData;
    document.getElementById('previewImage').style.display = 'block';
    toggleSteps('create');
    stopScanner();
}

function identifyProduct(barcode) {
    document.getElementById('identifiedProductName').textContent = `Producto encontrado con código: ${barcode}`;
    document.getElementById('identifiedProductDescription').textContent = "Descripción generada automáticamente del producto.";
}

function saveIdentifiedProduct() {
    const name = document.getElementById('identifiedProductName').textContent;
    const description = document.getElementById('identifiedProductDescription').textContent;
    const resultContainer = document.getElementById('saveResultContainer');
    resultContainer.innerHTML = '';

    const resultText = document.createElement('p');
    resultText.textContent = 'Producto guardado: ' + name;

    const resultDescription = document.createElement('p');
    resultDescription.textContent = description;

    const image = document.getElementById('previewImage');
    const savedImage = document.createElement('img');
    savedImage.src = image.src;
    savedImage.style.maxWidth = '100px';

    resultContainer.appendChild(resultText);
    resultContainer.appendChild(resultDescription);
    resultContainer.appendChild(savedImage);
}

function createProduct() {
    const name = document.getElementById('productNameInput').value;
    const description = document.getElementById('productDescriptionInput').value;
    const image = document.getElementById('previewImage').src;

    const resultContainer = document.getElementById('saveResultContainer');
    resultContainer.innerHTML = '';

    const resultText = document.createElement('p');
    resultText.textContent = 'Producto personalizado guardado: ' + name;

    const resultDescription = document.createElement('p');
    resultDescription.textContent = description;

    const savedImage = document.createElement('img');
    savedImage.src = image;
    savedImage.style.maxWidth = '100px';

    resultContainer.appendChild(resultText);
    resultContainer.appendChild(resultDescription);
    resultContainer.appendChild(savedImage);
}

function capturePhoto() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(mediaStream => {
            const tempVideo = document.createElement('video');
            tempVideo.srcObject = mediaStream;
            tempVideo.autoplay = true;
            tempVideo.playsInline = true;
            tempVideo.style.width = '100%';
            document.body.appendChild(tempVideo);

            const captureButton = document.createElement('button');
            captureButton.textContent = 'Capturar';
            document.body.appendChild(captureButton);

            captureButton.addEventListener('click', () => {
                const canvas = document.createElement('canvas');
                canvas.width = tempVideo.videoWidth;
                canvas.height = tempVideo.videoHeight;
                canvas.getContext('2d').drawImage(tempVideo, 0, 0);

                const dataURL = canvas.toDataURL('image/png');
                const previewImage = document.getElementById('previewImage');
                previewImage.src = dataURL;
                previewImage.style.display = 'block';

                mediaStream.getTracks().forEach(track => track.stop());
                tempVideo.remove();
                captureButton.remove();
            });
        })
        .catch(error => showError("Error al acceder a la cámara: " + error.message));
}

function recognizeTextFromCapturedImage() {
    const image = document.getElementById('previewImage');
    if (!image.src) {
        showError("Primero debes capturar o subir una imagen.");
        return;
    }

    Tesseract.recognize(image.src, 'eng', { logger: m => console.log(m) })
        .then(result => {
            document.getElementById('ocrResult').textContent = result.data.text;
        })
        .catch(error => showError("Error reconociendo texto: " + error.message));
}

let stream;
let scanAttempts = 0;
let lastScannedCode = null;
let consecutiveMatches = 0;
const requiredMatches = 3;

const databases = [
    { name: "Local", data: window.localProductDB || [] },
    { name: "Tienda1", data: window.externalProductDB1 || [] },
    { name: "Tienda2", data: window.externalProductDB2 || [] }
];

document.getElementById('openCameraButton')?.addEventListener('click', openCamera);
document.getElementById('captureImageButton')?.addEventListener('click', captureProductImage);
document.getElementById('saveIdentifiedProductButton')?.addEventListener('click', saveIdentifiedProduct);
document.getElementById('saveProductButton')?.addEventListener('click', createProduct);
document.getElementById('capturePhotoButton')?.addEventListener('click', capturePhoto);
document.getElementById('recognizeTextButton')?.addEventListener('click', recognizeTextFromCapturedImage);

document.getElementById('productImageInput')?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        const imageURL = URL.createObjectURL(file);
        const previewImage = document.getElementById('previewImage');
        previewImage.src = imageURL;
        previewImage.style.display = 'block';
    }
});

function openCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(mediaStream => {
            stream = mediaStream;
            const videoElement = document.getElementById('video');
            videoElement.srcObject = stream;
            videoElement.style.display = 'block';
            videoElement.play();
            toggleSteps('scan');
            videoElement.addEventListener('click', focusOnClick);
            startScanner();
        })
        .catch(err => showError("Error al acceder a la cámara: " + err.message));
}

function startScanner() {
    Quagga.init({
        inputStream: {
            type: "LiveStream",
            target: document.querySelector("#video"),
            constraints: { facingMode: "environment" }
        },
        decoder: {
            readers: ["ean_reader", "ean_8_reader", "code_128_reader", "upc_reader"]
        }
    }, err => {
        if (err) return showError("Error inicializando escáner: " + err.message);
        Quagga.start();
    });
}

Quagga.onDetected(data => {
    const code = data?.codeResult?.code;
    if (!isValidBarcode(code)) return;

    if (code === lastScannedCode) {
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

function isValidBarcode(code) {
    return typeof code === 'string' && /^[0-9]{8,13}$/.test(code); 
}

function finishScanning(code) {
    stopScanner();
    toggleSteps('identify');
    document.getElementById('barcodeResult').textContent = `Código escaneado: ${code}`;
    identifyProduct(code);
}

function stopScanner() {
    Quagga.stop();
    stream?.getTracks().forEach(track => track.stop());
    scanAttempts = 0;
    lastScannedCode = null;
    consecutiveMatches = 0;
}

function toggleSteps(step) {
    const steps = ['scanStep', 'identifyStep', 'createStep'];
    steps.forEach(id => document.getElementById(id)?.classList.add('hidden'));
    document.getElementById(`${step}Step`)?.classList.remove('hidden');
}

function identifyProduct(barcode) {
    for (const db of databases) {
        const product = db.data.find(p => p.code === barcode);
        if (product) {
            document.getElementById('identifiedProductName').textContent = `${product.name} (${db.name})`;
            document.getElementById('identifiedProductDescription').textContent = product.description || "Sin descripción.";
            return;
        }
    }

    fetchProductFromOpenFoodFacts(barcode);
}

function fetchProductFromOpenFoodFacts(barcode) {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json?country=ar`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.product && data.product.countries_tags && data.product.countries_tags.includes("ar")) {
                document.getElementById('identifiedProductName').textContent = `${data.product.product_name} (Open Food Facts)`;
                document.getElementById('identifiedProductDescription').textContent = data.product.ingredients_text || "Sin descripción.";
            } else {
                document.getElementById('identifiedProductName').textContent = `Producto no encontrado: ${barcode}`;
                document.getElementById('identifiedProductDescription').textContent = "Puedes agregarlo manualmente.";
            }
        })
        .catch(err => showError("Error al buscar en Open Food Facts: " + err.message));
}

function saveIdentifiedProduct() {
    const name = document.getElementById('identifiedProductName').textContent;
    const description = document.getElementById('identifiedProductDescription').textContent;
    const image = document.getElementById('previewImage').src;

    const container = document.getElementById('saveResultContainer');
    container.innerHTML = `<p>Producto guardado: ${name}</p><p>${description}</p><img src="${image}" style="max-width:100px">`;
}

function createProduct() {
    const name = document.getElementById('productNameInput').value;
    const description = document.getElementById('productDescriptionInput').value;
    const image = document.getElementById('previewImage').src;

    const container = document.getElementById('saveResultContainer');
    container.innerHTML = `<p>Producto personalizado guardado: ${name}</p><p>${description}</p><img src="${image}" style="max-width:100px">`;
}

function capturePhoto() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(mediaStream => {
        const tempVideo = document.createElement('video');
        tempVideo.srcObject = mediaStream;
        tempVideo.autoplay = true;
        document.body.append(tempVideo);

        const captureBtn = document.createElement('button');
        captureBtn.textContent = 'Capturar';
        document.body.append(captureBtn);

        captureBtn.addEventListener('click', () => {
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
            captureBtn.remove();
        });
    }).catch(err => showError("Error cámara: " + err.message));
}

function recognizeTextFromCapturedImage() {
    const image = document.getElementById('previewImage');
    if (!image.src) return showError("Primero debes subir o capturar una imagen.");

    Tesseract.recognize(image.src, 'eng', { logger: m => console.log(m) })
        .then(result => {
            document.getElementById('ocrResult').textContent = result.data.text;
        })
        .catch(err => showError("Error OCR: " + err.message));
}

function focusOnClick(event) {
    const video = event.target;
    const track = stream?.getVideoTracks()[0];
    const capabilities = track?.getCapabilities?.();

    if (capabilities?.focusMode?.includes('manual')) {
        const rect = video.getBoundingClientRect();
        const focusPoint = (event.clientX - rect.left) / rect.width;
        track.applyConstraints({
            advanced: [{ focusMode: 'manual', focusDistance: focusPoint }]
        }).catch(error => showError("Error enfoque: " + error.message));
    }
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

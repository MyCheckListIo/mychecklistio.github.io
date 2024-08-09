let stream;

document.getElementById('openCameraButton').addEventListener('click', openCamera);
document.getElementById('captureImageButton')?.addEventListener('click', captureProductImage);
document.getElementById('saveIdentifiedProductButton').addEventListener('click', saveIdentifiedProduct);
document.getElementById('saveProductButton').addEventListener('click', createProduct);
document.getElementById('capturePhotoButton').addEventListener('click', capturePhoto);
document.getElementById('recognizeTextButton').addEventListener('click', recognizeTextFromCapturedImage);

document.getElementById('productImageInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const imageURL = URL.createObjectURL(file);
        document.getElementById('previewImage').src = imageURL;
        document.getElementById('previewImage').style.display = 'block';
    }
});

function openCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(mediaStream => {
            stream = mediaStream;
            const videoElement = document.getElementById('video');
            videoElement.srcObject = mediaStream;
            videoElement.style.display = 'block';
            videoElement.play();
            document.getElementById('scanStep').classList.remove('hidden');
            document.getElementById('identifyStep').classList.add('hidden');
            document.getElementById('createStep').classList.add('hidden');
            focusCode();
        })
        .catch(error => {
            console.error("Error accessing camera: ", error);
            alert("Error accessing camera: " + error.message);
        });
}

function focusCode() {
    Quagga.init({
        inputStream: {
            type: "LiveStream",
            target: document.querySelector("#video"),
            constraints: {
                facingMode: "environment"
            }
        },
        decoder: {
            readers: ["code_128_reader", "ean_reader", "upc_reader"]
        }
    }, err => {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(data => {
        const code = data.codeResult.code;
        document.getElementById('barcodeResult').textContent = `Código de barras: ${code}`;
        Quagga.stop();
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        document.getElementById('scanStep').classList.add('hidden');
        document.getElementById('identifyStep').classList.remove('hidden');
        identifyProduct(code);
    });
}

function identifyProduct(barcode) {
    fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
        .then(response => response.json())
        .then(data => {
            const productName = data.product ? data.product.product_name : "";
            const productImage = data.product && data.product.image_url ? data.product.image_url : 'placeholder.png';
                
            document.getElementById('productNameInput').value = productName;
            document.getElementById('productImage').src = productImage;
            
            document.getElementById('identifyStep').classList.remove('hidden');
            document.getElementById('createStep').classList.add('hidden');
        })
        .catch(error => console.error("Error fetching product data: ", error));
}

function recognizeTextFromImage(imageElement) {
    Tesseract.recognize(
        imageElement.src,
        'eng',
        { logger: info => console.log(info) }
    ).then(({ data: { text } }) => {
        console.log('Texto reconocido:', text);
        document.getElementById('recognizedTextOutput').textContent = text;
        document.getElementById('newProductName').value = text;
    })
    .catch(error => console.error("Error en el reconocimiento de texto: ", error));
}

function capturePhoto() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then(mediaStream => {
            const videoElement = document.createElement('video');
            videoElement.srcObject = mediaStream;
            videoElement.play();

            const captureButton = document.createElement('button');
            captureButton.textContent = 'Capturar Foto';
            captureButton.addEventListener('click', () => {
                const canvas = document.createElement('canvas');
                canvas.width = videoElement.videoWidth;
                canvas.height = videoElement.videoHeight;
                const context = canvas.getContext('2d');
                context.drawImage(videoElement, 0, 0);
                
                const imageURL = canvas.toDataURL('image/png');
                document.getElementById('productImage').src = imageURL;
                
                mediaStream.getTracks().forEach(track => track.stop());
                document.body.removeChild(preview);
            });

            const preview = document.createElement('div');
            preview.style.position = 'fixed';
            preview.style.top = '0';
            preview.style.left = '0';
            preview.style.width = '100%';
            preview.style.height = '100%';
            preview.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            preview.style.display = 'flex';
            preview.style.justifyContent = 'center';
            preview.style.alignItems = 'center';
            preview.appendChild(videoElement);
            preview.appendChild(captureButton);
            document.body.appendChild(preview);
        })
        .catch(error => {
            console.error("Error accessing camera for image capture: ", error);
        });
}

function saveIdentifiedProduct() {
    const productName = document.getElementById('productNameInput').value;
    const productImageURL = document.getElementById('productImage').src;

    if (productName && productImageURL) {
        const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
        const productData = {
            name: productName,
            image: productImageURL
        };

        savedItems.push(productData);
        localStorage.setItem('savedItems', JSON.stringify(savedItems));

        document.getElementById('saveMessage').innerHTML = `
            Producto identificado guardado correctamente.
            <br>
            <a href="productos.html" class="btn">Ir a productos guardados</a>
            <br>
            <button id="addAnotherProductButton" class="btn">Agregar otro producto</button>
        `;

        document.getElementById('addAnotherProductButton').addEventListener('click', () => {
            document.getElementById('identifyStep').classList.add('hidden');
            document.getElementById('scanStep').classList.remove('hidden');
        });
    } else {
        document.getElementById('saveMessage').textContent = "Por favor, complete todos los campos.";
    }
}

function createProduct() {
    const productName = document.getElementById('newProductName').value;
    const productDetails = document.getElementById('newProductDetails').value;
    const productImage = document.getElementById('previewImage').src;

    if (productName && productDetails && productImage) {
        console.log("Nuevo producto creado:", {
            name: productName,
            details: productDetails,
            image: productImage
        });

        alert('Nuevo producto creado con éxito.');
        document.getElementById('newProductName').value = '';
        document.getElementById('newProductDetails').value = '';
        document.getElementById('previewImage').style.display = 'none';
    } else {
        alert('Por favor, complete todos los campos.');
    }
}

function recognizeTextFromCapturedImage() {
    const imageElement = document.getElementById('productImage');
    recognizeTextFromImage(imageElement);
}

function showSaveMessage(message) {
    document.getElementById('saveMessage').textContent = message;
}

function showSuccessMessage() {
    document.getElementById('successMessage').textContent = "¡Producto guardado con éxito!";
}


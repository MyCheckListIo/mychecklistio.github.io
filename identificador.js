let stream;

// Event listeners
document.getElementById('openCameraButton').addEventListener('click', () => {
    openCamera();
});

document.getElementById('captureImageButton').addEventListener('click', () => {
    captureProductImage();
});

document.getElementById('saveIdentifiedProductButton').addEventListener('click', () => {
    saveIdentifiedProduct();
});

document.getElementById('saveProductButton').addEventListener('click', () => {
    createProduct();
});

document.getElementById('productImageInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const imageURL = URL.createObjectURL(file);
        document.getElementById('previewImage').src = imageURL;
        document.getElementById('previewImage').style.display = 'block';
    }
});

// Open camera and start scanning
function openCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((mediaStream) => {
            stream = mediaStream;
            const videoElement = document.getElementById('video');
            videoElement.srcObject = stream;
            videoElement.style.display = 'block';
            videoElement.play();
            document.getElementById('scanStep').classList.remove('hidden');
            document.getElementById('identifyStep').classList.add('hidden');
            document.getElementById('createStep').classList.add('hidden');
            focusCode();
        })
        .catch((error) => {
            console.error("Error accessing camera: ", error);
        });
}

// Initialize barcode scanner
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
    }, function (err) {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected((data) => {
        const code = data.codeResult.code;
        document.getElementById('barcodeResult').textContent = `Código de barras: ${code}`;
        Quagga.stop();
        stream.getTracks().forEach(track => track.stop());
        document.getElementById('scanStep').classList.add('hidden');
        document.getElementById('identifyStep').classList.remove('hidden');
        identifyProduct(code);
    });
}

// Identify product using API or show manual entry form
function identifyProduct(barcode) {
    fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 1 && data.product) {
                const productName = data.product.product_name;
                const productImage = data.product.image_url || 'placeholder.png';
                
                document.getElementById('productName').textContent = productName;
                document.getElementById('productImage').src = productImage;
                
                document.getElementById('identifyStep').classList.add('hidden');
                document.getElementById('createStep').classList.remove('hidden');
            } else {
                document.getElementById('productName').textContent = "Producto no encontrado";
                document.getElementById('productImage').src = 'placeholder.png';
                
                document.getElementById('identifyStep').classList.add('hidden');
                document.getElementById('createStep').classList.remove('hidden');
            }
        })
        .catch(error => console.error("Error fetching product data: ", error));
}

// Capture product image using camera
function captureProductImage() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream) => {
            const videoElement = document.createElement('video');
            videoElement.srcObject = mediaStream;
            videoElement.play();

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
            
            const previewVideo = document.createElement('video');
            previewVideo.srcObject = mediaStream;
            previewVideo.style.maxWidth = '90%';
            previewVideo.style.maxHeight = '90%';
            previewVideo.autoplay = true;
            
            const captureButton = document.createElement('button');
            captureButton.textContent = 'Capturar';
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

            preview.appendChild(previewVideo);
            preview.appendChild(captureButton);
            document.body.appendChild(preview);
        })
        .catch((error) => {
            console.error("Error accessing camera for image capture: ", error);
        });
}

// Save identified product
function saveIdentifiedProduct() {
    const productName = document.getElementById('productName').textContent;
    const productImageURL = document.getElementById('productImage').src;

    if (productName && productImageURL) {
        const productData = {
            name: productName,
            image: productImageURL
        };

        // Store product data in local storage
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(productData);
        localStorage.setItem('products', JSON.stringify(products));
        
        document.getElementById('saveMessage').textContent = "Producto identificado y guardado correctamente";
    } else {
        document.getElementById('saveMessage').textContent = "No se puede guardar el producto. Asegúrate de que el nombre y la imagen están disponibles.";
    }
}

// Create or update product information
function createProduct() {
    const newProductName = document.getElementById('newProductName').value;
    const newProductDetails = document.getElementById('newProductDetails').value;
    const newProductImage = document.getElementById('productImageInput').files[0];
    const productImageURL = newProductImage ? URL.createObjectURL(newProductImage) : 'placeholder.png';

    if (newProductName) {
        const productData = {
            name: newProductName,
            details: newProductDetails,
            image: productImageURL
        };

        // Store product data in local storage
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.push(productData);
        localStorage.setItem('products', JSON.stringify(products));
        
        document.getElementById('saveMessage').textContent = "Producto guardado correctamente";
    } else {
        document.getElementById('saveMessage').textContent = "Por favor, ingresa un nombre para el producto";
    }
}

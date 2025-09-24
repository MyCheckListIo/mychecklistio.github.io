let stream;
let lastCode = null;
let consecutiveMatches = 0;
const requiredMatches = 3;
const maxAttempts = 30;
let attemptCounter = 0;
let lastFetchedDescription = '';

document.getElementById('openCameraButton')?.addEventListener('click', openCamera);
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
  attemptCounter = 0;
  lastCode = null;
  consecutiveMatches = 0;
  try { Quagga.stop(); } catch (e) {}
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(mediaStream => {
      stream = mediaStream;
      const videoElement = document.getElementById('video');
      videoElement.srcObject = stream;
      videoElement.setAttribute('playsinline', 'true');
      videoElement.style.display = 'block';
      videoElement.play();
      toggleSteps('scan');
      startScanner();
      ensureScanPreview();
    })
    .catch(err => showError('Error al acceder a la cámara: ' + err.message));
}

function startScanner() {
  try { Quagga.stop(); } catch (e) {}
  Quagga.init({
    inputStream: {
      type: 'LiveStream',
      target: document.querySelector('#video'),
      constraints: { facingMode: 'environment' }
    },
    decoder: {
      readers: ['ean_reader', 'ean_8_reader', 'code_128_reader', 'upc_reader']
    },
    locate: true
  }, err => {
    if (err) return showError('Error inicializando escáner: ' + err.message);
    Quagga.start();
  });
  Quagga.offDetected();
  Quagga.onDetected(handleDetected);
}

function handleDetected(data) {
  attemptCounter++;
  const code = (data?.codeResult?.code || '').trim();
  updateScanPreview(code, data);

  if (!isValidBarcode(code)) {
    if (attemptCounter >= maxAttempts) {
      showError('No se detectaron códigos válidos. Intentá enfocar mejor o usar foto.');
      stopScanner();
    }
    return;
  }

  if (lastCode !== code) {
    lastCode = code;
    consecutiveMatches = 1;
  } else {
    consecutiveMatches++;
  }

  if (attemptCounter % 10 === 0) {
    consecutiveMatches = 0;
    lastCode = null;
  }

  updateProgressUI(consecutiveMatches, requiredMatches, code);

  if (consecutiveMatches >= requiredMatches) {
    finishScanning(code);
  } else if (attemptCounter >= maxAttempts) {
    showError('No se pudo escanear de forma confiable. Intentá nuevamente.');
    stopScanner();
  }
}

function isValidBarcode(code) {
  return typeof code === 'string' && /^[0-9]{8,14}$/.test(code);
}

function finishScanning(code) {
  stopScanner();
  showConfirmationDialog(code);
}

function stopScanner() {
  try { Quagga.stop(); } catch (e) {}
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
  lastCode = null;
  consecutiveMatches = 0;
  attemptCounter = 0;
  clearScanPreview();
}

function toggleSteps(step) {
  const steps = ['scanStep', 'identifyStep', 'createStep'];
  steps.forEach(id => document.getElementById(id)?.classList.add('hidden'));
  document.getElementById(`${step}Step`)?.classList.remove('hidden');
}

function fetchProductFromOpenFoodFacts(barcode) {
  const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json?fields=product_name,brands,ingredients_text,image_front_small_url,countries_tags`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === 1 && data.product && Array.isArray(data.product.countries_tags) && data.product.countries_tags.includes('ar')) {
        const p = data.product;
        const name = p.product_name || p.brands || `Producto ${barcode}`;
        const desc = p.ingredients_text || 'Sin descripción.';
        lastFetchedDescription = desc;
        const imgUrl = p.image_front_small_url || '';
        const productImage = document.getElementById('productImage');
        if (imgUrl && productImage) {
          productImage.src = imgUrl;
          productImage.style.display = 'block';
        }
        const nameInput = document.getElementById('productNameInput');
        if (nameInput) nameInput.value = name;
        const saveMsg = document.getElementById('saveMessage1');
        if (saveMsg) saveMsg.innerHTML = `<p>${desc}</p>`;
      } else {
        const nameInput = document.getElementById('productNameInput');
        if (nameInput) nameInput.value = `No encontrado: ${barcode}`;
        lastFetchedDescription = '';
        const saveMsg = document.getElementById('saveMessage1');
        if (saveMsg) saveMsg.innerHTML = `<p>Producto no encontrado. Podés agregarlo manualmente.</p>`;
      }
      toggleSteps('identify');
      document.getElementById('barcodeResult') && (document.getElementById('barcodeResult').textContent = `Código confirmado: ${barcode}`);
    })
    .catch(err => showError('Error al buscar en Open Food Facts: ' + err.message));
}

function saveIdentifiedProduct() {
  const name = (document.getElementById('productNameInput')?.value || '').trim();
  const description = lastFetchedDescription || (document.getElementById('saveMessage1')?.textContent || '').trim();
  const imageEl = document.getElementById('productImage') || document.getElementById('previewImage');
  const image = imageEl?.src || '';
  if (!name) return showError('Ingrese un nombre antes de guardar.');
  const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
  const product = { id: new Date().toISOString(), name, description, image, category: 'default' };
  savedItems.push(product);
  localStorage.setItem('savedItems', JSON.stringify(savedItems));
  const container = document.getElementById('saveMessage1');
  if (container) container.innerHTML = `<p>Producto guardado: ${name}</p>`;
}

function createProduct() {
  const name = document.getElementById('newProductName')?.value || '';
  const description = document.getElementById('newProductDetails')?.value || '';
  const image = document.getElementById('previewImage')?.src || '';
  if (!name.trim()) return showError('Ingrese nombre para el producto.');
  const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
  savedItems.push({ id: new Date().toISOString(), name: name.trim(), description: description.trim(), image, category: 'manual' });
  localStorage.setItem('savedItems', JSON.stringify(savedItems));
  document.getElementById('saveMessage2') && (document.getElementById('saveMessage2').innerHTML = `<p>Guardado personalizado: ${name}</p>`);
}

function capturePhoto() {
  navigator.mediaDevices.getUserMedia({ video: true }).then(mediaStream => {
    const tempVideo = document.createElement('video');
    tempVideo.srcObject = mediaStream;
    tempVideo.autoplay = true;
    tempVideo.style.position = 'fixed';
    tempVideo.style.left = '-10000px';
    document.body.append(tempVideo);
    const captureBtn = document.createElement('button');
    captureBtn.textContent = 'Capturar';
    captureBtn.style.position = 'fixed';
    captureBtn.style.left = '-10000px';
    document.body.append(captureBtn);
    captureBtn.addEventListener('click', () => {
      const canvas = document.createElement('canvas');
      canvas.width = tempVideo.videoWidth;
      canvas.height = tempVideo.videoHeight;
      canvas.getContext('2d').drawImage(tempVideo, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      const previewImage = document.getElementById('previewImage');
      if (previewImage) {
        previewImage.src = dataURL;
        previewImage.style.display = 'block';
      }
      mediaStream.getTracks().forEach(track => track.stop());
      tempVideo.remove();
      captureBtn.remove();
    });
    captureBtn.click();
  }).catch(err => showError('Error cámara: ' + err.message));
}

function recognizeTextFromCapturedImage() {
  const image = document.getElementById('previewImage');
  if (!image || !image.src) return showError('Primero debes subir o capturar una imagen.');
  Tesseract.recognize(image.src, 'eng', { logger: m => console.log(m) })
    .then(result => {
      document.getElementById('ocrResult') && (document.getElementById('ocrResult').textContent = result.data.text);
    })
    .catch(err => showError('Error OCR: ' + err.message));
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

function ensureScanPreview() {
  if (!document.getElementById('scanPreview')) {
    const p = document.createElement('div');
    p.id = 'scanPreview';
    p.style.marginTop = '8px';
    p.style.fontSize = '0.9rem';
    const container = document.querySelector('.menu-container') || document.body;
    container.insertBefore(p, container.firstChild);
  }
  updateScanPreview('', null);
}

function updateScanPreview(code, data) {
  const el = document.getElementById('scanPreview');
  if (!el) return;
  const progressText = lastCode ? `Progreso: ${consecutiveMatches}/${requiredMatches}` : 'Progreso: 0/' + requiredMatches;
  let lastList = el.dataset.lastlist ? JSON.parse(el.dataset.lastlist) : [];
  if (code) {
    lastList.unshift({ code, t: Date.now() });
    lastList = lastList.slice(0, 8);
    el.dataset.lastlist = JSON.stringify(lastList);
  }
  const htmlList = (lastList.length ? lastList.map((r, i) => `<div>${i + 1}. ${r.code}</div>`).join('') : '<div>No hay lecturas aún</div>');
  el.innerHTML = `<strong>Lecturas recientes</strong><div style="max-height:120px;overflow:auto;">${htmlList}</div><div style="margin-top:6px;"><strong>${progressText}</strong></div>`;
}

function clearScanPreview() {
  const el = document.getElementById('scanPreview');
  if (el) {
    el.dataset.lastlist = JSON.stringify([]);
    el.innerHTML = `<strong>Lecturas recientes</strong><div>No hay lecturas aún</div>`;
  }
  const br = document.getElementById('barcodeResult');
  if (br) br.textContent = '';
}

function showConfirmationDialog(code) {
  const existing = document.getElementById('scanConfirmOverlay');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.id = 'scanConfirmOverlay';
  overlay.style.position = 'fixed';
  overlay.style.left = 0;
  overlay.style.top = 0;
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0,0,0,0.6)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = 9999;
  const box = document.createElement('div');
  box.style.background = '#fff';
  box.style.padding = '20px';
  box.style.borderRadius = '8px';
  box.style.maxWidth = '420px';
  box.style.width = '90%';
  box.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
  box.innerHTML = `
    <h3 style="margin:0 0 10px 0;">Confirmar código</h3>
    <p id="confirmMsg">Se detectó: <strong id="detCode">${code}</strong></p>
    <input id="confirmBarcodeInput" value="${code}" style="width:100%;padding:8px;margin-bottom:8px;font-size:1rem" />
    <div id="checksumStatus" style="margin-bottom:10px;color:#555"></div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button id="retryScanBtn" style="padding:8px 12px">Reintentar</button>
      <button id="forceUseBtn" style="padding:8px 12px">Usar igual</button>
      <button id="confirmCodeBtn" style="padding:8px 12px;background:#2b8aef;color:#fff;border:none;border-radius:4px">Confirmar</button>
    </div>`;
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  const input = document.getElementById('confirmBarcodeInput');
  const status = document.getElementById('checksumStatus');
  function updateChecksum() {
    const v = (input.value || '').trim();
    if (!/^[0-9]{8,14}$/.test(v)) {
      status.textContent = 'Formato inválido (debe ser solo dígitos).';
      status.style.color = '#b33';
      return false;
    }
    const ok = verifyGTIN(v);
    status.textContent = ok ? 'Dígito verificador OK.' : 'Dígito verificador inválido.';
    status.style.color = ok ? '#198754' : '#b33';
    return ok;
  }
  updateChecksum();
  input.addEventListener('input', updateChecksum);
  document.getElementById('confirmCodeBtn').addEventListener('click', () => {
    const finalCode = (input.value || '').trim();
    if (!finalCode) return;
    const ok = updateChecksum();
    if (!ok) {
      const proceed = confirm('El dígito verificador parece inválido. ¿Deseás usarlo igual?');
      if (!proceed) return;
    }
    overlay.remove();
    document.getElementById('barcodeResult') && (document.getElementById('barcodeResult').textContent = `Código confirmado: ${finalCode}`);
    fetchProductFromOpenFoodFacts(finalCode);
  });
  document.getElementById('retryScanBtn').addEventListener('click', () => {
    overlay.remove();
    openCamera();
  });
  document.getElementById('forceUseBtn').addEventListener('click', () => {
    const finalCode = (input.value || '').trim();
    overlay.remove();
    document.getElementById('barcodeResult') && (document.getElementById('barcodeResult').textContent = `Código usado: ${finalCode}`);
    fetchProductFromOpenFoodFacts(finalCode);
  });
}

function verifyGTIN(code) {
  const digits = code.replace(/\D/g, '').split('').map(d => parseInt(d, 10));
  if (![8, 12, 13, 14].includes(digits.length)) return false;
  const check = digits[digits.length - 1];
  const without = digits.slice(0, digits.length - 1);
  const rev = without.slice().reverse();
  let sum = 0;
  for (let i = 0; i < rev.length; i++) {
    sum += rev[i] * (i % 2 === 0 ? 3 : 1);
  }
  const calc = (10 - (sum % 10)) % 10;
  return calc === check;
}

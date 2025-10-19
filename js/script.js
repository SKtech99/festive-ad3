/* main app script for Festive Ad Generator - Pinnacle Edition: Final */
let currentStep = 1;
let ownerDetails = {};
let selectedTemplate = '';

// Global states for current design
let currentFontClass = 'font-cinzel';
let currentShapeClass = 'shape-circle';
let currentFrameClass = 'frame-default';
let currentShadow = 'shadow-high';
let currentFontSize = 28;
let currentTextStrokeWidth = 0;
let currentTextStrokeColor = '#000000';
let currentTextColor = '#FFFFFF';
let currentAccentColor = '#D4AF37';
let currentOfferBannerStyle = 'banner-ribbon';
let currentCtaStyle = 'cta-gold';
let activeLayerId = 'mainMessageLayer';

// --- Drag & Resize Globals (Stabilized for touch/mobile) ---
let activeDraggable = null;
let isDragging = false;
let isResizing = false;
let initialX, initialY;
let initialLeft, initialTop, initialWidth, initialHeight;
let activeDraggableOriginalPosition = {};

// --- UNDO/REDO HISTORY ---
const MAX_HISTORY = 10;
let history = [];
let historyIndex = -1;

// --- EXPANDED OPTIONS (Used for Initialization) ---

const FRAME_OPTIONS = [ 
    { name: 'Classic Gold', class: 'frame-default' },
    { name: 'Maroon Temple', class: 'frame-temple' },
    { name: 'Subtle Border', class: 'frame-subtle' },
    { name: 'Corner Swirls', class: 'frame-swirl' },
    { name: 'Traditional Arch', class: 'frame-arch' }, 
    { name: 'Art Deco Outline', class: 'frame-artdeco' }, 
    { name: 'No Frame', class: 'frame-none' },
];

const SHAPE_OPTIONS = [
    { name: 'Circle', class: 'shape-circle' },
    { name: 'Square', class: 'shape-square' },
    { name: 'Rounded Box', class: 'shape-rounded-box' },
    { name: 'Diamond Cut', class: 'shape-diamond' }, 
    { name: 'No Shape', class: 'shape-none'}
];

const SHADOW_OPTIONS = [ 
    { name: 'Heavy Glow', class: 'shadow-high' },
    { name: 'Subtle Lift', class: 'shadow-low' },
    { name: 'No Shadow', class: 'shadow-none' },
];

const COLOR_THEMES = [
    { name: 'Divine Gold', text: '#FFFFFF', accent: '#D4AF37', themeBgStart: '#fefbf8', themeBgEnd: '#fff1e6' },
    { name: 'Maroon Diwali', text: '#FFECB3', accent: '#C62828', themeBgStart: '#fff3e0', themeBgEnd: '#ffebee' }, 
    { name: 'Emerald', text: '#FFFFFF', accent: '#00A86B', themeBgStart: '#e8f5e9', themeBgEnd: '#d9f5da' },
    { name: 'Deep Saffron', text: '#FFFFFF', accent: '#FF9933', themeBgStart: '#fff3e0', themeBgEnd: '#ffedd0' },
    { name: 'Royal Blue', text: '#ADD8E6', accent: '#007FFF', themeBgStart: '#e0f2f7', themeBgEnd: '#c8e8f2' },
];

const DECORATIVE_ELEMENTS = [
    { name: 'Diya', src: 'assets/diya-icon.png', class: 'decor-diya', defaultWidth: '15%', defaultTop: '5%', defaultLeft: '50%' },
    { name: 'Om Symbol', src: 'assets/om-icon.png', class: 'decor-om', defaultWidth: '20%', defaultTop: '20%', defaultLeft: '50%' },
    { name: 'Swastik', src: 'assets/swastik-icon.png', class: 'decor-swastik', defaultWidth: '15%', defaultTop: '10%', defaultLeft: '15%' },
    { name: 'Ganesha', src: 'assets/ganesha-icon.png', class: 'decor-ganesha', defaultWidth: '25%', defaultTop: '30%', defaultLeft: '80%' },
    { name: 'Lakshmi Footprint', src: 'assets/lakshmi-foot.png', class: 'decor-lakshmi', defaultWidth: '20%', defaultTop: '70%', defaultLeft: '20%' },
];

const GARLAND_OPTIONS = [
    { name: 'Top Garland Gold', class: 'garland-top-gold', src: 'assets/garland-top-gold.png' },
    { name: 'Side Garland Red', class: 'garland-side-red', src: 'assets/garland-side-red.png' },
    { name: 'Bottom Border Floral', class: 'border-bottom-floral', src: 'assets/border-bottom-floral.png' },
    { name: 'Corner Accent', class: 'corner-accent-gold', src: 'assets/corner-accent-gold.png' },
    { name: 'Decorative Banner', class: 'decorative-banner-gold', src: 'assets/decorative-banner-gold.png' }
];

const FONT_OPTIONS = [ 
    { name: 'Divine Cinzel', class: 'font-cinzel' },
    { name: 'Flowing Vibes', class: 'font-great-vibes' },
    { name: 'Bold Poppins', class: 'font-poppins' },
    { name: 'Hand Dance', class: 'font-dancing-script' },
    { name: 'Calligraphy Tangerine', class: 'font-tangerine' },
    { name: 'Sacramento Script', class: 'font-sacramento' },
    { name: 'Old Style TT', class: 'font-old-standard-tt' },
    { name: 'Marcellus Serif', class: 'font-marcellus' },
    { name: 'Fauna One', class: 'font-fauna-one' },
    { name: 'Bungee Display', class: 'font-bungee' },
    { name: 'Montserrat Black', class: 'font-montserrat-black' },
    { name: 'Slabo Serif', class: 'font-slabo' },
    { name: 'Playfair Display', class: 'font-playfair-display' },
    { name: 'Cormorant Garamond', class: 'font-cormorant' },
    { name: 'Kaushan Script', class: 'font-kaushan-script' },
    { name: 'Rajdhani Sans', class: 'font-rajdhani' },
    { name: 'Vollkorn Serif', class: 'font-vollkorn' },
    { name: 'Josefin Slab', class: 'font-josefin-slab' },
    { name: 'Merriweather Serif', class: 'font-merriweather' },
    { name: 'Pacifico Script', class: 'font-pacifico' },
    { name: 'Berkshire Swash', class: 'font-berkshire-swash' },
    { name: 'Parisienne Script', class: 'font-parisienne' },
    { name: 'Libre Baskerville', class: 'font-libre-baskerville' },
    { name: 'Indie Flower', class: 'font-indie-flower' },
    { name: 'Shadows Into Light', class: 'font-shadows-into-light' },
    { name: 'Fira Condensed', class: 'font-fira-sans-extra-condensed' },
    { name: 'Source Serif', class: 'font-source-serif-4' },
    { name: 'Oswald Sans', class: 'font-oswald' },
    { name: 'Lato', class: 'font-lato' }
];

const DEFAULT_SHOP_NAME = "Happy Festivals from [Your Brand]!";
const DEFAULT_OWNER_NAME = "From: [Owner/Contact]";
const DEFAULT_PHONE = "+91-9876543210";
const DEFAULT_LOGO = "assets/Logo.jpg"; 

let currentActiveElement = null;

// --- UTILITY & FEEDBACK FUNCTIONS ---

function showLoading(show) {
    document.getElementById('loadingSpinner').style.display = show ? 'flex' : 'none';
}

function showMessage(msg) {
    const alertEl = document.getElementById('customAlert');
    alertEl.textContent = msg;
    alertEl.style.display = 'block';
    setTimeout(() => {
        alertEl.style.display = 'none';
    }, 3000);
}

function displayFileName(input) {
    const statusEl = document.getElementById('logoUploadStatus');
    if (input.files.length > 0) {
        statusEl.textContent = 'File uploaded: ' + input.files[0].name;
        statusEl.style.color = '#00A86B';
    } else {
        statusEl.textContent = 'No file chosen.';
        statusEl.style.color = '#9b1c1c';
    }
}

/* Step navigation */
function nextStep(step){
    showLoading(true);
    
    setTimeout(() => {
        const oldStep = document.getElementById('step' + currentStep);
        if (oldStep) oldStep.classList.remove('active');

        currentStep = step;
        const newStep = document.getElementById('step' + currentStep);
        if (newStep) newStep.classList.add('active');

        if (step === 4) {
            initializeControls(); 
            applyInitialStylesToPreview(); 
            initializeDragAndResize();
            setActiveLayer(activeLayerId, false); // Don't record history on initial load
        }
        
        showLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
}

/* Save details + read logo file */
function saveDetails(){
    const shop = document.getElementById('shopName').value.trim();
    const owner = document.getElementById('ownerName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const logoFile = document.getElementById('logo').files[0];

    ownerDetails.shopName = shop || DEFAULT_SHOP_NAME;
    ownerDetails.ownerName = owner || DEFAULT_OWNER_NAME;
    ownerDetails.phone = phone || DEFAULT_PHONE;
    ownerDetails.logoSrc = DEFAULT_LOGO; 

    showLoading(true);

    if(logoFile){
        const reader = new FileReader();
        reader.onload = function(e){
            ownerDetails.logoSrc = e.target.result;
            nextStep(3); 
        };
        if (logoFile.type.match('image.*')) {
            reader.readAsDataURL(logoFile);
        } else {
            showMessage("Invalid file type. Please upload an image (JPG/PNG).");
            nextStep(3);
        }
    } else {
        nextStep(3); 
    }
}

/* Select template and prepare preview - FIXED LOADING ISSUE */
function selectTemplate(imgSrc){
    showLoading(true);
    selectedTemplate = imgSrc;
    
    const bg = document.getElementById('statusBg');
    
    // Use a temporary Image object to reliably catch the load event, even from cache
    const tempImg = new Image();
    tempImg.src = imgSrc;

    tempImg.onload = function() {
        // Set the background source
        bg.src = imgSrc;
        
        // Set text contents, logo, etc.
        document.getElementById('overlayText').textContent = ownerDetails.shopName;
        document.getElementById('overlayOwner').textContent = ownerDetails.ownerName;
        document.getElementById('overlayPhone').textContent = ownerDetails.phone;
        
        const logo = document.getElementById('overlayLogo');
        if(ownerDetails.logoSrc && ownerDetails.logoSrc !== DEFAULT_LOGO){
            logo.src = ownerDetails.logoSrc;
            logo.style.display = 'block';
        } else {
            logo.style.display = 'none';
        }
        
        const card = document.querySelector('.status-card');
        card.classList.add('zoomIn');
        setTimeout(()=>card.classList.remove('zoomIn'),900);
        
        // Proceed to the next step, dismissing the loading screen
        nextStep(4);
    };
    
    tempImg.onerror = function() {
        showLoading(false);
        showMessage("Error loading template image. Proceeding with a blank background.");
        
        // Ensure the step advances even if the image fails to load
        nextStep(4);
    };
}


/* Download status as PNG using html2canvas - FINAL STABILITY FIX */
async function downloadStatus(){
    showMessage('Preparing high-resolution image... Please wait, this is a premium download!');
    showLoading(true);
    
    const area = document.getElementById('statusArea');
    
    document.querySelectorAll('.editable').forEach(el => el.blur());
    if (currentActiveElement) currentActiveElement.classList.remove('active-draggable');

    try {
        const confettiCanvas = await createConfettiOverlay(area.offsetWidth, area.offsetHeight);
        
        const adCanvas = await html2canvas(area, { 
            scale: window.devicePixelRatio * 2, 
            useCORS: true, 
            allowTaint: true,
            backgroundColor: null,
            scrollX: 0,
            scrollY: 0,
        });

        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = adCanvas.width;
        finalCanvas.height = adCanvas.height;
        const ctx = finalCanvas.getContext('2d');
        
        ctx.drawImage(adCanvas, 0, 0);
        
        if (confettiCanvas) {
            ctx.drawImage(confettiCanvas, 0, 0, adCanvas.width, adCanvas.height);
        }

        const link = document.createElement('a');
        link.download = 'DivineFestiveAd-Pinnacle.png';
        link.href = finalCanvas.toDataURL('image/png');
        link.click();
        
        showMessage('Download Complete! Share your premium ad!');
        
    } catch (err) {
        console.error("Download failed:", err);
        showMessage('Download failed. Please try again. Check console for details.');
    } finally {
        showLoading(false);
        if (currentActiveElement) currentActiveElement.classList.add('active-draggable');
        document.getElementById('confetti-container').innerHTML = '';
    }
}

// --- NEW 3D ANIMATION LOGIC (Confetti Overlay) ---
function createConfettiOverlay(width, height) {
    return new Promise(resolve => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        const numStars = 100;
        for (let i = 0; i < numStars; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 5 + 2;
            const color = ['#FFD700', '#FF4500', '#FFFFFF', '#ADFF2F', '#FF69B4'][Math.floor(Math.random() * 5)];

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = size * 1.5;
            ctx.fill();
        }
        resolve(canvas);
    });
}

/* ensure background music unmute on first user interaction */
document.addEventListener('click', function onFirstClick(){
    const bg = document.getElementById('bgMusic');
    if(bg && bg.muted) {
        bg.muted = false;
        bg.play().catch(e => console.log('Autoplay blocked.'));
    }
    document.removeEventListener('click', onFirstClick);
});

/* Floating diyas (visual flair) */
function createFloatingDiyas(count = 12){ 
    const container = document.getElementById('diya-container');
    if(!container) return;
    const diyaSrc = 'assets/diya.png'; 
    
    for(let i=0;i<count;i++){
        const img = document.createElement('img');
        img.src = diyaSrc; 
        img.className = 'diya';
        img.style.left = Math.random() * 100 + 'vw';
        img.style.top = (100 + Math.random() * 20) + 'vh';
        img.style.width = (30 + Math.random()*40) + 'px';
        img.style.height = 'auto';
        img.style.animation = `floatUp ${8 + Math.random()*10}s linear infinite`;
        img.style.animationDelay = (Math.random()*8) + 's';
        container.appendChild(img);
    }
}
window.addEventListener('load', ()=>{
    createFloatingDiyas(12);
});

// --- DRAG & RESIZE LOGIC (CRITICAL MOBILE FIX) ---
function initializeDragAndResize() {
    const card = document.getElementById('statusArea');

    // MOUSE EVENTS
    card.addEventListener('mousedown', startInteraction);
    card.addEventListener('mousemove', interact);
    card.addEventListener('mouseup', stopInteraction);
    card.addEventListener('mouseleave', stopInteraction);

    // TOUCH EVENTS (Crucial for mobile stability)
    card.addEventListener('touchstart', (e) => startInteraction(e.touches[0]));
    card.addEventListener('touchmove', (e) => interact(e.touches[0]));
    card.addEventListener('touchend', stopInteraction);

    function getDraggableElement(target) {
        if (target.classList.contains('draggable-layer') || target.id === 'overlayLogo') {
            return target;
        }
        return target.closest('.draggable-layer');
    }

    function startInteraction(e) {
        const target = e.target;
        const layer = getDraggableElement(target);
        
        if (!layer || layer.classList.contains('hidden') || layer.id !== activeLayerId) {
            return; 
        }

        if (target.closest('.editable')) {
            return;
        }

        // PREVENT MOBILE VIEWPORT SCROLLING WHEN DRAGGING STARTS
        if (e.type.startsWith('touch')) {
            e.preventDefault(); 
        }

        // Record history before changing state
        recordHistory(); 
        
        activeDraggable = layer;
        
        const rect = activeDraggable.getBoundingClientRect();
        const resizeHandleSize = 20; 
        
        const isNearRight = e.clientX > (rect.right - resizeHandleSize);
        const isNearBottom = e.clientY > (rect.bottom - resizeHandleSize);

        if (isNearRight && isNearBottom && activeDraggable.classList.contains('resizable')) {
            isResizing = true;
            initialWidth = rect.width;
            initialHeight = rect.height;
        } else {
            isDragging = true;
        }

        initialX = e.clientX;
        initialY = e.clientY;
        initialLeft = activeDraggable.offsetLeft;
        initialTop = activeDraggable.offsetTop;

        activeDraggable.style.transition = 'none'; 
        activeDraggable.classList.add('dragging');
    }

    function interact(e) {
        if (!activeDraggable || (!isDragging && !isResizing)) return;
        
        // CRITICAL FIX: PREVENT MOBILE VIEWPORT SCROLLING WHILE DRAGGING
        if (e.type.startsWith('touch')) e.preventDefault(); 

        const cardRect = card.getBoundingClientRect();
        const deltaX = e.clientX - initialX;
        const deltaY = e.clientY - initialY;

        if (isDragging) {
            let newLeft = initialLeft + deltaX;
            let newTop = initialTop + deltaY;

            // Clamp to bounds of the card (0 to width/height of card)
            newLeft = Math.max(0, Math.min(newLeft, cardRect.width - activeDraggable.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, cardRect.height - activeDraggable.offsetHeight));

            // Convert position to percentage
            activeDraggable.style.left = (newLeft / cardRect.width) * 100 + '%';
            activeDraggable.style.top = (newTop / cardRect.height) * 100 + '%';
            activeDraggable.style.transform = 'none';
        } else if (isResizing) {
            let newWidth = initialWidth + deltaX;
            let newHeight = initialHeight + deltaY;

            if (activeDraggable.id === 'overlayLogo' || activeDraggable.id === 'decorativeElementLayer') {
                const aspectRatio = initialWidth / initialHeight;
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    newHeight = newWidth / aspectRatio;
                } else {
                    newWidth = newHeight * aspectRatio;
                }
            }

            newWidth = Math.max(50, Math.min(newWidth, cardRect.width * 0.9)); 
            newHeight = Math.max(50, Math.min(newHeight, cardRect.height * 0.9));

            activeDraggable.style.width = (newWidth / cardRect.width) * 100 + '%';
            activeDraggable.style.height = (newHeight / cardRect.height) * 100 + '%';
        }
    }

    function stopInteraction() {
        if (activeDraggable) {
            activeDraggable.style.transition = 'all 0.3s ease'; 
            activeDraggable.classList.remove('dragging');
            activeDraggable = null;
        }
        isDragging = false;
        isResizing = false;
    }

    card.addEventListener('mousemove', (e) => {
        const target = e.target;
        const layer = getDraggableElement(target);
        if (layer && layer.classList.contains('resizable') && layer.id === activeLayerId) {
            const rect = layer.getBoundingClientRect();
            const resizeHandleSize = 20;
            if (e.clientX > (rect.right - resizeHandleSize) && e.clientY > (rect.bottom - resizeHandleSize)) {
                layer.style.cursor = 'nwse-resize';
            } else {
                layer.style.cursor = 'grab';
            }
        } else if (layer && layer.id === activeLayerId) {
            layer.style.cursor = 'grab';
        } else {
            card.style.cursor = 'default';
        }
    });
}

// --- HISTORY & DELETE FUNCTIONS ---
function recordHistory() {
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }
    
    // Simple state snapshot: innerHTML of the status card
    history.push(document.getElementById('statusArea').innerHTML);
    
    if (history.length > MAX_HISTORY) {
        history.shift();
    } else {
        historyIndex++;
    }
}

function restoreHistoryState(index) {
    if (index >= 0 && index < history.length) {
        document.getElementById('statusArea').innerHTML = history[index];
        
        initializeDragAndResize();
        setActiveLayer(activeLayerId, false); 
        applyInitialStylesToPreview(); 
        
        showMessage(index < historyIndex ? 'Undid last action.' : 'Redid action.');
        historyIndex = index;
    }
}

function undoAction() {
    if (historyIndex > 0) {
        restoreHistoryState(historyIndex - 1);
    } else {
        showMessage('Nothing left to undo.');
    }
}

function redoAction() {
    if (historyIndex < history.length - 1) {
        restoreHistoryState(historyIndex + 1);
    } else {
        showMessage('Nothing left to redo.');
    }
}

function deleteActiveLayer() {
    if (activeLayerId === 'mainMessageLayer' || activeLayerId === 'overlayLogo') {
        showMessage('Cannot delete main Logo or Message layer. Use the reset or hide options.');
        return;
    }
    
    recordHistory(); 
    
    const layer = document.getElementById(activeLayerId);
    if (layer) {
        if (activeLayerId === 'decorativeElementLayer' || activeLayerId === 'ctaBlockLayer') {
            layer.innerHTML = ''; 
        }
        layer.classList.add('hidden'); 
        setActiveLayer('mainMessageLayer', false); 
        showMessage('Layer deleted/cleared and hidden.');
    }
}

function clearCtaItems() {
    recordHistory();
    document.querySelector('#ctaBlockLayer .cta-block-grid').innerHTML = 
        `<div class="cta-item editable font-poppins" contenteditable="true" data-placeholder="Buy 1 Get 1 FREE"></div>
         <div class="cta-item editable font-poppins" contenteditable="true" data-placeholder="Extra 20% Off Code"></div>`;
    document.getElementById('ctaBlockLayer').classList.add('hidden');
    showMessage('CTA items cleared.');
}

function clearDecorativeElements() {
    recordHistory();
    document.getElementById('decorativeElementLayer').innerHTML = '';
    document.getElementById('decorativeElementLayer').classList.add('hidden');
    showMessage('All decorative elements cleared.');
}

// --- LAYER MANAGEMENT & UI SYNC ---

function setActiveLayer(layerId, syncHistory = true) {
    if (syncHistory) recordHistory();
    
    if (currentActiveElement) {
        currentActiveElement.classList.remove('active-draggable');
    }

    activeLayerId = layerId;
    currentActiveElement = document.getElementById(layerId);
    if (currentActiveElement) {
        currentActiveElement.classList.add('active-draggable');
        updateLayerControlsVisibility();
        updateLayerControlsValues();
    }

    const isResizable = (layerId === 'overlayLogo' || layerId === 'offerBannerLayer' || layerId === 'decorativeElementLayer');
    if (currentActiveElement) {
        if (isResizable) {
            currentActiveElement.classList.add('resizable');
        } else {
            currentActiveElement.classList.remove('resizable');
        }
    }
    
    document.querySelectorAll('#layerSelectionControls .option-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.targetLayer === layerId) {
            btn.classList.add('active');
        }
    });
}

function updateLayerControlsVisibility() {
    document.getElementById('textControls').classList.add('hidden');
    document.getElementById('imageControls').classList.add('hidden');
    document.getElementById('offerBannerControls').classList.add('hidden');
    document.getElementById('ctaBlockControls').classList.add('hidden');
    document.getElementById('decorativeControls').classList.add('hidden');

    if (activeLayerId === 'mainMessageLayer' || activeLayerId === 'offerBannerLayer' || activeLayerId === 'ctaBlockLayer') {
        document.getElementById('textControls').classList.remove('hidden');
    }
    if (activeLayerId === 'overlayLogo') {
        document.getElementById('imageControls').classList.remove('hidden');
    }
    if (activeLayerId === 'offerBannerLayer') {
        document.getElementById('offerBannerControls').classList.remove('hidden');
    }
    if (activeLayerId === 'ctaBlockLayer') {
        document.getElementById('ctaBlockControls').classList.remove('hidden');
    }
    if (activeLayerId === 'decorativeElementLayer') {
        document.getElementById('decorativeControls').classList.remove('hidden');
    }
}

function updateLayerControlsValues() {
    if (!currentActiveElement) return;

    const currentZ = parseInt(getComputedStyle(currentActiveElement).zIndex) || 20;
    document.getElementById('layerZIndex').value = currentZ;
    document.getElementById('currentZIndex').textContent = currentZ;

    const currentO = parseFloat(getComputedStyle(currentActiveElement).opacity) || 1;
    document.getElementById('layerOpacity').value = Math.round(currentO * 100);
    document.getElementById('currentOpacity').textContent = Math.round(currentO * 100);

    const firstEditable = currentActiveElement.querySelector('.editable');
    if (firstEditable) {
        const currentPxSize = parseInt(getComputedStyle(firstEditable).fontSize);
        document.getElementById('fontSizeSlider').value = currentPxSize;
        document.getElementById('currentFontSize').textContent = currentPxSize;

        const align = getComputedStyle(firstEditable).textAlign;
        document.querySelectorAll('#textAlignControls .option-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.align === align) btn.classList.add('active');
        });
        
        document.getElementById('textColorInput').value = rgbToHex(getComputedStyle(firstEditable).color);
    }
}

function resetActiveLayerPosition() {
    if (!currentActiveElement) return;
    
    recordHistory(); 

    currentActiveElement.style.left = '';
    currentActiveElement.style.top = '';
    currentActiveElement.style.width = '';
    currentActiveElement.style.height = '';
    currentActiveElement.style.transform = ''; 
    currentActiveElement.style.zIndex = '';
    currentActiveElement.style.opacity = '';
    
    if (currentActiveElement.classList.contains('text-layer')) {
        currentActiveElement.classList.remove(...Array.from(currentActiveElement.classList).filter(c => c.startsWith('pos-')));
        currentActiveElement.classList.add('pos-top-center');
    }

    updateLayerControlsValues();
    showMessage('Layer position reset.');
}

// --- CORE DESIGN LOGIC (Apply Theme, Font, etc.) ---

function applyInitialStylesToPreview() {
    // Apply theme colors first
    updateColor('text', currentTextColor);
    updateColor('accent', currentAccentColor);
    document.getElementById('textColorInput').value = currentTextColor;
    document.getElementById('accentColorInput').value = currentAccentColor;
    
    // Then apply specific layer styles
    applyFontToTextElements(currentFontClass);
    applyShapeClasses(currentShapeClass);
    applyShadowClass(currentShadow); 
    applyFrameClass(currentFrameClass); 
    updateFontSize(currentFontSize);
    updateTextStroke();

    const logo = document.getElementById('overlayLogo');
    if (ownerDetails.logoSrc && ownerDetails.logoSrc !== DEFAULT_LOGO) {
         logo.src = ownerDetails.logoSrc;
         logo.style.display = 'block';
    } else {
         logo.style.display = 'none';
    }
    toggleLogoBorder(true); 

    setOfferBannerStyle(currentOfferBannerStyle, false); 
    setCTAStyle(currentCtaStyle, false);

    // Ensure contenteditable fields have placeholder logic applied
    document.querySelectorAll('.editable').forEach(el => {
        if (el.textContent.trim() === '') {
            el.classList.add('empty');
        } else {
            el.classList.remove('empty');
        }
    });
}

function applyTheme(theme, clickedButton) {
    recordHistory();
    
    currentTextColor = theme.text;
    currentAccentColor = theme.accent;
    
    updateColor('text', theme.text);
    updateColor('accent', theme.accent);
    document.getElementById('textColorInput').value = theme.text;
    document.getElementById('accentColorInput').value = theme.accent;
    
    document.documentElement.style.setProperty('--theme-bg-start', theme.themeBgStart);
    document.documentElement.style.setProperty('--theme-bg-end', theme.themeBgEnd);

    document.querySelectorAll('#colorThemePresets .option-button').forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
}

function updateColor(type, color) {
    if (type === 'text') {
        currentTextColor = color;
        document.querySelectorAll('.editable').forEach(el => el.style.color = color);
    } else if (type === 'accent') {
        currentAccentColor = color;
        document.documentElement.style.setProperty('--accent', color);
    }
}

function rgbToHex(rgb) {
    if (!rgb || rgb.indexOf('rgb') === -1) return '#FFFFFF'; 
    const parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!parts) return '#FFFFFF';
    delete parts[0];
    for (let i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length === 1) parts[i] = '0' + parts[i];
    }
    return '#' + parts.join('');
}

// Helper to create option buttons
function createOptionButton(text, onClickHandler, className = 'option-button') {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = className;
    button.onclick = () => { recordHistory(); onClickHandler(); }; 
    return button;
}

// --- INITIALIZATION ---
function initializeControls() {
    if (document.getElementById('fontControls').children.length > 0) return; 
    
    // 1. Frame Buttons
    const frameControls = document.getElementById('frameControls');
    FRAME_OPTIONS.forEach(option => {
        const button = createOptionButton(option.name, () => updateFrame(option.class, button));
        if (option.class === currentFrameClass) button.classList.add('active');
        frameControls.appendChild(button);
    });

    // 2. Color Theme Presets
    const colorThemePresets = document.getElementById('colorThemePresets');
    COLOR_THEMES.forEach(theme => {
        const button = createOptionButton(theme.name.split(' ')[0], () => applyTheme(theme, button));
        button.style.background = `linear-gradient(45deg, ${theme.accent}, ${theme.text === '#FFFFFF' ? '#e0e0e0' : theme.text})`;
        button.style.color = theme.text;
        colorThemePresets.appendChild(button);
    });

    // 3. Font Buttons
    const fontControls = document.getElementById('fontControls');
    FONT_OPTIONS.forEach(option => {
        const button = createOptionButton(option.name.split(' ')[0], () => updateFont(option.class, button));
        button.classList.add(option.class);
        if (option.class === currentFontClass) button.classList.add('active');
        fontControls.appendChild(button);
    });

    // 4. Shadow Buttons
    const shadowGrid = document.getElementById('shadowControlsGrid');
    SHADOW_OPTIONS.forEach(option => {
        const button = createOptionButton(option.name, () => updateShadow(option.class, button));
        if (option.class === currentShadow) button.classList.add('active');
        shadowGrid.appendChild(button);
    });

    // 5. Shape Buttons (for logo)
    const shapeControls = document.getElementById('shapeControls');
    SHAPE_OPTIONS.forEach(option => {
        const button = createOptionButton(option.name, () => updateShape(option.class, button));
        if (option.class === currentShapeClass) button.classList.add('active');
        shapeControls.appendChild(button);
    });

    // 6. Decorative Element Grid 
    const decorativeElementGrid = document.getElementById('decorativeElementGrid');
    DECORATIVE_ELEMENTS.forEach(element => {
        const button = document.createElement('button');
        button.className = 'option-button decor-option';
        button.innerHTML = `<img src="${element.src}" alt="${element.name}" style="width:30px;height:30px;object-fit:contain;"><br><small>${element.name}</small>`;
        button.onclick = () => { recordHistory(); addDecorativeElement(element); };
        decorativeElementGrid.appendChild(button);
    });

    // 7. Garland Controls
    const garlandControls = document.getElementById('garlandControls');
    GARLAND_OPTIONS.forEach(garland => {
        const button = document.createElement('button');
        button.className = 'option-button decor-option';
        button.innerHTML = `<img src="${garland.src}" alt="${garland.name}" style="width:100%;height:30px;object-fit:contain;"><br><small>${garland.name}</small>`;
        button.onclick = () => { recordHistory(); addDecorativeGarland(garland); };
        garlandControls.appendChild(button);
    });
    
    // 8. Text Alignment Controls
    const textAlignControls = document.getElementById('textAlignControls');
    textAlignControls.querySelectorAll('.option-button').forEach(btn => {
        btn.onclick = () => { recordHistory(); updateTextAlign(btn.dataset.align); };
    });
}


// Applies font to all relevant text elements of the ACTIVE LAYER
function applyFontToTextElements(newFontClass) {
    if (!currentActiveElement) return;
    const textElements = currentActiveElement.querySelectorAll('.editable');
    textElements.forEach(el => {
        FONT_OPTIONS.forEach(f => el.classList.remove(f.class));
        el.classList.add(newFontClass);
    });
    currentFontClass = newFontClass;
}

function updateFont(newFontClass, clickedButton) {
    applyFontToTextElements(newFontClass);
    const buttons = clickedButton.parentElement.querySelectorAll('.option-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
}

function updateFontSize(size) {
    if (!currentActiveElement) return;
    const textElements = currentActiveElement.querySelectorAll('.editable');
    textElements.forEach(el => el.style.fontSize = size + 'px');
    currentFontSize = size;
    document.getElementById('currentFontSize').textContent = size;
}

function updateTextAlign(align) {
    if (!currentActiveElement) return;
    const textElements = currentActiveElement.querySelectorAll('.editable');
    textElements.forEach(el => el.style.textAlign = align);
    document.querySelectorAll('#textAlignControls .option-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.align === align) btn.classList.add('active');
    });
}

function updateTextStroke() {
    if (!currentActiveElement) return;
    const width = document.getElementById('textStrokeWidth').value + 'px';
    const color = document.getElementById('textStrokeColor').value;
    const textElements = currentActiveElement.querySelectorAll('.editable');
    textElements.forEach(el => {
        el.style.webkitTextStrokeWidth = width;
        el.style.webkitTextStrokeColor = color;
    });
    currentTextStrokeWidth = width;
    currentTextStrokeColor = color;
}

function applyShapeClasses(newShapeClass) {
    const logoEl = document.getElementById('overlayLogo');
    SHAPE_OPTIONS.forEach(s => logoEl.classList.remove(s.class));
    logoEl.classList.add(newShapeClass);
    currentShapeClass = newShapeClass;
}

function updateShape(newShapeClass, clickedButton) {
    applyShapeClasses(newShapeClass);
    const buttons = clickedButton.parentElement.querySelectorAll('.option-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
}

function toggleLogoBorder(show) {
    const logoEl = document.getElementById('overlayLogo');
    if (!logoEl) return;
    
    if (show) {
        logoEl.style.borderWidth = '4px';
    } else {
        logoEl.style.borderWidth = '0px';
    }
    const borderBtns = document.querySelectorAll('#imageControls button[data-border]');
    borderBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.border === String(show)) btn.classList.add('active');
    });
}

function applyShadowClass(newShadowClass) {
    const textLayers = document.querySelectorAll('.text-layer, .offer-layer, .cta-layer');
    textLayers.forEach(layer => {
        const textElements = layer.querySelectorAll('.editable');
        const shadowClasses = SHADOW_OPTIONS.map(o => o.class);
        textElements.forEach(el => {
            shadowClasses.forEach(c => el.classList.remove(c));
            el.classList.add(newShadowClass);
        });
    });
    currentShadow = newShadowClass;
}

function updateShadow(newShadowClass, clickedButton) {
    applyShadowClass(newShadowClass);
    const buttons = clickedButton.parentElement.querySelectorAll('.option-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
}

// NEW FRAME LOGIC
function applyFrameClass(newFrameClass) {
    const card = document.getElementById('statusArea');
    const decorElements = document.querySelectorAll('.frame-decor');
    FRAME_OPTIONS.forEach(f => card.classList.remove(f.class));
    card.classList.add(newFrameClass);

    decorElements.forEach(el => {
        el.style.display = (newFrameClass === 'frame-default' || newFrameClass === 'frame-temple' || newFrameClass === 'frame-swirl' || newFrameClass === 'frame-artdeco') ? 'block' : 'none';
    });
    currentFrameClass = newFrameClass;
}

function updateFrame(newFrameClass, clickedButton) {
    applyFrameClass(newFrameClass);
    const buttons = clickedButton.parentElement.querySelectorAll('.option-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
}

// --- OFFER BANNER & CTA BLOCKS (NEW) ---
function setOfferBannerStyle(styleClass, activateButton = true) {
    const offerBannerLayer = document.getElementById('offerBannerLayer');
    const bannerElement = offerBannerLayer.querySelector('.offer-banner');
    if (!bannerElement) return;

    recordHistory();
    bannerElement.classList.remove('banner-ribbon', 'banner-badge', 'banner-simple');
    bannerElement.classList.add(styleClass);
    currentOfferBannerStyle = styleClass;

    updateOfferBannerColors();

    if (activateButton) {
        document.querySelectorAll('#offerBannerStyleControls .option-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.style === styleClass) btn.classList.add('active');
        });
    }
}

function updateOfferBannerColors() {
    const offerBannerLayer = document.getElementById('offerBannerLayer');
    const bannerElement = offerBannerLayer.querySelector('.offer-banner');
    if (!bannerElement) return;

    recordHistory();
    const bgColor = document.getElementById('offerBannerBgColor').value;
    const textColor = '#FFFFFF'; 

    bannerElement.style.backgroundColor = bgColor;
    bannerElement.style.color = textColor;

    if (currentOfferBannerStyle === 'banner-ribbon') {
        bannerElement.style.setProperty('--ribbon-color', bgColor);
        bannerElement.style.setProperty('--ribbon-text-color', textColor);
    }
}

function setCTAStyle(styleClass, activateButton = true) {
    const ctaBlockLayer = document.getElementById('ctaBlockLayer');
    const ctaItems = ctaBlockLayer.querySelectorAll('.cta-item');
    if (ctaItems.length === 0) return;

    recordHistory();
    ctaItems.forEach(item => {
        item.classList.remove('cta-gold', 'cta-green', 'cta-blue');
        item.classList.add(styleClass);
    });
    currentCtaStyle = styleClass;

    if (activateButton) {
        document.querySelectorAll('#ctaBlockStyleControls .option-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.style === styleClass) btn.classList.add('active');
        });
    }
}

function addCtaItem() {
    const ctaBlockGrid = document.querySelector('#ctaBlockLayer .cta-block-grid');
    if (!ctaBlockGrid) return;
    
    recordHistory();
    document.getElementById('ctaBlockLayer').classList.remove('hidden');

    const newItem = document.createElement('div');
    newItem.className = `cta-item editable ${currentFontClass} ${currentCtaStyle} ${currentShadow}`;
    newItem.contentEditable = true;
    newItem.dataset.placeholder = "New Offer Here!";
    newItem.style.color = currentTextColor;
    
    ctaBlockGrid.appendChild(newItem);
    newItem.classList.add('empty');
    ctaBlockGrid.style.gridTemplateColumns = `repeat(${Math.min(ctaBlockGrid.children.length, 2)}, 1fr)`;
    showMessage('New CTA item added! Drag the layer to position.');
}


// --- DECORATIVE ELEMENTS (NEW) ---
function addDecorativeElement(elementData) {
    const decorativeLayer = document.getElementById('decorativeElementLayer');
    
    recordHistory();
    decorativeLayer.classList.remove('hidden'); 
    setActiveLayer('decorativeElementLayer', false); 

    const newDecor = document.createElement('img');
    newDecor.src = elementData.src;
    newDecor.className = `draggable-child ${elementData.class}`; 
    newDecor.style.position = 'absolute';
    newDecor.style.width = elementData.defaultWidth || '20%';
    newDecor.style.height = 'auto'; 
    
    const randX = Math.random() * 20 - 10;
    const randY = Math.random() * 20 - 10;
    newDecor.style.left = `calc(${elementData.defaultLeft || '50%'} + ${randX}%)`;
    newDecor.style.top = `calc(${elementData.defaultTop || '50%'} + ${randY}%)`;
    newDecor.style.transform = 'translate(-50%, -50%)';

    decorativeLayer.appendChild(newDecor);
    showMessage(`Added ${elementData.name}. Drag and resize it on the ad!`);
}

function addDecorativeGarland(garlandData) {
    const decorativeLayer = document.getElementById('decorativeElementLayer');
    
    recordHistory();
    decorativeLayer.classList.remove('hidden'); 
    setActiveLayer('decorativeElementLayer', false); 

    const newGarland = document.createElement('img');
    newGarland.src = garlandData.src;
    newGarland.className = `draggable-child decorative-garland ${garlandData.class}`;
    newGarland.style.position = 'absolute';
    newGarland.style.left = '0%';
    newGarland.style.transform = 'none';

    // Positioning based on class
    if (garlandData.class.includes('top')) {
        newGarland.style.top = '0%';
        newGarland.style.width = '100%';
    } else if (garlandData.class.includes('side')) {
        newGarland.style.top = '0%';
        newGarland.style.height = '100%';
        newGarland.style.width = 'auto';
    } else if (garlandData.class.includes('bottom')) {
        newGarland.style.bottom = '0%';
        newGarland.style.top = 'auto';
        newGarland.style.width = '100%';
    } else if (garlandData.class.includes('corner')) {
        newGarland.style.width = '30%';
        newGarland.style.right = '0%';
        newGarland.style.bottom = '0%';
        newGarland.style.top = 'auto';
        newGarland.style.left = 'auto';
    } else if (garlandData.class.includes('banner')) {
        newGarland.style.width = '80%';
        newGarland.style.left = '50%';
        newGarland.style.top = '50%';
        newGarland.style.transform = 'translate(-50%, -50%)';
    }
    
    decorativeLayer.appendChild(newGarland);
    showMessage(`Added ${garlandData.name}. Drag and resize it on the ad!`);
}

// Event listener to show placeholder for empty contenteditable fields
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('editable') && e.target.hasAttribute('contenteditable')) {
        const el = e.target;
        if (el.textContent.trim() === '') {
            el.classList.add('empty');
        } else {
            el.classList.remove('empty');
        }
    }
});

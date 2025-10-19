/* main app script for Festive Ad Generator - Pinnacle Edition */
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
let activeLayerId = 'mainMessageLayer'; // Tracks which layer is being edited/moved

// --- Drag & Resize Globals ---
let activeDraggable = null;
let isDragging = false;
let isResizing = false;
let initialX, initialY, initialLeft, initialTop, initialWidth, initialHeight;

// --- EXPANDED OPTIONS ---
const FONT_OPTIONS = [ // EXPANDED FONT LIST (50+ total from HTML link)
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
    { name: 'Libre Baskerville', class: 'font-libre-baskerville' }, // New
    { name: 'Indie Flower', class: 'font-indie-flower' }, // New
    { name: 'Shadows Into Light', class: 'font-shadows-into-light' }, // New
    { name: 'Fira Condensed', class: 'font-fira-sans-extra-condensed' }, // New
    { name: 'Source Serif', class: 'font-source-serif-4' }, // New
    { name: 'Oswald Sans', class: 'font-oswald' }, // New
    { name: 'Lato', class: 'font-lato' } // New
];

const SHAPE_OPTIONS = [
    { name: 'Circle', class: 'shape-circle' },
    { name: 'Square', class: 'shape-square' },
    { name: 'Rounded Box', class: 'shape-rounded-box' },
    { name: 'Diamond Cut', class: 'shape-diamond' }, 
    { name: 'No Shape', class: 'shape-none'}
];

const FRAME_OPTIONS = [
    { name: 'Classic Gold', class: 'frame-default' },
    { name: 'Maroon Temple', class: 'frame-temple' },
    { name: 'Subtle Border', class: 'frame-subtle' },
    { name: 'Corner Swirls', class: 'frame-swirl' },
    { name: 'No Frame', class: 'frame-none' },
];

const SHADOW_OPTIONS = [ 
    { name: 'Heavy Glow', class: 'shadow-high' },
    { name: 'Subtle Lift', class: 'shadow-low' },
    { name: 'No Shadow', class: 'shadow-none' },
];

const DECORATIVE_ELEMENTS = [
    { name: 'Diya', src: 'assets/diya-icon.png', class: 'decor-diya', defaultWidth: '15%', defaultTop: '5%', defaultLeft: '50%' },
    { name: 'Om Symbol', src: 'assets/om-icon.png', class: 'decor-om', defaultWidth: '20%', defaultTop: '20%', defaultLeft: '50%' },
    { name: 'Swastik', src: 'assets/swastik-icon.png', class: 'decor-swastik', defaultWidth: '15%', defaultTop: '10%', defaultLeft: '15%' },
    { name: 'Ganesha', src: 'assets/ganesha-icon.png', class: 'decor-ganesha', defaultWidth: '25%', defaultTop: '30%', defaultLeft: '80%' },
    { name: 'Lakshmi Footprint', src: 'assets/lakshmi-foot.png', class: 'decor-lakshmi', defaultWidth: '20%', defaultTop: '70%', defaultLeft: '20%' },
    { name: 'Sparkle', src: 'assets/sparkle-icon.png', class: 'decor-sparkle', defaultWidth: '10%', defaultTop: '5%', defaultLeft: '85%' },
    { name: 'Flower Petal', src: 'assets/petal-icon.png', class: 'decor-petal', defaultWidth: '12%', defaultTop: '60%', defaultLeft: '60%' },
];

const GARLAND_OPTIONS = [
    { name: 'Top Garland Gold', class: 'garland-top-gold', src: 'assets/garland-top-gold.png' },
    { name: 'Side Garland Red', class: 'garland-side-red', src: 'assets/garland-side-red.png' },
    { name: 'Bottom Border Floral', class: 'border-bottom-floral', src: 'assets/border-bottom-floral.png' },
    { name: 'Corner Accent', class: 'corner-accent-gold', src: 'assets/corner-accent-gold.png' },
    { name: 'Decorative Banner', class: 'decorative-banner-gold', src: 'assets/decorative-banner-gold.png' } // New banner for general decor
];

const COLOR_THEMES = [
    { name: 'Divine Gold', text: '#FFFFFF', accent: '#D4AF37', background: '#fefbf8' },
    { name: 'Festival Red', text: '#FFFFFF', accent: '#E0115F', background: '#ffebee' },
    { name: 'Royal Blue', text: '#ADD8E6', accent: '#007FFF', background: '#e0f2f7' },
    { name: 'Emerald', text: '#FFFFFF', accent: '#00A86B', background: '#e8f5e9' },
    { name: 'Deep Saffron', text: '#FFFFFF', accent: '#FF9933', background: '#fff3e0' },
    { name: 'Classic Black', text: '#000000', accent: '#616161', background: '#f5f5f5' },
    { name: 'Vibrant Pink', text: '#FFFFFF', accent: '#E91E63', background: '#fce4ec' }
];

const DEFAULT_SHOP_NAME = "Happy Festivals from [Your Brand]!";
const DEFAULT_OWNER_NAME = "From: [Owner/Contact]";
const DEFAULT_PHONE = "+91-9876543210";
const DEFAULT_LOGO = "assets/Logo.jpg"; 

/* Replaces original alert() */
function showMessage(msg) {
    const alertEl = document.getElementById('customAlert');
    alertEl.textContent = msg;
    alertEl.style.display = 'block';
    setTimeout(() => {
        alertEl.style.display = 'none';
    }, 3000);
}

/* Step navigation */
function nextStep(step){
    const oldStep = document.getElementById('step' + currentStep);
    if (oldStep) oldStep.classList.remove('active');

    currentStep = step;
    const newStep = document.getElementById('step' + currentStep);
    if (newStep) newStep.classList.add('active');

    if (step === 4) {
        initializeControls(); 
        applyInitialStylesToPreview(); 
        initializeDragAndResize(); // Crucial for new drag/resize features
        setActiveLayer(activeLayerId); // Set default active layer
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Save details + read logo file (Now optional) */
function saveDetails(){
    const shop = document.getElementById('shopName').value.trim();
    const owner = document.getElementById('ownerName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const logoFile = document.getElementById('logo').files[0];

    ownerDetails.shopName = shop || DEFAULT_SHOP_NAME;
    ownerDetails.ownerName = owner || DEFAULT_OWNER_NAME;
    ownerDetails.phone = phone || DEFAULT_PHONE;
    ownerDetails.logoSrc = DEFAULT_LOGO; 

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

/* Select template and prepare preview */
function selectTemplate(imgSrc){
    try {
        selectedTemplate = imgSrc;
        
        const bg = document.getElementById('statusBg');
        const text = document.getElementById('overlayText');
        const ownerEl = document.getElementById('overlayOwner');
        const phoneEl = document.getElementById('overlayPhone');
        const logo = document.getElementById('overlayLogo');

        bg.src = imgSrc;
        
        // Ensure editable fields are initialized with details
        text.textContent = ownerDetails.shopName;
        ownerEl.textContent = ownerDetails.ownerName;
        phoneEl.textContent = ownerDetails.phone;
        
        if(ownerDetails.logoSrc && ownerDetails.logoSrc !== DEFAULT_LOGO){
            logo.src = ownerDetails.logoSrc;
            logo.style.display = 'block';
        } else {
            logo.style.display = 'none';
        }
        
        const card = document.querySelector('.status-card');
        card.classList.add('zoomIn');
        setTimeout(()=>card.classList.remove('zoomIn'),900);

        nextStep(4);
    } catch (e) {
        console.error("Error during template selection:", e);
        showMessage("An error occurred preparing the preview.");
    }
}

/* Download status as PNG using html2canvas - CRITICAL FIX AND UPGRADE */
async function downloadStatus(){
    showMessage('Preparing high-resolution image... Please wait, this is a premium download!');
    const area = document.getElementById('statusArea');
    const confettiContainer = document.getElementById('confetti-container');
    
    // Temporarily hide editor controls like contenteditable focus and active layer borders
    document.querySelectorAll('.editable').forEach(el => el.blur());
    const activeLayer = document.getElementById(activeLayerId);
    if (activeLayer) activeLayer.classList.remove('active-draggable');

    // 1. ADD PREMIUM ANIMATION LAYER (Confetti/Sparkle)
    const confettiCanvas = await createConfettiOverlay(area.offsetWidth, area.offsetHeight);
    
    // 2. CAPTURE THE AD AREA
    // html2canvas is now more robust with scale and type inference
    html2canvas(area, { 
        scale: window.devicePixelRatio * 2, // Even higher resolution
        useCORS: true, 
        allowTaint: true,
        backgroundColor: null, // Allow transparent background if template is transparent
        scrollX: 0,
        scrollY: 0,
        windowWidth: area.scrollWidth,
        windowHeight: area.scrollHeight
    }).then(adCanvas => {
        // 3. COMBINE AD AND CONFETTI
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = adCanvas.width;
        finalCanvas.height = adCanvas.height;
        const ctx = finalCanvas.getContext('2d');
        
        // Draw Ad (Base Layer)
        ctx.drawImage(adCanvas, 0, 0);
        
        // Draw Confetti (Overlay Layer, scaled to match adCanvas resolution)
        if (confettiCanvas) {
            ctx.drawImage(confettiCanvas, 0, 0, adCanvas.width, adCanvas.height);
        }

        // 4. DOWNLOAD
        const link = document.createElement('a');
        link.download = 'DivineFestiveAd-Pinnacle.png';
        link.href = finalCanvas.toDataURL('image/png');
        link.click();
        
        showMessage('Download Complete! Share your premium ad!');
        
        // Restore active layer border
        if (activeLayer) activeLayer.classList.add('active-draggable');
        // Clean up temporary confetti layer
        confettiContainer.innerHTML = '';
    }).catch(err=>{
        console.error("Download failed:", err);
        showMessage('Download failed. Please try again. If the issue persists, ensure all images are loaded.');
        // Restore active layer border
        if (activeLayer) activeLayer.classList.add('active-draggable');
    });
}

// --- NEW 3D ANIMATION LOGIC (Confetti Overlay) ---
function createConfettiOverlay(width, height) {
    return new Promise(resolve => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Simple star/confetti drawing logic for image capture
        const numStars = 100; // More confetti!
        for (let i = 0; i < numStars; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 5 + 2; // Larger sparkles
            const color = ['#FFD700', '#FF4500', '#FFFFFF', '#ADFF2F', '#FF69B4'][Math.floor(Math.random() * 5)]; // More colors

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

// --- ENHANCED DRAG & RESIZE LOGIC FOR MULTIPLE LAYERS ---
function initializeDragAndResize() {
    const card = document.getElementById('statusArea');

    card.addEventListener('mousedown', startInteraction);
    card.addEventListener('touchstart', (e) => startInteraction(e.touches[0]));

    card.addEventListener('mousemove', interact);
    card.addEventListener('touchmove', (e) => interact(e.touches[0]));

    card.addEventListener('mouseup', stopInteraction);
    card.addEventListener('touchend', stopInteraction);
    card.addEventListener('mouseleave', stopInteraction); // For when mouse leaves the preview area

    function getDraggableElement(target) {
        // Check if the target itself is a draggable layer
        if (target.classList.contains('draggable-layer') || target.id === 'overlayLogo') {
            return target;
        }
        // Check if the target is inside a draggable layer (e.g., editable text)
        return target.closest('.draggable-layer');
    }

    function startInteraction(e) {
        // Prevent default touch behavior for scrolling if dragging starts
        if (e.type === 'touchstart') e.preventDefault();

        const target = e.target;
        const layer = getDraggableElement(target);
        
        if (!layer || layer.classList.contains('hidden') || layer.id !== activeLayerId) {
            // Only allow interaction with the currently active and visible layer
            return; 
        }

        activeDraggable = layer;
        
        // Determine if it's a resize or drag
        const rect = activeDraggable.getBoundingClientRect();
        const resizeHandleSize = 20; // pixels from corner
        
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

        activeDraggable.style.transition = 'none'; // Disable transitions during drag/resize
        activeDraggable.classList.add('dragging');
    }

    function interact(e) {
        if (!activeDraggable || (!isDragging && !isResizing)) return;
        if (e.type === 'touchmove') e.preventDefault(); // Prevent scrolling

        const cardRect = card.getBoundingClientRect();
        const deltaX = e.clientX - initialX;
        const deltaY = e.clientY - initialY;

        if (isDragging) {
            // Calculate new position
            let newLeft = initialLeft + deltaX;
            let newTop = initialTop + deltaY;

            // Clamp to bounds of the card
            newLeft = Math.max(0, Math.min(newLeft, cardRect.width - activeDraggable.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, cardRect.height - activeDraggable.offsetHeight));

            activeDraggable.style.left = (newLeft / cardRect.width) * 100 + '%';
            activeDraggable.style.top = (newTop / cardRect.height) * 100 + '%';
            activeDraggable.style.transform = 'none'; // Clear transform set by preset positions
        } else if (isResizing) {
            // Calculate new width and height
            let newWidth = initialWidth + deltaX;
            let newHeight = initialHeight + deltaY;

            // Maintain aspect ratio for image/decorative elements
            if (activeDraggable.id === 'overlayLogo' || activeDraggable.id === 'decorativeElementLayer') {
                const aspectRatio = initialWidth / initialHeight;
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    newHeight = newWidth / aspectRatio;
                } else {
                    newWidth = newHeight * aspectRatio;
                }
            }

            // Clamp to reasonable min/max sizes
            newWidth = Math.max(50, Math.min(newWidth, cardRect.width * 0.9)); // Min 50px, Max 90% of card
            newHeight = Math.max(50, Math.min(newHeight, cardRect.height * 0.9));

            activeDraggable.style.width = (newWidth / cardRect.width) * 100 + '%';
            activeDraggable.style.height = (newHeight / cardRect.height) * 100 + '%';
        }
    }

    function stopInteraction() {
        if (activeDraggable) {
            activeDraggable.style.transition = 'all 0.3s ease'; // Re-enable transitions
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

// --- LAYER MANAGEMENT ---
let currentActiveElement = null; // Reference to the actual DOM element for active layer

function setActiveLayer(layerId) {
    // Deactivate previous layer
    if (currentActiveElement) {
        currentActiveElement.classList.remove('active-draggable');
    }

    // Activate new layer
    activeLayerId = layerId;
    currentActiveElement = document.getElementById(layerId);
    if (currentActiveElement) {
        currentActiveElement.classList.add('active-draggable');
        updateLayerControlsVisibility();
        updateLayerControlsValues(); // Update Z-index, opacity, etc.
    }

    // Update buttons in Layer Selection
    document.querySelectorAll('#layerSelectionControls .option-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.targetLayer === layerId) {
            btn.classList.add('active');
        }
    });

    // Handle resizable class: Logo, Offer Banner, Decorative Layer are resizable
    const isResizable = (layerId === 'overlayLogo' || layerId === 'offerBannerLayer' || layerId === 'decorativeElementLayer');
    if (currentActiveElement) {
        if (isResizable) {
            currentActiveElement.classList.add('resizable');
        } else {
            currentActiveElement.classList.remove('resizable');
        }
    }
}

function updateLayerControlsVisibility() {
    // Hide all specific controls
    document.getElementById('textControls').classList.add('hidden');
    document.getElementById('imageControls').classList.add('hidden');
    document.getElementById('offerBannerControls').classList.add('hidden');
    document.getElementById('ctaBlockControls').classList.add('hidden');
    document.getElementById('decorativeControls').classList.add('hidden');

    // Show controls relevant to the active layer
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
    if (currentActiveElement) {
        // Z-Index
        const zIndexSlider = document.getElementById('layerZIndex');
        const currentZ = parseInt(getComputedStyle(currentActiveElement).zIndex) || 20;
        zIndexSlider.value = currentZ;
        document.getElementById('currentZIndex').textContent = currentZ;

        // Opacity
        const opacitySlider = document.getElementById('layerOpacity');
        const currentO = parseFloat(getComputedStyle(currentActiveElement).opacity) || 1;
        opacitySlider.value = Math.round(currentO * 100);
        document.getElementById('currentOpacity').textContent = Math.round(currentO * 100);

        // For Text Layers, update font size slider
        if (currentActiveElement.classList.contains('text-layer') || currentActiveElement.classList.contains('offer-layer') || currentActiveElement.classList.contains('cta-layer')) {
            const firstEditable = currentActiveElement.querySelector('.editable');
            if (firstEditable) {
                const currentPxSize = parseInt(getComputedStyle(firstEditable).fontSize);
                document.getElementById('fontSizeSlider').value = currentPxSize;
                document.getElementById('currentFontSize').textContent = currentPxSize;

                // Update text color input
                document.getElementById('textColorInput').value = rgbToHex(getComputedStyle(firstEditable).color);
                
                // Update text stroke controls
                const strokeWidth = parseFloat(getComputedStyle(firstEditable).getPropertyValue('-webkit-text-stroke-width')) || 0;
                document.getElementById('textStrokeWidth').value = strokeWidth;
                document.getElementById('textStrokeColor').value = rgbToHex(getComputedStyle(firstEditable).getPropertyValue('-webkit-text-stroke-color'));
            }
        }
        // For image layer
        if (activeLayerId === 'overlayLogo') {
            const logoBorderToggleBtns = document.querySelectorAll('#imageControls button[data-border]');
            const hasBorder = getComputedStyle(currentActiveElement).borderWidth !== '0px';
            logoBorderToggleBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.border === String(hasBorder)) {
                    btn.classList.add('active');
                }
            });
        }
    }
}

function toggleLayerVisibility(isVisible) {
    if (currentActiveElement) {
        currentActiveElement.classList.toggle('hidden', !isVisible);
        // Update active class on visibility buttons
        const visibilityBtns = document.querySelectorAll('#generalLayerControls button');
        visibilityBtns[0].classList.toggle('active', isVisible);
        visibilityBtns[1].classList.toggle('active', !isVisible);
    }
}

function updateActiveLayerZIndex(value) {
    if (currentActiveElement) {
        currentActiveElement.style.zIndex = value;
        document.getElementById('currentZIndex').textContent = value;
    }
}

function updateActiveLayerOpacity(value) {
    if (currentActiveElement) {
        currentActiveElement.style.opacity = parseFloat(value) / 100;
        document.getElementById('currentOpacity').textContent = value;
    }
}

function resetActiveLayerPosition() {
    if (currentActiveElement) {
        currentActiveElement.style.left = '';
        currentActiveElement.style.top = '';
        currentActiveElement.style.width = '';
        currentActiveElement.style.height = '';
        currentActiveElement.style.transform = ''; // Clear freehand transforms
        currentActiveElement.style.zIndex = ''; // Reset to default CSS
        currentActiveElement.style.opacity = ''; // Reset to default CSS
        currentActiveElement.classList.remove('active-draggable'); // Temporarily remove to remove inline styles
        currentActiveElement.classList.add('active-draggable'); // Re-add to get calculated values

        // Reapply preset position for text layers if they had one
        if (currentActiveElement.classList.contains('text-layer')) {
            currentActiveElement.classList.remove(...Array.from(currentActiveElement.classList).filter(c => c.startsWith('pos-')));
            currentActiveElement.classList.add('pos-top-center'); // Default
        }

        updateLayerControlsValues(); // Update UI
        showMessage('Layer position, size, and style reset!');
    }
}


// --- CUSTOMIZATION FUNCTIONS ---

function applyInitialStylesToPreview() {
    try {
        applyFontToTextElements(currentFontClass);
        applyShapeClasses(currentShapeClass);
        applyShadowClass(currentShadow); 
        applyFrameClass(currentFrameClass); 
        updateFontSize(currentFontSize);
        updateTextStroke();

        const logo = document.getElementById('overlayLogo');
        if (ownerDetails.logoSrc && ownerDetails.logoSrc !== DEFAULT_LOGO) {
             logo.style.display = 'block';
        } else {
             logo.style.display = 'none';
        }
        toggleLogoBorder(true); // Default to showing border

        // Apply theme colors
        updateColor('text', currentTextColor);
        updateColor('accent', currentAccentColor);
        document.getElementById('textColorInput').value = currentTextColor;
        document.getElementById('accentColorInput').value = currentAccentColor;

        // Apply offer banner style
        setOfferBannerStyle(currentOfferBannerStyle, false); // false to not activate button
        setCTAStyle(currentCtaStyle, false);

        // Ensure contenteditable fields have placeholder logic applied
        document.querySelectorAll('.editable').forEach(el => {
            if (el.textContent.trim() === '') {
                el.classList.add('empty');
            } else {
                el.classList.remove('empty');
            }
        });
        
    } catch (e) {
        console.warn("Could not apply initial styles:", e);
    }
}

function initializeControls() {
    if (document.getElementById('fontControls').children.length > 0) return; // Prevent re-initialization

    // 1. Frame Buttons
    const frameControls = document.getElementById('frameControls');
    FRAME_OPTIONS.forEach(option => {
        const button = createOptionButton(option.name, () => updateFrame(option.class, button));
        if (option.class === currentFrameClass) button.classList.add('active');
        frameControls.appendChild(button);
    });

    // 2. Color Theme Presets (NEW)
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

    // 6. Offer Banner Style Controls
    const offerBannerStyleControls = document.getElementById('offerBannerStyleControls');
    offerBannerStyleControls.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.style === currentOfferBannerStyle) btn.classList.add('active');
    });

    // 7. CTA Block Style Controls
    const ctaBlockStyleControls = document.getElementById('ctaBlockStyleControls');
    ctaBlockStyleControls.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.style === currentCtaStyle) btn.classList.add('active');
    });

    // 8. Decorative Element Grid (NEW)
    const decorativeElementGrid = document.getElementById('decorativeElementGrid');
    DECORATIVE_ELEMENTS.forEach(element => {
        const button = document.createElement('button');
        button.className = 'option-button decor-option';
        button.innerHTML = `<img src="${element.src}" alt="${element.name}" style="width:30px;height:30px;object-fit:contain;"><br><small>${element.name}</small>`;
        button.onclick = () => addDecorativeElement(element);
        decorativeElementGrid.appendChild(button);
    });

    // 9. Garland Controls (NEW)
    const garlandControls = document.getElementById('garlandControls');
    GARLAND_OPTIONS.forEach(garland => {
        const button = document.createElement('button');
        button.className = 'option-button decor-option';
        button.innerHTML = `<img src="${garland.src}" alt="${garland.name}" style="width:100%;height:30px;object-fit:contain;"><br><small>${garland.name}</small>`;
        button.onclick = () => addDecorativeGarland(garland);
        garlandControls.appendChild(button);
    });
    
    // 10. Text Alignment Controls (NEW)
    const textAlignControls = document.getElementById('textAlignControls');
    textAlignControls.querySelectorAll('.option-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.align === 'center') btn.classList.add('active'); // Default to center
    });
}

// Helper to create option buttons
function createOptionButton(text, onClickHandler) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'option-button';
    button.onclick = onClickHandler;
    return button;
}

// Apply an entire theme
function applyTheme(theme, clickedButton) {
    currentTextColor = theme.text;
    currentAccentColor = theme.accent;
    updateColor('text', theme.text);
    updateColor('accent', theme.accent);
    document.getElementById('textColorInput').value = theme.text;
    document.getElementById('accentColorInput').value = theme.accent;

    document.querySelectorAll('#colorThemePresets .option-button').forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
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
    if (show) {
        logoEl.style.borderWidth = '4px'; // Or restore from preset
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

    // Show/hide corner decor based on class
    decorElements.forEach(el => {
        el.style.display = (newFrameClass === 'frame-default' || newFrameClass === 'frame-temple' || newFrameClass === 'frame-swirl') ? 'block' : 'none';
    });
    currentFrameClass = newFrameClass;
}

function updateFrame(newFrameClass, clickedButton) {
    applyFrameClass(newFrameClass);
    const buttons = clickedButton.parentElement.querySelectorAll('.option-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
}

function updateColor(type, color) {
    if (type === 'text') {
        currentTextColor = color;
        // Apply to all editable text elements directly
        document.querySelectorAll('.editable').forEach(el => el.style.color = color);
    } else if (type === 'accent') {
        currentAccentColor = color;
        document.documentElement.style.setProperty('--accent', color);
        // Also update the corner decor background if visible
        document.querySelectorAll('.frame-decor').forEach(el => {
             el.style.borderColor = color;
             // Only update gradient if it's the default type
             if (el.style.backgroundImage.includes('linear-gradient')) { // Check if it's already a gradient
                el.style.background = `linear-gradient(45deg, ${lightenColor(color, 60)}, ${color})`;
             }
        });
    }
}

function lightenColor(hex, percent) {
    var f=parseInt(hex.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=(f>>8)&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

// Convert RGB to Hex (for color picker sync)
function rgbToHex(rgb) {
    if (!rgb || rgb.indexOf('rgb') === -1) return '#FFFFFF'; // Default for non-rgb or invalid
    const parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!parts) return '#FFFFFF';
    delete parts[0];
    for (let i = 1; i <= 3; ++i) {
        parts[i] = parseInt(parts[i]).toString(16);
        if (parts[i].length === 1) parts[i] = '0' + parts[i];
    }
    return '#' + parts.join('');
}


// --- OFFER BANNER & CTA BLOCKS (NEW) ---
function setOfferBannerStyle(styleClass, activateButton = true) {
    const offerBannerLayer = document.getElementById('offerBannerLayer');
    const bannerElement = offerBannerLayer.querySelector('.offer-banner');
    if (!bannerElement) return;

    // Remove existing styles
    bannerElement.classList.remove('banner-ribbon', 'banner-badge', 'banner-simple');
    
    // Add new style
    bannerElement.classList.add(styleClass);
    currentOfferBannerStyle = styleClass;

    // Apply colors if they exist
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

    const bgColor = document.getElementById('offerBannerBgColor').value;
    const textColor = document.getElementById('offerBannerTextColor').value;

    bannerElement.style.backgroundColor = bgColor;
    bannerElement.style.color = textColor;

    // Specific adjustments for ribbon style, if needed (e.g., pseudo-elements)
    if (currentOfferBannerStyle === 'banner-ribbon') {
        bannerElement.style.setProperty('--ribbon-color', bgColor);
        bannerElement.style.setProperty('--ribbon-text-color', textColor);
    }
}

function setCTAStyle(styleClass, activateButton = true) {
    const ctaBlockLayer = document.getElementById('ctaBlockLayer');
    const ctaItems = ctaBlockLayer.querySelectorAll('.cta-item');
    if (ctaItems.length === 0) return;

    // Remove all previous style classes from each CTA item
    ctaItems.forEach(item => {
        item.classList.remove('cta-gold', 'cta-green', 'cta-blue');
        item.classList.add(styleClass); // Apply new style
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
    const newItem = document.createElement('div');
    newItem.className = `cta-item editable ${currentFontClass} ${currentCtaStyle}`;
    newItem.contentEditable = true;
    newItem.dataset.placeholder = "New Offer Here!";
    newItem.style.color = currentTextColor;
    newItem.style.webkitTextStrokeWidth = currentTextStrokeWidth;
    newItem.style.webkitTextStrokeColor = currentTextStrokeColor;
    // Add active shadow for text layers
    SHADOW_OPTIONS.forEach(o => newItem.classList.remove(o.class));
    newItem.classList.add(currentShadow);

    ctaBlockGrid.appendChild(newItem);
    newItem.classList.add('empty'); // Apply placeholder initially
    ctaBlockGrid.style.gridTemplateColumns = `repeat(${Math.min(ctaBlockGrid.children.length, 2)}, 1fr)`; // Max 2 columns
    showMessage('New CTA item added! Edit its text directly.');
}


// --- DECORATIVE ELEMENTS (NEW) ---
function addDecorativeElement(elementData) {
    const decorativeLayer = document.getElementById('decorativeElementLayer');
    decorativeLayer.classList.remove('hidden'); // Ensure layer is visible
    setActiveLayer('decorativeElementLayer'); // Make it the active layer

    const newDecor = document.createElement('img');
    newDecor.src = elementData.src;
    newDecor.className = `draggable-child ${elementData.class}`; // Add a generic class for styling + specific for identification
    newDecor.style.position = 'absolute';
    newDecor.style.width = elementData.defaultWidth || '20%';
    newDecor.style.height = 'auto'; // Maintain aspect ratio
    newDecor.style.left = elementData.defaultLeft || '50%';
    newDecor.style.top = elementData.defaultTop || '50%';
    newDecor.style.transform = 'translate(-50%, -50%)'; // Center it initially

    // Randomize initial position slightly for multiple additions
    const randX = Math.random() * 20 - 10; // -10 to +10 percent
    const randY = Math.random() * 20 - 10;
    newDecor.style.left = `calc(${elementData.defaultLeft || '50%'} + ${randX}%)`;
    newDecor.style.top = `calc(${elementData.defaultTop || '50%'} + ${randY}%)`;

    decorativeLayer.appendChild(newDecor);
    showMessage(`Added ${elementData.name}. Drag and resize it on the ad!`);
}

function addDecorativeGarland(garlandData) {
    const decorativeLayer = document.getElementById('decorativeElementLayer');
    decorativeLayer.classList.remove('hidden'); // Ensure layer is visible
    setActiveLayer('decorativeElementLayer'); // Make it the active layer

    const newGarland = document.createElement('img');
    newGarland.src = garlandData.src;
    newGarland.className = `draggable-child decorative-garland ${garlandData.class}`;
    newGarland.style.position = 'absolute';
    newGarland.style.width = '100%'; // Garlands typically span width
    newGarland.style.height = 'auto';
    newGarland.style.left = '0%';
    newGarland.style.top = '0%'; // Default top, will be adjusted by CSS class
    newGarland.style.transform = 'none';

    // Specific positioning for garlands/borders via CSS classes
    if (garlandData.class.includes('top')) {
        newGarland.style.top = '0%';
        newGarland.style.left = '0%';
        newGarland.style.width = '100%';
    } else if (garlandData.class.includes('side')) {
        newGarland.style.top = '0%';
        newGarland.style.left = '0%'; // Assuming it can be left or right
        newGarland.style.height = '100%';
        newGarland.style.width = 'auto';
    } else if (garlandData.class.includes('bottom')) {
        newGarland.style.bottom = '0%';
        newGarland.style.left = '0%';
        newGarland.style.top = 'auto';
        newGarland.style.width = '100%';
    } else if (garlandData.class.includes('corner')) {
        newGarland.style.width = '30%';
        newGarland.style.height = 'auto';
        newGarland.style.left = 'auto';
        newGarland.style.top = 'auto';
        newGarland.style.right = '0%';
        newGarland.style.bottom = '0%';
    } else if (garlandData.class.includes('banner')) { // General banner
        newGarland.style.width = '80%';
        newGarland.style.height = 'auto';
        newGarland.style.left = '50%';
        newGarland.style.top = '50%';
        newGarland.style.transform = 'translate(-50%, -50%)';
    }
    
    decorativeLayer.appendChild(newGarland);
    showMessage(`Added ${garlandData.name}. Drag and resize it on the ad!`);
}


function clearDecorativeElements() {
    const decorativeLayer = document.getElementById('decorativeElementLayer');
    decorativeLayer.innerHTML = ''; // Clears all children
    decorativeLayer.classList.add('hidden'); // Hide the layer if empty
    showMessage('All decorative elements cleared.');
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

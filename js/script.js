/* main app script for Festive Ad Generator - World Class Premium Version */
let currentStep = 1;
let ownerDetails = {};
let selectedTemplate = '';

// Global variables for current state
let currentFontClass = 'font-cinzel';
let currentShapeClass = 'shape-circle';
let currentPositionClass = 'pos-bottom-center';
let currentFontSize = 28;
let currentShadow = 'shadow-high';
let currentFrameClass = 'frame-default';
let currentMode = 'preset'; // 'preset' or 'freehand'

// For Free Hand Dragging
let isDragging = false;
let dragElement = null;
let offsetX, offsetY;
let currentTop = 18;
let currentLeft = 50; // default for pos-bottom-center

const DEFAULT_SHOP_NAME = "Happy Diwali & Dussehra!";
const DEFAULT_OWNER_NAME = "From: Your Shop Name";
const DEFAULT_PHONE = "999-999-9999";
const DEFAULT_LOGO = "assets/Logo.jpg"; 

// --- EXPANDED OPTIONS ---

const FRAME_OPTIONS = [ // NEW FRAME OPTIONS
    { name: 'Classic Gold', class: 'frame-default' },
    { name: 'Maroon Temple', class: 'frame-temple' },
    { name: 'Subtle Border', class: 'frame-subtle' },
    { name: 'Corner Swirls', class: 'frame-swirl' },
    { name: 'No Frame', class: 'frame-none' },
];

const FONT_OPTIONS = [ // EXPANDED FONT LIST (30+)
    { name: 'Divine Cinzel', class: 'font-cinzel' },
    { name: 'Flowing Vibes', class: 'font-great-vibes' },
    { name: 'Bold Poppins', class: 'font-poppins' },
    { name: 'Hand Dance', class: 'font-dancing-script' },
    { name: 'Calligraphy', class: 'font-tangerine' },
    { name: 'Sacramento', class: 'font-sacramento' },
    { name: 'Old Style TT', class: 'font-old-standard-tt' },
    { name: 'Marcellus', class: 'font-marcellus' },
    { name: 'Fauna One', class: 'font-fauna-one' },
    { name: 'Display Bungee', class: 'font-bungee' },
    { name: 'Heavy Montserrat', class: 'font-montserrat-black' },
    { name: 'Slab Serif', class: 'font-roboto-slab' },
    { name: 'Clean Inter', class: 'font-inter' },
    { name: 'Block Bebas', class: 'font-bebas-neue' },
    { name: 'Slabo', class: 'font-slabo' },
    { name: 'Playfair Display', class: 'font-playfair-display' },
    { name: 'Cormorant', class: 'font-cormorant' },
    { name: 'Kaushan Script', class: 'font-kaushan-script' },
    { name: 'Rajdhani', class: 'font-rajdhani' },
    { name: 'Vollkorn', class: 'font-vollkorn' },
    { name: 'Josefin Slab', class: 'font-josefin-slab' },
    { name: 'Merriweather', class: 'font-merriweather' },
    { name: 'Pacifico', class: 'font-pacifico' },
    { name: 'Berkshire Swash', class: 'font-berkshire-swash' },
    { name: 'Parisienne', class: 'font-parisienne' },
];

const SHAPE_OPTIONS = [
    { name: 'Circle', class: 'shape-circle' },
    { name: 'Square', class: 'shape-square' },
    { name: 'Rounded Box', class: 'shape-rounded-box' },
    { name: 'Diamond Cut', class: 'shape-diamond' }, 
];

const POSITION_OPTIONS = [
    { name: 'Top Left', class: 'pos-top-left' },
    { name: 'Top Center', class: 'pos-top-center' },
    { name: 'Top Right', class: 'pos-top-right' },
    { name: 'Bottom Left', class: 'pos-bottom-left' },
    { name: 'Center', class: 'pos-center-middle' },
    { name: 'Bottom Right', class: 'pos-bottom-right' },
];

const COLOR_PRESETS = [
    { name: 'Divine Gold', text: '#FFFFFF', accent: '#D4AF37' },
    { name: 'Festival Red', text: '#FFFFFF', accent: '#E0115F' },
    { name: 'Royal Blue', text: '#ADD8E6', accent: '#007FFF' },
    { name: 'Emerald', text: '#FFFFFF', accent: '#00A86B' },
    { name: 'Classic Black', text: '#000000', accent: '#E0E0E0' },
    { name: 'Deep Saffron', text: '#FFFFFF', accent: '#FF9933' }, // NEW
];

const SHADOW_OPTIONS = [ 
    { name: 'Heavy Glow', class: 'shadow-high' },
    { name: 'Subtle Lift', class: 'shadow-low' },
    { name: 'No Shadow', class: 'shadow-none' },
];

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
        setMode(currentMode); // Ensure the correct mode is active on step 4 entry
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
    showMessage('Preparing high-resolution image... Please wait a moment.');
    const area = document.getElementById('statusArea');
    const confettiContainer = document.getElementById('confetti-container');
    
    // Temporarily hide editor controls like contenteditable focus
    document.querySelectorAll('[contenteditable="true"]').forEach(el => el.blur());

    // 1. ADD PREMIUM ANIMATION LAYER (Confetti/Sparkle)
    const confettiCanvas = await createConfettiOverlay(area.offsetWidth, area.offsetHeight);
    
    // 2. CAPTURE THE AD AREA
    html2canvas(area, { 
        scale: 3, // World-Class HD-like quality
        useCORS: true, 
        allowTaint: true 
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
        link.download = 'DivineFestiveAd-Premium.png';
        link.href = finalCanvas.toDataURL('image/png');
        link.click();
        
        showMessage('Download Complete! Share your premium ad!');
        // Clean up temporary confetti layer
        confettiContainer.innerHTML = '';
    }).catch(err=>{
        console.error("Download failed:", err);
        showMessage('Download failed. Please check console for details.');
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
        const numStars = 50;
        for (let i = 0; i < numStars; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = Math.random() * 4 + 2;
            const color = ['#FFD700', '#FF4500', '#FFFFFF', '#ADFF2F'][Math.floor(Math.random() * 4)];

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = size;
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

/* Floating diyas */
function createFloatingDiyas(count = 12){ 
    const container = document.getElementById('diya-container');
    if(!container) return;
    const diyaSrc = 'assets/diya.png'; 
    
    for(let i=0;i<count;i++){
        const img = document.createElement('img');
        img.src = diyaSrc; 
        img.className = 'diya';
        
        const left = Math.random() * 100;
        img.style.left = left + 'vw';
        
        img.style.top = (100 + Math.random() * 20) + 'vh';
        
        const size = 30 + Math.random()*40; 
        img.style.width = size + 'px';
        img.style.height = 'auto';
        
        const duration = 8 + Math.random()*10; 
        img.style.animation = `floatUp ${duration}s linear infinite`;
        
        img.style.animationDelay = (Math.random()*8) + 's';
        container.appendChild(img);
    }
}

/* run diyas on load */
window.addEventListener('load', ()=>{
    createFloatingDiyas(12);
    initializeDragAndDrop();
});

// --- FREE HAND DRAG-AND-DROP LOGIC ---
function initializeDragAndDrop() {
    const container = document.getElementById('overlayTextContainer');
    const card = document.getElementById('statusArea');

    container.addEventListener('mousedown', startDrag);
    card.addEventListener('mousemove', drag);
    card.addEventListener('mouseup', stopDrag);

    // Touch events for mobile
    container.addEventListener('touchstart', (e) => startDrag(e.touches[0]));
    card.addEventListener('touchmove', (e) => drag(e.touches[0]));
    card.addEventListener('touchend', stopDrag);

    function startDrag(e) {
        if (currentMode !== 'freehand') return;
        dragElement = container;
        isDragging = true;
        
        // Calculate the difference between cursor position and element's left/top
        const rect = dragElement.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        
        // Calculate offset relative to the card, scaled by the card's current zoom/scroll
        offsetX = e.clientX - rect.left + cardRect.left;
        offsetY = e.clientY - rect.top + cardRect.top;

        dragElement.style.transition = 'none';
        dragElement.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;
        if (currentMode !== 'freehand') return stopDrag(); // Safety check

        const cardRect = card.getBoundingClientRect();
        
        // Calculate the new position relative to the card's top-left
        let newX = e.clientX - cardRect.left - offsetX;
        let newY = e.clientY - cardRect.top - offsetY;

        // Convert pixel position to percentage for responsiveness
        currentLeft = (newX / cardRect.width) * 100;
        currentTop = (newY / cardRect.height) * 100;
        
        // Apply boundary limits (e.g., keep 5% margin)
        currentLeft = Math.max(5, Math.min(95, currentLeft));
        currentTop = Math.max(5, Math.min(95, currentTop));

        dragElement.style.left = currentLeft + '%';
        dragElement.style.top = currentTop + '%';
        dragElement.style.transform = 'translate(-50%, -50%)'; // Center the element
    }

    function stopDrag() {
        isDragging = false;
        if (dragElement) {
            dragElement.style.transition = 'all 0.3s ease';
            dragElement.style.cursor = 'grab';
            dragElement = null;
        }
    }
}

function setMode(mode) {
    currentMode = mode;
    const container = document.getElementById('overlayTextContainer');
    const presetGroup = document.getElementById('presetPositionGroup');
    const freehandGroup = document.getElementById('freehandPositionGroup');
    const modeButtons = document.getElementById('positionModeControls').querySelectorAll('.option-button');

    modeButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`#positionModeControls button:nth-child(${mode === 'preset' ? 1 : 2})`).classList.add('active');

    if (mode === 'preset') {
        presetGroup.classList.remove('hidden');
        freehandGroup.classList.add('hidden');
        container.style.removeProperty('left');
        container.style.removeProperty('top');
        container.style.removeProperty('transform');
        // Re-apply the last preset class
        applyPositionClass(currentPositionClass);
    } else {
        presetGroup.classList.add('hidden');
        freehandGroup.classList.remove('hidden');
        // Apply current freehand position
        container.className = 'overlay-text-container freehand-mode';
        container.style.left = currentLeft + '%';
        container.style.top = currentTop + '%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.cursor = 'grab';
    }
}

function resetFreeHandPosition() {
    currentTop = 85;
    currentLeft = 50;
    const container = document.getElementById('overlayTextContainer');
    container.style.left = currentLeft + '%';
    container.style.top = currentTop + '%';
}

// --- CUSTOMIZATION FUNCTIONS ---

function applyInitialStylesToPreview() {
    try {
        applyFontClasses(currentFontClass);
        applyShapeClasses(currentShapeClass);
        applyShadowClass(currentShadow); 
        applyFrameClass(currentFrameClass); // NEW FRAME

        updateSize(currentFontSize);
        
        const logo = document.getElementById('overlayLogo');
        if (ownerDetails.logoSrc && ownerDetails.logoSrc !== DEFAULT_LOGO) {
             logo.style.display = 'block';
        } else {
             logo.style.display = 'none';
        }

        const textColor = document.getElementById('textColorInput').value;
        const accentColor = document.getElementById('accentColorInput').value;
        updateColor('text', textColor);
        updateColor('accent', accentColor);
        
        document.getElementById('currentFontSize').textContent = currentFontSize;
        document.getElementById('fontSizeSlider').value = currentFontSize;
        
    } catch (e) {
        console.warn("Could not apply initial styles:", e);
    }
}

function initializeControls() {
    if (document.getElementById('fontControls').children.length > 0) return;
    
    // 1. Initialize Frame Buttons (NEW)
    const frameControls = document.getElementById('frameControls');
    FRAME_OPTIONS.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.name;
        button.className = 'option-button';
        if (option.class === currentFrameClass) {
            button.classList.add('active');
        }
        button.onclick = () => updateFrame(option.class, button);
        frameControls.appendChild(button);
    });

    // 2. Initialize Color Preset Buttons
    const colorPresets = document.getElementById('colorPresets');
    COLOR_PRESETS.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.name.split(' ')[0];
        button.className = 'option-button';
        button.style.backgroundColor = option.accent; 
        button.style.color = (option.text === '#FFFFFF' || option.text === '#ADD8E6') ? '#2B2B2B' : option.text;
        button.onclick = () => applyPreset(option);
        colorPresets.appendChild(button);
    });

    // 3. Initialize Font Buttons
    const fontControls = document.getElementById('fontControls');
    FONT_OPTIONS.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.name.split(' ')[0];
        button.className = 'option-button ' + option.class;
        if (option.class === currentFontClass) {
            button.classList.add('active');
        }
        button.onclick = () => updateFont(option.class, button);
        fontControls.appendChild(button);
    });

    // 4. Initialize Position Buttons (PRESET)
    const positionControls = document.getElementById('positionControls');
    POSITION_OPTIONS.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.name;
        button.className = 'option-button';
        if (option.class === currentPositionClass) {
            button.classList.add('active');
        }
        button.onclick = () => updatePosition(option.class, button);
        positionControls.appendChild(button);
    });

    // 5. Initialize Shadow Buttons
    const shadowGrid = document.getElementById('shadowControlsGrid');
    SHADOW_OPTIONS.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.name;
        button.className = 'option-button';
        if (option.class === currentShadow) {
            button.classList.add('active');
        }
        button.onclick = () => updateShadow(option.class, button);
        shadowGrid.appendChild(button);
    });

    // 6. Initialize Shape Buttons
    const shapeControls = document.getElementById('shapeControls');
    SHAPE_OPTIONS.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.name;
        button.className = 'option-button';
        if (option.class === currentShapeClass) {
            button.classList.add('active');
        }
        button.onclick = () => updateShape(option.class, button);
        shapeControls.appendChild(button);
    });
}

function applyPreset(preset) {
    document.getElementById('textColorInput').value = preset.text;
    document.getElementById('accentColorInput').value = preset.accent;
    updateColor('text', preset.text);
    updateColor('accent', preset.accent);
}

function applyFontClasses(newFontClass) {
    const textElements = [
        document.getElementById('overlayText'), 
        document.getElementById('overlayOwner'), 
        document.getElementById('overlayPhone')
    ];
    textElements.forEach(el => {
        FONT_OPTIONS.forEach(f => el.classList.remove(f.class));
        el.classList.add(newFontClass);
    });
    currentFontClass = newFontClass;
}

function updateFont(newFontClass, clickedButton) {
    applyFontClasses(newFontClass);
    const buttons = clickedButton.parentElement.querySelectorAll('.option-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
}

function updateSize(size) {
    currentFontSize = size;
    document.getElementById('overlayText').style.fontSize = size + 'px';
    document.getElementById('currentFontSize').textContent = size;
}

function applyPositionClass(newPositionClass) {
    const container = document.getElementById('overlayTextContainer');
    POSITION_OPTIONS.forEach(p => container.classList.remove(p.class));
    container.classList.remove('freehand-mode');
    container.classList.add(newPositionClass);
    currentPositionClass = newPositionClass;
}

function updatePosition(newPositionClass, clickedButton) {
    setMode('preset');
    applyPositionClass(newPositionClass);

    const buttons = clickedButton.parentElement.querySelectorAll('.option-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
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

function applyShadowClass(newShadowClass) {
    const textElements = [
        document.getElementById('overlayText'), 
        document.getElementById('overlayOwner'), 
        document.getElementById('overlayPhone')
    ];
    const shadowClasses = SHADOW_OPTIONS.map(o => o.class);
    
    textElements.forEach(el => {
        shadowClasses.forEach(c => el.classList.remove(c));
        el.classList.add(newShadowClass);
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
        document.getElementById('overlayText').style.color = color;
        document.getElementById('overlayOwner').style.color = color;
        document.getElementById('overlayPhone').style.color = color;
    } else if (type === 'accent') {
        document.documentElement.style.setProperty('--accent', color);
    }
}

// Event listener to show placeholder for empty contenteditable fields
document.addEventListener('input', (e) => {
    if (e.target.hasAttribute('contenteditable')) {
        const el = e.target;
        if (el.textContent.trim() === '') {
            el.classList.add('empty');
        } else {
            el.classList.remove('empty');
        }
    }
});

window.addEventListener('load', () => {
    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
        if (el.textContent.trim() === '') {
            el.classList.add('empty');
        }
    });
});

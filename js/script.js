/* main app script for Festive Ad Generator */
let currentStep = 1;
let ownerDetails = {};
let selectedTemplate = '';

// Global variables for current state
let currentFontClass = 'font-cinzel';
let currentShapeClass = 'shape-circle';
let currentPositionClass = 'pos-bottom-center';
let currentFontSize = 28;

const DEFAULT_SHOP_NAME = "Happy Diwali & Dussehra!";
const DEFAULT_OWNER_NAME = "From: Your Shop Name";
const DEFAULT_PHONE = "999-999-9999";
const DEFAULT_LOGO = "assets/Logo.jpg"; // Path to your default Logo asset

const FONT_OPTIONS = [
    { name: 'Divine Cinzel', class: 'font-cinzel' },
    { name: 'Flowing Vibes', class: 'font-great-vibes' },
    { name: 'Bold Poppins', class: 'font-poppins' },
    { name: 'Display Bungee', class: 'font-bungee' },
    { name: 'Heavy Montserrat', class: 'font-montserrat-black' },
    { name: 'Slab Serif', class: 'font-roboto-slab' },
    { name: 'Clean Inter', class: 'font-inter' },
];

const SHAPE_OPTIONS = [
    { name: 'Circle', class: 'shape-circle' },
    { name: 'Sharp Square', class: 'shape-square' },
    { name: 'Rounded Box', class: 'shape-rounded-box' },
    { name: 'Star-ish Cut', class: 'shape-star' },
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
    { name: 'Ruby Red', text: '#FFFFFF', accent: '#E0115F' },
    { name: 'Deep Sapphire', text: '#ADD8E6', accent: '#007FFF' },
    { name: 'Emerald', text: '#FFFFFF', accent: '#00A86B' },
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

    // Initialize controls if moving to Step 4
    if (step === 4) {
        initializeControls();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Save details + read logo file (Now optional) */
function saveDetails(){
    const shop = document.getElementById('shopName').value.trim();
    const owner = document.getElementById('ownerName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const logoFile = document.getElementById('logo').files[0];

    // Assign saved values or default placeholders
    ownerDetails.shopName = shop || DEFAULT_SHOP_NAME;
    ownerDetails.ownerName = owner || DEFAULT_OWNER_NAME;
    ownerDetails.phone = phone || DEFAULT_PHONE;
    ownerDetails.logoSrc = DEFAULT_LOGO; 

    if(logoFile){
        const reader = new FileReader();
        reader.onload = function(e){
            ownerDetails.logoSrc = e.target.result;
            nextStep(3); // ASYNC PATH
        };
        reader.readAsDataURL(logoFile);
    } else {
        // Continue immediately if no file is uploaded (SYNC PATH)
        nextStep(3); 
    }
}

/* Select template and prepare preview */
function selectTemplate(imgSrc){
    try {
        selectedTemplate = imgSrc;
        
        const bg = document.getElementById('statusBg');
        const logo = document.getElementById('overlayLogo');
        const text = document.getElementById('overlayText');
        const ownerEl = document.getElementById('overlayOwner');
        const phoneEl = document.getElementById('overlayPhone');

        bg.src = imgSrc;
        
        // Set text contents from saved or default details for live editing
        text.textContent = ownerDetails.shopName;
        ownerEl.textContent = ownerDetails.ownerName;
        phoneEl.textContent = ownerDetails.phone;
        
        // Set logo source
        if(ownerDetails.logoSrc){
            logo.src = ownerDetails.logoSrc;
            logo.style.display = 'block';
        } else {
            logo.style.display = 'none';
        }

        // Apply current styles
        applyFontClasses(currentFontClass);
        applyShapeClasses(currentShapeClass);
        applyPositionClass(currentPositionClass);
        
        // Ensure color and size inputs match current visual state
        document.getElementById('overlayText').style.fontSize = currentFontSize + 'px';
        updateColor('text', document.getElementById('textColorInput').value);
        updateColor('accent', document.getElementById('accentColorInput').value);
        
        // little visual pop
        const card = document.querySelector('.status-card');
        card.classList.add('zoomIn');
        setTimeout(()=>card.classList.remove('zoomIn'),900);

        // This is the critical line to fix the navigation issue
        nextStep(4);
    } catch (e) {
        console.error("Error during template selection:", e);
        showMessage("An error occurred preparing the preview. Try refreshing.");
    }
}

/* Download status as PNG using html2canvas */
function downloadStatus(){
    const area = document.getElementById('statusArea');
    // use scale 2 for higher quality
    html2canvas(area, { scale: 2, useCORS: true, allowTaint: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'FestiveAd.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err=>{
        console.error("Download failed:", err);
        showMessage('Download failed. Please check console for details.');
    });
}

/* ensure background music unmute on first user interaction */
document.addEventListener('click', function onFirstClick(){
    const bg = document.getElementById('bgMusic');
    if(bg) bg.muted = false;
    document.removeEventListener('click', onFirstClick);
});

/* Floating diyas - ensure working (using local asset) */
function createFloatingDiyas(count = 8){
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
        
        const size = 34 + Math.random()*36;
        img.style.width = size + 'px';
        img.style.height = 'auto';
        
        const duration = 9 + Math.random()*8; 
        img.style.animation = `floatUp ${duration}s linear infinite`;
        
        img.style.animationDelay = (Math.random()*6) + 's';
        container.appendChild(img);
    }
}

/* run diyas on load */
window.addEventListener('load', ()=>{
    createFloatingDiyas(9);
});

// --- NEW CUSTOMIZATION FUNCTIONS ---

function initializeControls() {
    // 1. Initialize Color Preset Buttons
    const colorPresets = document.getElementById('colorPresets');
    if (colorPresets.children.length === 0) {
        COLOR_PRESETS.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.name;
            button.className = 'option-button';
            button.style.backgroundColor = option.accent;
            button.style.color = option.text === '#FFFFFF' ? '#2B2B2B' : option.text;
            button.onclick = () => applyPreset(option);
            colorPresets.appendChild(button);
        });
    }

    // 2. Initialize Font Buttons
    const fontControls = document.getElementById('fontControls');
    if (fontControls.children.length === 0) {
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
    }

    // 3. Initialize Position Buttons
    const positionControls = document.getElementById('positionControls');
    if (positionControls.children.length === 0) {
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
    }


    // 4. Initialize Shape Buttons
    const shapeControls = document.getElementById('shapeControls');
    if (shapeControls.children.length === 0) {
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
    
    // Set initial size display
    document.getElementById('currentFontSize').textContent = currentFontSize;
    document.getElementById('fontSizeSlider').value = currentFontSize;
    document.getElementById('overlayText').style.fontSize = currentFontSize + 'px';
}

function applyPreset(preset) {
    // Update color inputs
    document.getElementById('textColorInput').value = preset.text;
    document.getElementById('accentColorInput').value = preset.accent;
    
    // Apply colors immediately
    updateColor('text', preset.text);
    updateColor('accent', preset.accent);
}

// Function to remove old font classes and apply new ones
function applyFontClasses(newFontClass) {
    const textElements = [
        document.getElementById('overlayText'), 
        document.getElementById('overlayOwner'), 
        document.getElementById('overlayPhone')
    ];

    textElements.forEach(el => {
        // Remove all possible font classes first
        FONT_OPTIONS.forEach(f => el.classList.remove(f.class));
        el.classList.add(newFontClass);
    });
    currentFontClass = newFontClass;
}

// Font Update Logic
function updateFont(newFontClass, clickedButton) {
    applyFontClasses(newFontClass);

    // Update active state of buttons
    const buttons = clickedButton.parentElement.querySelectorAll('.option-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
}

// Size Update Logic (NEW)
function updateSize(size) {
    currentFontSize = size;
    document.getElementById('overlayText').style.fontSize = size + 'px';
    document.getElementById('currentFontSize').textContent = size;
}

// Position Update Logic (NEW)
function updatePosition(newPositionClass, clickedButton) {
    const container = document.getElementById('overlayTextContainer');
    
    // Remove old position classes
    POSITION_OPTIONS.forEach(p => container.classList.remove(p.class));
    
    // Apply new position class
    container.classList.add(newPositionClass);
    currentPositionClass = newPositionClass;

    // Update active state of buttons
    const buttons = clickedButton.parentElement.querySelectorAll('.option-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
}

// Function to remove old shape classes and apply new ones
function applyShapeClasses(newShapeClass) {
    const logoEl = document.getElementById('overlayLogo');
    
    // Remove all possible shape classes first
    SHAPE_OPTIONS.forEach(s => logoEl.classList.remove(s.class));
    
    logoEl.classList.add(newShapeClass);
    currentShapeClass = newShapeClass;
}

// Shape Update Logic
function updateShape(newShapeClass, clickedButton) {
    applyShapeClasses(newShapeClass);
    
    // Update active state of buttons
    const buttons = clickedButton.parentElement.querySelectorAll('.option-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
}

// Color Update Logic
function updateColor(type, color) {
    if (type === 'text') {
        // Apply color to all overlay text elements
        document.getElementById('overlayText').style.color = color;
        document.getElementById('overlayOwner').style.color = color;
        document.getElementById('overlayPhone').style.color = color;
    } else if (type === 'accent') {
        // Apply color to accent variables for frame/decoration
        document.documentElement.style.setProperty('--accent', color);
    }
}

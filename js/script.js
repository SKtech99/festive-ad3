/* main app script for Festive Ad Generator - Premium Version */
let currentStep = 1;
let ownerDetails = {};
let selectedTemplate = '';

// Global variables for current state
let currentFontClass = 'font-cinzel';
let currentShapeClass = 'shape-circle';
let currentPositionClass = 'pos-bottom-center';
let currentFontSize = 28;
let currentShadow = 'high'; // NEW: Default shadow for text

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
    { name: 'Diamond Cut', class: 'shape-diamond' }, // NEW SHAPE
];

const POSITION_OPTIONS = [
    { name: 'Top Left', class: 'pos-top-left' },
    { name: 'Top Center', class: 'pos-top-center' },
    { name: 'Top Right', class: 'pos-top-right' },
    { name: 'Bottom Left', class: 'pos-bottom-left' },
    { name: 'Center', class: 'pos-center-middle' },
    { name: 'Bottom Right', class: 'pos-bottom-right' },
];

// More diverse color presets added
const COLOR_PRESETS = [
    { name: 'Divine Gold', text: '#FFFFFF', accent: '#D4AF37' },
    { name: 'Festival Red', text: '#FFFFFF', accent: '#E0115F' },
    { name: 'Royal Blue', text: '#ADD8E6', accent: '#007FFF' },
    { name: 'Emerald', text: '#FFFFFF', accent: '#00A86B' },
    { name: 'Classic Black', text: '#000000', accent: '#E0E0E0' }, // New
    { name: 'Subtle Pink', text: '#3A3A3A', accent: '#FFC0CB' }, // New
    { name: 'Pure White', text: '#000000', accent: '#FFFFFF' }, // New
    { name: 'Orange Glow', text: '#000000', accent: '#FF9900' }, // New
];

const SHADOW_OPTIONS = [ // NEW SHADOW OPTIONS
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

    // Initialize controls and apply styles only when entering Step 4
    if (step === 4) {
        initializeControls(); // 1. Builds all the buttons/inputs
        applyInitialStylesToPreview(); // 2. Reads the input values and applies styles
        // BUG FIX: Ensure logo display is handled on step 4 entry
        const logo = document.getElementById('overlayLogo');
        if(ownerDetails.logoSrc) {
            logo.src = ownerDetails.logoSrc;
            logo.style.display = 'block';
        } else {
            logo.style.display = 'none';
        }
    }

    // Scroll to top for better UX
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
    ownerDetails.logoSrc = DEFAULT_LOGO; // Set default logo first

    if(logoFile){
        const reader = new FileReader();
        reader.onload = function(e){
            ownerDetails.logoSrc = e.target.result;
            nextStep(3); // ASYNC PATH
        };
        // BUG FIX: Added check for file type and error handling
        if (logoFile.type.match('image.*')) {
            reader.readAsDataURL(logoFile);
        } else {
            showMessage("Invalid file type. Please upload an image (JPG/PNG).");
            // Still continue, just without the logo
            nextStep(3);
        }
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
        const text = document.getElementById('overlayText');
        const ownerEl = document.getElementById('overlayOwner');
        const phoneEl = document.getElementById('overlayPhone');
        const logo = document.getElementById('overlayLogo');

        bg.src = imgSrc;
        
        // Set text contents from saved or default details for live editing
        // IMPORTANT: Use textContent for contenteditable to avoid XSS issues
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
        
        // little visual pop
        const card = document.querySelector('.status-card');
        card.classList.add('zoomIn');
        setTimeout(()=>card.classList.remove('zoomIn'),900);

        nextStep(4);
    } catch (e) {
        console.error("Error during template selection:", e);
        showMessage("An error occurred preparing the preview. Check the console for details.");
    }
}

/* Download status as PNG using html2canvas */
function downloadStatus(){
    const area = document.getElementById('statusArea');
    
    // Temporarily hide the contenteditable focus indicator if present
    document.querySelectorAll('[contenteditable="true"]').forEach(el => el.blur());

    // BUG FIX: Use a higher scale for World-Class HD-like quality
    // Scale 3 provides excellent resolution for modern screens/sharing
    html2canvas(area, { scale: 3, useCORS: true, allowTaint: true }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'DivineFestiveAd-Premium.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        showMessage('Download Complete! Share your premium ad!');
    }).catch(err=>{
        console.error("Download failed:", err);
        showMessage('Download failed. Ensure all image assets are available. Check console for details.');
    });
}

/* ensure background music unmute on first user interaction */
document.addEventListener('click', function onFirstClick(){
    const bg = document.getElementById('bgMusic');
    if(bg && bg.muted) {
        bg.muted = false;
        bg.play().catch(e => console.log('Autoplay blocked, music will play on next interaction.'));
    }
    document.removeEventListener('click', onFirstClick);
});

/* Floating diyas - ensure working (using local asset) */
function createFloatingDiyas(count = 12){ // Increased count for a richer effect
    const container = document.getElementById('diya-container');
    if(!container) return;
    const diyaSrc = 'assets/diya.png'; // Make sure this asset exists
    
    for(let i=0;i<count;i++){
        const img = document.createElement('img');
        img.src = diyaSrc; 
        img.className = 'diya';
        
        const left = Math.random() * 100;
        img.style.left = left + 'vw';
        
        img.style.top = (100 + Math.random() * 20) + 'vh';
        
        const size = 30 + Math.random()*40; // Slightly larger range
        img.style.width = size + 'px';
        img.style.height = 'auto';
        
        const duration = 8 + Math.random()*10; // Slightly longer duration
        img.style.animation = `floatUp ${duration}s linear infinite`;
        
        img.style.animationDelay = (Math.random()*8) + 's';
        container.appendChild(img);
    }
}

/* run diyas on load */
window.addEventListener('load', ()=>{
    createFloatingDiyas(12);
});

// --- NEW CUSTOMIZATION FUNCTIONS ---

/* New function to apply all current styles/content AFTER elements are built */
function applyInitialStylesToPreview() {
    try {
        // 1. Apply size, font, position, and shadow classes
        applyFontClasses(currentFontClass);
        applyShapeClasses(currentShapeClass);
        applyPositionClass(currentPositionClass);
        applyShadowClass(currentShadow); // NEW Shadow class

        // 2. Apply size (manual call)
        updateSize(currentFontSize);
        
        // 3. Apply colors based on control panel values (now guaranteed to exist)
        const textColor = document.getElementById('textColorInput').value;
        const accentColor = document.getElementById('accentColorInput').value;
        
        updateColor('text', textColor);
        updateColor('accent', accentColor);
        
        // 4. Update the slider display to match currentFontSize
        document.getElementById('currentFontSize').textContent = currentFontSize;
        document.getElementById('fontSizeSlider').value = currentFontSize;
        
        // NEW: Ensure logo is shown/hidden based on saved data
        const logo = document.getElementById('overlayLogo');
        if (ownerDetails.logoSrc && ownerDetails.logoSrc !== DEFAULT_LOGO) {
             logo.style.display = 'block';
        } else {
             // Hide logo if default is still set and no file was uploaded
             logo.style.display = 'none';
        }

    } catch (e) {
        // This is a safety catch. Controls should be initialized before this runs.
        console.warn("Could not apply initial styles, checking element readiness:", e);
    }
}


function initializeControls() {
    // We check if the controls have already been initialized to avoid duplicates
    if (document.getElementById('fontControls').children.length > 0) return;
    
    // 1. Initialize Color Preset Buttons
    const colorPresets = document.getElementById('colorPresets');
    COLOR_PRESETS.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.name;
        button.className = 'option-button';
        // Use background color for visual cue
        button.style.backgroundColor = option.accent; 
        // Set text color to ensure readability on the button itself
        button.style.color = (option.text === '#FFFFFF' || option.text === '#ADD8E6') ? '#2B2B2B' : option.text;
        button.onclick = () => applyPreset(option);
        colorPresets.appendChild(button);
    });

    // 2. Initialize Font Buttons
    const fontControls = document.getElementById('fontControls');
    FONT_OPTIONS.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.name.split(' ')[0]; // Use first word for smaller buttons 
        button.className = 'option-button ' + option.class;
        if (option.class === currentFontClass) {
            button.classList.add('active');
        }
        button.onclick = () => updateFont(option.class, button);
        fontControls.appendChild(button);
    });

    // 3. Initialize Position Buttons
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

    // 4. Initialize Shape Buttons
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

    // 5. Initialize Shadow Buttons (NEW)
    const shadowControls = document.createElement('div');
    shadowControls.className = 'controls-group';
    shadowControls.innerHTML = '<label class="control-label">Text Shadow Effect</label><div id="shadowControlsGrid" class="grid-options">';
    document.querySelector('.customization-panel').insertBefore(shadowControls, fontControls.nextElementSibling); // Insert before Font Controls

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

// Size Update Logic 
function updateSize(size) {
    currentFontSize = size;
    document.getElementById('overlayText').style.fontSize = size + 'px';
    document.getElementById('currentFontSize').textContent = size;
}

// Position Update Logic 
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

// Shadow Update Logic (NEW)
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

// Run this on load to set initial state
window.addEventListener('load', () => {
    document.querySelectorAll('[contenteditable="true"]').forEach(el => {
        if (el.textContent.trim() === '') {
            el.classList.add('empty');
        }
    });
});

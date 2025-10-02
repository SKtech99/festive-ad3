/* main app script for Festive Ad Generator */
let currentStep = 1;
let ownerDetails = {};
let selectedTemplate = '';

// Global variable to track the current font class
let currentFontClass = 'font-cinzel';
let currentShapeClass = 'shape-circle';

const FONT_OPTIONS = [
    { name: 'Divine Cinzel', class: 'font-cinzel' },
    { name: 'Flowing Vibes', class: 'font-great-vibes' },
    { name: 'Modern Poppins', class: 'font-poppins' },
    { name: 'Bold Bebas', class: 'font-bebas-neue' },
    { name: 'Slab Serif', class: 'font-roboto-slab' },
    { name: 'Clean Inter', class: 'font-inter' },
];

const SHAPE_OPTIONS = [
    { name: 'Circle', class: 'shape-circle' },
    { name: 'Sharp Square', class: 'shape-square' },
    { name: 'Rounded Box', class: 'shape-rounded-box' },
    { name: 'Star-ish Cut', class: 'shape-star' },
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

    // scroll into view for mobile friendliness
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Save details + read logo file */
function saveDetails(){
    const shop = document.getElementById('shopName').value.trim();
    const owner = document.getElementById('ownerName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const logoFile = document.getElementById('logo').files[0];

    if(!shop || !owner || !phone || !logoFile){
        showMessage('Please fill all details and upload logo.');
        return;
    }
    ownerDetails.shopName = shop;
    ownerDetails.ownerName = owner;
    ownerDetails.phone = phone;

    const reader = new FileReader();
    reader.onload = function(e){
        ownerDetails.logoSrc = e.target.result;
        nextStep(3);
    };
    reader.readAsDataURL(logoFile);
}

/* Select template and prepare preview */
function selectTemplate(imgSrc){
    selectedTemplate = imgSrc;
    
    const bg = document.getElementById('statusBg');
    const logo = document.getElementById('overlayLogo');
    const text = document.getElementById('overlayText');
    const ownerEl = document.getElementById('overlayOwner');
    const phoneEl = document.getElementById('overlayPhone');

    bg.src = imgSrc;
    // overlay text & owner
    text.textContent = ownerDetails.shopName || '';
    ownerEl.textContent = ownerDetails.ownerName ? 'By: ' + ownerDetails.ownerName : '';
    phoneEl.textContent = ownerDetails.phone ? '📞 ' + ownerDetails.phone : '';
    // overlay logo data-url
    if(ownerDetails.logoSrc){
        logo.src = ownerDetails.logoSrc;
        logo.style.display = 'block';
    } else {
        logo.style.display = 'none';
    }

    // Apply current styles on selection
    applyFontClasses(currentFontClass);
    applyShapeClasses(currentShapeClass);
    
    // little visual pop
    const card = document.querySelector('.status-card');
    card.classList.add('zoomIn');
    setTimeout(()=>card.classList.remove('zoomIn'),900);

    nextStep(4);
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

/* Floating diyas - ensure working (using placeholder image) */
function createFloatingDiyas(count = 8){
    const container = document.getElementById('diya-container');
    if(!container) return;
    // Placeholder for diya image
    const diyaSrc = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MCA1MCI+PHBhdGggZmlsbD0iI0ZGQjMzMyIgZD0iTTI1LDQ4QTE4LDE4LDAsMCwxLDcsMzBjMC00LjE2LDEuNTMtNy43OCw0LjU2LTEwLjYxTDExLjU1LDE5QTEyLDEyLDAsMCwxLDE5LDYuMDRsMy41Ni01LjQ4YTQuMDgsNC4wOCwwLDAsMSw1Ljg4LDByMy41Niw1LjQ4YTEyLDEyLDAsMCwxLDcuNDUsMTIuOTZMMzguNDMsMTkuMzljMy4wMywyLjg0LDQuNTYsNi40NSw0LjU2LDEwLjYxQTE4LDE4LDAsMCwxLDI1LDQ4WiI+PC9wYXRoPjxwYXRoIGZpbGw9IiNGRkFBMDAiIGQ9Ik0yNSw0OGExOCwxOCwwLDAsMS0xNC02LjQ4TDI1LDMwLjEybDM5LDExLjRBMjIuMjIsMjIuMjIsMCwwLDEsNDMsNDIuMTJBNTIsNTIsMCwwLDAsMjUsNDhaIj48L3BhdGg+PHBhdGggZmlsbD0iI0ZGRkYwMCIgZD0iTTIzLDMyYy0uNzgtLjI1LTEuNDgtLjYzLTEuNzctMS42NC0uNzMtMi41MSwxLjE0LTUuODIsNC43MS05LjUzLDMuNTctMy43MSw1LjQzLTcuMDIsNC43MS05LjUzYy0uNjItMi4xNC0zLjA5LTIuMTQtMy43MSwwYy0uNzgsMi41MS0yLjc0LDIuOTctNC40NCwyLjYxYTMuNTQsMy41NCwwLDAsMS0uNjUtLjcyYy0xLjQzLTIuNzItLjIxLTguMTYsMS44Ny0xMC44MnMxMS40Ny0yLjczLDEyLjQsMS44M2MxLjgsOC43Ny0yLjE4LDE3LjgyLTUuNDksMjEuMTNzLTIuMjQsMS43LTIuNTksMS40OFoiPjwvcGF0aD48L3N2Zz4=';
    
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
    const fontControls = document.getElementById('fontControls');
    const shapeControls = document.getElementById('shapeControls');

    // 1. Initialize Font Buttons
    fontControls.innerHTML = '';
    FONT_OPTIONS.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.name;
        button.className = 'option-button ' + option.class;
        if (option.class === currentFontClass) {
            button.classList.add('active');
        }
        button.onclick = () => updateFont(option.class, button);
        fontControls.appendChild(button);
    });

    // 2. Initialize Shape Buttons
    shapeControls.innerHTML = '';
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

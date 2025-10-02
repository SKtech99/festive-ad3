/* main app script for Festive Ad Generator */
let currentStep = 1;
let ownerDetails = {};
let selectedTemplate = '';

/* Step navigation */
function nextStep(step){
  document.getElementById('step' + currentStep).classList.remove('active');
  currentStep = step;
  document.getElementById('step' + currentStep).classList.add('active');

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
    alert('Please fill all details and upload logo.');
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
  // set background
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

  // little visual pop
  const card = document.querySelector('.status-card');
  card.classList.add('zoomIn');
  setTimeout(()=>card.classList.remove('zoomIn'),900);

  nextStep(4);
}

/* Download status as PNG using html2canvas */
function downloadStatus(){
  const area = document.getElementById('statusArea');
  // temporarily remove decorations that may overlap
  // use scale 2 for higher quality
  html2canvas(area, { scale: 2, useCORS: true, allowTaint: true }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'FestiveAd.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(err=>{
    console.error(err);
    alert('Download failed. Try in a different browser (Chrome/Edge) or allow images to be loaded from local assets.');
  });
}

/* ensure background music unmute on first user interaction */
document.addEventListener('click', function onFirstClick(){
  const bg = document.getElementById('bgMusic');
  if(bg) bg.muted = false;
  document.removeEventListener('click', onFirstClick);
});

/* Floating diyas - ensure working */
function createFloatingDiyas(count = 8){
  const container = document.getElementById('diya-container');
  if(!container) return;
  for(let i=0;i<count;i++){
    const img = document.createElement('img');
    img.src = 'assets/diya.png';
    img.className = 'diya';
    // position left randomly across width
    const left = Math.random() * 100;
    img.style.left = left + 'vw';
    // random start below viewport so they float up
    img.style.top = (100 + Math.random() * 20) + 'vh';
    // random size
    const size = 34 + Math.random()*36;
    img.style.width = size + 'px';
    img.style.height = 'auto';
    // animation
    const duration = 9 + Math.random()*8; // 9s - 17s
    img.style.animation = `floatUp ${duration}s linear infinite`;
    // delay offset
    img.style.animationDelay = (Math.random()*6) + 's';
    container.appendChild(img);
  }
}

/* run diyas on load */
window.addEventListener('load', ()=>{
  createFloatingDiyas(9);
});

/* small helper: if user wants to test payment alternatives (message shown) */
function paymentTroubleshootMessage(){
  alert("If a UPI app shows 'bank limit exceeded' or no bank name, try: 1) Use a different UPI app (GPay/PhonePe/Paytm/BHIM). 2) Enter the UPI ID manually into the app and pay. 3) Check with your bank for UPI limits. The site can't control bank-side messages.");
}

/*
  TELEGRAM USERNAME: Replace YOUR_USERNAME below with the correct Telegram username.
  TEXT CONTENT: Button messages can be edited in the strings below.
  ANIMATIONS: Movement distance and timing for the evasive button are controlled in this file and style.css.
*/
const telegramLink = 'https://t.me/cheshire_ironi';

const eyes = document.querySelectorAll('.eye');
const catFace = document.getElementById('catFace');
const secretMessage = document.getElementById('secretMessage');
const statusMessage = document.getElementById('statusMessage');
const primaryButton = document.getElementById('primaryButton');
const secondaryButton = document.getElementById('secondaryButton');

let evasiveAttempts = 0;
let canMove = true;
let statusTimeout;

const evasiveWarnings = [
  'Are you sure?',
  'Linka is watching.',
  'This decision will be remembered.',
  'Do not make a mistake.',
  'Think again'
];

function showStatus(message, duration = 1500) { // <-- добавили duration со значением по умолчанию 1500
  statusMessage.innerHTML = message;

  statusMessage.classList.remove('active');
  void statusMessage.offsetWidth;
  statusMessage.classList.add('active');

  clearTimeout(statusTimeout);

  statusTimeout = setTimeout(() => {
    statusMessage.classList.remove('active');
  }, duration); // <-- теперь здесь используется переменная duration, а не жесткие 1500!
}

function trackPupils(event) {
  let isNearAnyPupilZone = false;
  let isNearAnyEyeZone = false;

  eyes.forEach((eye) => {
    const pupil = eye.querySelector('.pupil');
    const rect = eye.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;
    const distanceX = event.clientX - eyeCenterX;
    const distanceY = event.clientY - eyeCenterY;
    const angle = Math.atan2(distanceY, distanceX);
    
    // Плавное движение зрачков за курсором
    const distance = Math.min(10, Math.hypot(distanceX, distanceY) / 20);
    pupil.style.transform = `translate(calc(-50% + ${Math.cos(angle) * distance}px), calc(-50% + ${Math.sin(angle) * distance}px))`;

    // Запоминаем, если курсор вошел в зону расширения зрачков (280px)
    if (Math.hypot(distanceX, distanceY) < 280) {
      isNearAnyPupilZone = true;
    }
    
    // Запоминаем, если курсор вошел в зону свечения (140px)
    if (Math.hypot(distanceX, distanceY) < 140) {
      isNearAnyEyeZone = true;
    }
  });

  // ЭТАП 1: Синхронно управляем зрачками ОБОИХ глаз сразу
  if (isNearAnyPupilZone) {
    eyes.forEach((e) => e.classList.add('expand-pupil'));
  } else {
    eyes.forEach((e) => e.classList.remove('expand-pupil'));
  }

  // ЭТАП 2: Синхронно включаем свечение и секретное сообщение
  if (isNearAnyEyeZone) {
    eyes.forEach((e) => e.classList.add('is-alert'));
    secretMessage.classList.add('visible');
  } else {
    eyes.forEach((e) => e.classList.remove('is-alert'));
    secretMessage.classList.remove('visible');
  }
}

/*function moveEvasiveButton() {
  evasiveAttempts += 1;
  const warning = evasiveWarnings[(evasiveAttempts - 1) % evasiveWarnings.length];
  showStatus(warning);

  const buttonRect = secondaryButton.getBoundingClientRect();
  const card = document.querySelector('.mission-card');
  const cardRect = card.getBoundingClientRect();
const padding = 24;

const minLeft = cardRect.left + padding;
const maxLeft = cardRect.right - buttonRect.width - padding;

const minTop = cardRect.top + padding;
const maxTop = cardRect.bottom - buttonRect.height - padding;

const nextLeft =
  Math.random() * (maxLeft - minLeft) + minLeft;

const nextTop =
  Math.random() * (maxTop - minTop) + minTop;
  

  secondaryButton.classList.add('floating');
  secondaryButton.style.left = `${nextLeft}px`;
  secondaryButton.style.top = `${nextTop}px`;
}*/
function moveEvasiveButton() {
  evasiveAttempts += 1;
  const warning = evasiveWarnings[(evasiveAttempts - 1) % evasiveWarnings.length];
  showStatus(warning);

  const buttonRect = secondaryButton.getBoundingClientRect();
  const card = document.querySelector('.mission-card');
  const cardRect = card.getBoundingClientRect();
  const padding = 24;

  // По горизонтали всё остается родное и общее:
  const minLeft = cardRect.left + padding;
  const maxLeft = cardRect.right - buttonRect.width - padding;

  // Создаем переменные для вертикали
  let minTop, maxTop;

  // ЕСЛИ ЭТО МОБИЛКА (экран 750px и меньше):
  if (window.innerWidth <= 750) {
    minTop = padding; 
    maxTop = window.innerHeight - buttonRect.height - padding; // прыгает строго в границах экрана смартфона
  } 
  // ИНАЧЕ (это компьютер):
  else {
    minTop = cardRect.top + padding;
    maxTop = cardRect.bottom - buttonRect.height - padding; // твой родной расчет строго внутри рамки карточки
  }

  // Твой стандартный расчет случайных координат:
  const nextLeft = Math.random() * (maxLeft - minLeft) + minLeft;
  const nextTop = Math.random() * (maxTop - minTop) + minTop;
  
  secondaryButton.classList.add('floating');
  secondaryButton.style.left = `${nextLeft}px`;
  secondaryButton.style.top = `${nextTop}px`;
}




function detectButtonApproach(event) {
  const rect = secondaryButton.getBoundingClientRect();
  const closestX = Math.max(rect.left, Math.min(event.clientX, rect.right));
  const closestY = Math.max(rect.top, Math.min(event.clientY, rect.bottom));
  const distance = Math.hypot(event.clientX - closestX, event.clientY - closestY);

  if (distance < 20 && canMove) {
  canMove = false;

  moveEvasiveButton();

  setTimeout(() => {
    canMove = true;
  }, 500);
}
}

primaryButton.addEventListener('click', () => {
  showStatus('Mission authorization approved.<br>Connecting to the Gift Officer...');
  setTimeout(() => {
    window.open(telegramLink, '_blank', 'noopener,noreferrer');
  }, 1500);
});

secondaryButton.addEventListener('click', () => {
  showStatus('Mission aborted.<br><br>Linka has noticed your failure.<br><br>Consequences are currently being evaluated.', 4000);
  
});

function showSecretMessage() {
  secretMessage.classList.add('visible');

  setTimeout(() => {
    secretMessage.classList.remove('visible');
  }, 2500);
}

catFace.addEventListener('mouseenter', showSecretMessage);
catFace.addEventListener('click', showSecretMessage);

document.addEventListener('mousemove', trackPupils);
document.addEventListener('mousemove', detectButtonApproach);

window.addEventListener('resize', () => {
  secondaryButton.classList.remove('floating');
  secondaryButton.style.left = '';
  secondaryButton.style.top = '';
});

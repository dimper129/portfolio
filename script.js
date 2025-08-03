// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav ul');
const navLinks = document.querySelectorAll('nav a');
const projectArticles = document.querySelectorAll('#projects article');
const projectImages = document.querySelectorAll('#projects figure img');
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

// Toggle mobile menu
function toggleMenu() {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('show');
  
  // Toggle aria-expanded for accessibility
  const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', !isExpanded);
}

// Smooth scrolling for navigation links
function smoothScroll(e) {
  e.preventDefault();
  const targetId = this.getAttribute('href');
  const targetElement = document.querySelector(targetId);
  
  window.scrollTo({
    top: targetElement.offsetTop - 20,
    behavior: 'smooth'
  });
  
  // Close mobile menu if open
  if (navMenu.classList.contains('show')) {
    toggleMenu();
  }
}

// Filter projects by category
function filterProjects(category) {
  // Update active button
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.textContent.toLowerCase().includes(category) || 
        (category === 'all' && btn.textContent === 'All')) {
      btn.classList.add('active');
    }
  });
  
  // Filter projects
  projectArticles.forEach(project => {
    const projectCategories = project.dataset.categories.split(' ');
    
    if (category === 'all' || projectCategories.includes(category)) {
      project.style.display = 'block';
    } else {
      project.style.display = 'none';
    }
  });
}

// Lightbox functionality
function openLightbox(e) {
  e.preventDefault();
  const imgSrc = this.getAttribute('src');
  const imgAlt = this.getAttribute('alt');
  
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <img src="${imgSrc}" alt="${imgAlt}">
      <button class="close-lightbox" aria-label="Close lightbox">×</button>
    </div>
  `;
  
  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';
  
  // Close lightbox when clicked outside or on close button
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('close-lightbox')) {
      closeLightbox();
    }
  });
  
  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.remove();
    document.body.style.overflow = '';
  }
}

// Form validation
function validateForm() {
  let isValid = true;
  
  // Reset error states
  resetErrors();
  
  // Name validation
  if (nameInput.value.trim() === '') {
    showError(nameInput, 'Name is required');
    isValid = false;
  }
  
  // Email validation
  if (emailInput.value.trim() === '') {
    showError(emailInput, 'Email is required');
    isValid = false;
  } else if (!isValidEmail(emailInput.value.trim())) {
    showError(emailInput, 'Please enter a valid email');
    isValid = false;
  }
  
  // Message validation
  if (messageInput.value.trim() === '') {
    showError(messageInput, 'Message is required');
    isValid = false;
  } else if (messageInput.value.trim().length < 10) {
    showError(messageInput, 'Message should be at least 10 characters');
    isValid = false;
  }
  
  return isValid;
}

function showError(input, message) {
  const formControl = input.parentElement;
  const errorMessage = document.createElement('p');
  errorMessage.className = 'error-message';
  errorMessage.textContent = message;
  formControl.appendChild(errorMessage);
  input.classList.add('error');
}

function resetErrors() {
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(msg => msg.remove());
  
  const errorInputs = document.querySelectorAll('.error');
  errorInputs.forEach(input => input.classList.remove('error'));
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // Initialize hamburger button accessibility
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Toggle menu');
  
  // Mobile menu toggle
  hamburger.addEventListener('click', toggleMenu);
  
  // Smooth scrolling for nav links
  navLinks.forEach(link => {
    if (link.getAttribute('href').startsWith('#')) {
      link.addEventListener('click', smoothScroll);
    }
  });
  
  // Lightbox for project images
  projectImages.forEach(img => {
    img.addEventListener('click', openLightbox);
  });
  
  // Form submission
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate form submission
      console.log('Form submitted:', {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
      });
      
      // Show success message
      alert('Thank you for your message! I will get back to you soon.');
      contactForm.reset();
    }
  });
  
  // Real-time validation
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim() !== '') {
      resetErrorsForInput(nameInput);
    }
  });
  
  emailInput.addEventListener('input', () => {
    if (emailInput.value.trim() !== '' && isValidEmail(emailInput.value.trim())) {
      resetErrorsForInput(emailInput);
    }
  });
  
  messageInput.addEventListener('input', () => {
    if (messageInput.value.trim() !== '' && messageInput.value.trim().length >= 10) {
      resetErrorsForInput(messageInput);
    }
  });
});

function resetErrorsForInput(input) {
  const formControl = input.parentElement;
  const errorMessage = formControl.querySelector('.error-message');
  
  if (errorMessage) {
    errorMessage.remove();
    input.classList.remove('error');
  }
}
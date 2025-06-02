// Main JavaScript functionality for CantiLab website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initManufacturingViewer();
    initContactForm();
    initScrollAnimations();
    initSmoothScrolling();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(15, 23, 42, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Active nav link highlighting
    window.addEventListener('scroll', updateActiveNavLink);
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Manufacturing process viewer
function initManufacturingViewer() {
    const processSteps = document.querySelectorAll('.process-step');
    const processImage = document.getElementById('process-diagram');
    const stepContents = document.querySelectorAll('.step-content');
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');
    
    let currentStep = 1;
    const totalSteps = 5;
    
    // Process step navigation
    processSteps.forEach((step, index) => {
        step.addEventListener('click', () => {
            showStep(index + 1);
        });
    });
    
    // Previous/Next buttons
    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    });
    
    function showStep(stepNumber) {
        currentStep = stepNumber;
        
        // Update step buttons
        processSteps.forEach((step, index) => {
            if (index + 1 === stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update image with fade effect
        processImage.style.opacity = '0';
        setTimeout(() => {
            processImage.src = `assets/manufacturing-step-${stepNumber}.png`;
            processImage.style.opacity = '1';
        }, 150);
        
        // Update content
        stepContents.forEach((content, index) => {
            if (index + 1 === stepNumber) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        // Update navigation buttons
        prevBtn.disabled = stepNumber === 1;
        nextBtn.disabled = stepNumber === totalSteps;
        
        if (stepNumber === 1) {
            prevBtn.style.opacity = '0.5';
        } else {
            prevBtn.style.opacity = '1';
        }
        
        if (stepNumber === totalSteps) {
            nextBtn.style.opacity = '0.5';
        } else {
            nextBtn.style.opacity = '1';
        }
    }
    
    // Auto-advance functionality (optional)
    let autoAdvanceInterval;
    
    function startAutoAdvance() {
        autoAdvanceInterval = setInterval(() => {
            if (currentStep < totalSteps) {
                showStep(currentStep + 1);
            } else {
                showStep(1); // Loop back to first step
            }
        }, 8000); // Change every 8 seconds
    }
    
    function stopAutoAdvance() {
        clearInterval(autoAdvanceInterval);
    }
    
    // Start auto-advance when manufacturing section is visible
    const manufacturingSection = document.getElementById('manufacturing');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startAutoAdvance();
            } else {
                stopAutoAdvance();
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(manufacturingSection);
    
    // Stop auto-advance on user interaction
    document.querySelector('.manufacturing-viewer').addEventListener('click', stopAutoAdvance);
    
    // Initialize first step
    showStep(1);
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            position: document.getElementById('position').value,
            interest: document.getElementById('interest').value,
            message: document.getElementById('message').value
        };
        
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'company', 'interest'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!formData[field].trim()) {
                input.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (!isValid) {
            showMessage('Please fill in all required fields.', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            document.getElementById('email').style.borderColor = '#ef4444';
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (in real implementation, this would send to a server)
        setTimeout(() => {
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showMessage('Thank you for your inquiry! We will contact you within 24 hours to discuss your diagnostic needs.', 'success');
            
            // Log form data for demonstration
            console.log('Form submitted:', formData);
            
        }, 2000);
    });
    
    function showMessage(text, type) {
        // Remove existing messages
        const existingMessages = contactForm.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.textContent = text;
        
        // Add message to form
        contactForm.appendChild(messageDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
}

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.problem-card, .tech-card, .feature-item, .stat-card, .model-item'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in', 'visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Counter animation for statistics
    const counterElements = document.querySelectorAll('.stat-item h3, .stat-content h3');
    
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number based on content
            if (element.textContent.includes('€')) {
                element.textContent = `€${current.toFixed(1)}T`;
            } else if (element.textContent.includes('x')) {
                element.textContent = `${Math.round(current)}x`;
            } else if (element.textContent.includes('%')) {
                element.textContent = `${Math.round(current)}%`;
            } else if (element.textContent.includes('+')) {
                element.textContent = `${Math.round(current).toLocaleString()}+`;
            } else {
                element.textContent = Math.round(current).toLocaleString();
            }
        }, 16);
    }
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                
                const text = entry.target.textContent;
                let targetValue = 0;
                
                if (text.includes('50x')) targetValue = 50;
                else if (text.includes('€1.2T')) targetValue = 1.2;
                else if (text.includes('5,000+')) targetValue = 5000;
                else if (text.includes('15%')) targetValue = 15;
                
                if (targetValue > 0) {
                    animateCounter(entry.target, targetValue);
                }
            }
        });
    }, { threshold: 0.5 });
    
    counterElements.forEach(el => {
        statsObserver.observe(el);
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Performance optimization: Debounce scroll events
const debouncedScroll = debounce(() => {
    // Any scroll-based functionality that needs debouncing
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        console.warn(`Failed to load image: ${this.src}`);
        // You could replace with a placeholder here
        this.style.display = 'none';
    });
});

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // Close mobile menu on escape
    if (e.key === 'Escape') {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            const navbarToggler = document.querySelector('.navbar-toggler');
            navbarToggler.click();
        }
    }
});

// Print styles optimization
window.addEventListener('beforeprint', function() {
    // Hide interactive elements before printing
    document.querySelectorAll('.navbar, .process-controls').forEach(el => {
        el.style.display = 'none';
    });
});

window.addEventListener('afterprint', function() {
    // Restore elements after printing
    document.querySelectorAll('.navbar, .process-controls').forEach(el => {
        el.style.display = '';
    });
});

// Software access request functionality
function requestSoftwareAccess(softwareType) {
    const softwareNames = {
        'control': 'CantiLab Control',
        'analytics': 'CantiLab Analytics',
        'mobile': 'CantiLab Mobile'
    };
    
    const softwareName = softwareNames[softwareType] || 'CantiLab Software';
    
    // Show confirmation dialog
    const confirmed = confirm(
        `You are requesting access to ${softwareName}.\n\n` +
        `This software is available exclusively to customers with active service agreements. ` +
        `You will be redirected to the contact form to submit your access request.\n\n` +
        `Continue?`
    );
    
    if (confirmed) {
        // Scroll to contact form
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = contactSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Pre-fill the interest dropdown
            setTimeout(() => {
                const interestSelect = document.getElementById('interest');
                const messageTextarea = document.getElementById('message');
                
                if (interestSelect) {
                    interestSelect.value = 'technical';
                }
                
                if (messageTextarea) {
                    messageTextarea.value = `I would like to request access to ${softwareName}. Please provide download instructions and licensing information.`;
                    messageTextarea.focus();
                }
            }, 1000);
        }
    }
}

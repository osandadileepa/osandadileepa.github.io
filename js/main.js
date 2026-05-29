/**
 * Osanda Wedamulla Portfolio
 * Modern animations and interactions with GSAP, ScrollTrigger, and Three.js
 */

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initialize components
    initPageLoader();
    initNavigation();
    initHeroAnimations(prefersReducedMotion);
    initParticleNetwork(prefersReducedMotion);
    initScrollAnimations(prefersReducedMotion);
    initCounters();
    initSkillBars();
    initProjectFilters();
    initMagneticButtons();
    initContactForm();
    initBackToTop();
    initTiltEffect();
});

// ============================================
// PAGE LOADER
// ============================================

function initPageLoader() {
    const loader = document.getElementById('page-loader');
    
    window.addEventListener('load', () => {
        gsap.to(loader, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                loader.classList.add('hidden');
            }
        });
    });
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger
        const lines = navToggle.querySelectorAll('.hamburger-line');
        if (navMenu.classList.contains('active')) {
            gsap.to(lines[0], { rotation: 45, y: 8, duration: 0.3 });
            gsap.to(lines[1], { opacity: 0, duration: 0.3 });
            gsap.to(lines[2], { rotation: -45, y: -8, duration: 0.3 });
        } else {
            gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(lines[1], { opacity: 1, duration: 0.3 });
            gsap.to(lines[2], { rotation: 0, y: 0, duration: 0.3 });
        }
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const lines = navToggle.querySelectorAll('.hamburger-line');
            gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3 });
            gsap.to(lines[1], { opacity: 1, duration: 0.3 });
            gsap.to(lines[2], { rotation: 0, y: 0, duration: 0.3 });
        });
    });
    
    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollPos = window.pageYOffset + 200;
        
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
    }, { passive: true });
}

// ============================================
// HERO ANIMATIONS
// ============================================

function initHeroAnimations(prefersReducedMotion) {
    if (prefersReducedMotion) return;
    
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    // Hero badge animation
    tl.from('.hero-badge', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.5
    });
    
    // Title animations with character split effect
    tl.from('.title-line', {
        y: 50,
        opacity: 0,
        duration: 0.8
    }, '-=0.4');
    
    tl.from('.title-name', {
        y: 80,
        opacity: 0,
        duration: 1,
        ease: 'power4.out'
    }, '-=0.5');
    
    tl.from('.title-role', {
        y: 50,
        opacity: 0,
        duration: 0.8
    }, '-=0.6');
    
    // Description
    tl.from('.hero-description', {
        y: 40,
        opacity: 0,
        duration: 0.8
    }, '-=0.5');
    
    // CTA buttons
    tl.from('.hero-cta .btn', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15
    }, '-=0.4');
    
    // Stats
    tl.from('.hero-stats .stat-item', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1
    }, '-=0.3');
    
    // Scroll indicator
    tl.from('.hero-scroll', {
        opacity: 0,
        duration: 0.8
    }, '-=0.2');
}

// ============================================
// THREE.JS PARTICLE NETWORK
// ============================================

function initParticleNetwork(prefersReducedMotion) {
    if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) {
        // Skip particles on mobile or reduced motion
        const canvas = document.getElementById('hero-canvas');
        if (canvas) canvas.style.display = 'none';
        return;
    }
    
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Particle settings
    const particleCount = 80;
    const connectionDistance = 150;
    const particles = [];
    
    // Create particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
        
        velocities.push({
            x: (Math.random() - 0.5) * 0.005,
            y: (Math.random() - 0.5) * 0.005,
            z: (Math.random() - 0.5) * 0.002
        });
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0x00d4ff,
        size: 0.05,
        transparent: true,
        opacity: 0.6
    });
    
    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    
    // Create lines for connections
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.15
    });
    
    camera.position.z = 5;
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });
    
    // Animation loop
    let animationId;
    let isVisible = true;
    
    // Visibility check
    const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    
    observer.observe(canvas);
    
    function animate() {
        animationId = requestAnimationFrame(animate);
        
        if (!isVisible) return;
        
        const positions = geometry.attributes.position.array;
        
        // Update particle positions
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;
            positions[i * 3 + 2] += velocities[i].z;
            
            // Boundary check
            if (Math.abs(positions[i * 3]) > 5) velocities[i].x *= -1;
            if (Math.abs(positions[i * 3 + 1]) > 5) velocities[i].y *= -1;
            if (Math.abs(positions[i * 3 + 2]) > 2.5) velocities[i].z *= -1;
        }
        
        geometry.attributes.position.needsUpdate = true;
        
        // Camera parallax
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;
        
        camera.position.x += (targetX - camera.position.x) * 0.02;
        camera.position.y += (targetY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Cleanup on page hide
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

// ============================================
// SCROLL ANIMATIONS (GSAP ScrollTrigger)
// ============================================

function initScrollAnimations(prefersReducedMotion) {
    if (prefersReducedMotion) return;
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header.children, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out'
        });
    });
    
    // About section
    gsap.from('.about-image-wrapper', {
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        x: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.about-content > *', {
        scrollTrigger: {
            trigger: '.about-content',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });
    
    gsap.from('.info-item', {
        scrollTrigger: {
            trigger: '.about-info',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
    });
    
    // Timeline animation
    const timelineProgress = document.querySelector('.timeline-progress');
    if (timelineProgress) {
        gsap.to(timelineProgress, {
            scrollTrigger: {
                trigger: '.timeline',
                start: 'top 60%',
                end: 'bottom 40%',
                scrub: 1
            },
            height: '100%',
            ease: 'none'
        });
    }
    
    gsap.from('.timeline-item', {
        scrollTrigger: {
            trigger: '.timeline',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: 'power3.out'
    });
    
    // Services cards
    gsap.from('.service-card', {
        scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });
    
    // Tech cards
    gsap.from('.tech-card', {
        scrollTrigger: {
            trigger: '.tech-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'back.out(1.7)'
    });
    
    // Cloud tags
    gsap.from('.cloud-tag', {
        scrollTrigger: {
            trigger: '.cloud-tags',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power3.out'
    });
    
    // Project cards
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });
    
    // Stats section
    gsap.from('.stat-box', {
        scrollTrigger: {
            trigger: '.stats-grid',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });
    
    // Contact section
    gsap.from('.contact-info > *', {
        scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });
    
    gsap.from('.contact-form-wrapper', {
        scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        x: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    // Parallax effect on floating shapes
    gsap.to('.shape-1', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        y: -100,
        ease: 'none'
    });
    
    gsap.to('.shape-2', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        y: 100,
        ease: 'none'
    });
}

// ============================================
// COUNTERS ANIMATION
// ============================================

function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const start = 0;
                const startTime = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function (ease-out)
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(easeOut * (target - start) + start);
                    
                    counter.textContent = current;
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                }
                
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

// ============================================
// SKILL BARS ANIMATION
// ============================================

function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillPercents = document.querySelectorAll('.skill-percent');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                
                // Animate bar width
                gsap.to(bar, {
                    width: `${width}%`,
                    duration: 1.5,
                    ease: 'power3.out'
                });
                
                // Animate percentage counter
                const percentEl = bar.closest('.skill-item').querySelector('.skill-percent');
                if (percentEl) {
                    const targetValue = parseInt(percentEl.getAttribute('data-value'));
                    
                    gsap.to({ val: 0 }, {
                        val: targetValue,
                        duration: 1.5,
                        ease: 'power3.out',
                        onUpdate: function() {
                            percentEl.textContent = Math.round(this.targets()[0].val) + '%';
                        }
                    });
                }
                
                observer.unobserve(bar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => observer.observe(bar));
}

// ============================================
// PROJECT FILTERS
// ============================================

function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // Filter projects with animation
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    gsap.to(card, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.4,
                        ease: 'power2.out',
                        display: 'block'
                    });
                } else {
                    gsap.to(card, {
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.4,
                        ease: 'power2.out',
                        onComplete: () => {
                            card.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// ============================================
// MAGNETIC BUTTONS
// ============================================

function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

// ============================================
// 3D TILT EFFECT
// ============================================

function initTiltEffect() {
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    // Skip on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

// ============================================
// CONTACT FORM
// ============================================

function initContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('.btn-submit');
        const originalText = btn.innerHTML;
        
        // Show loading state
        btn.innerHTML = '<span class="btn-text">Sending...</span>';
        btn.disabled = true;
        
        // Simulate form submission (replace with actual endpoint)
        setTimeout(() => {
            btn.innerHTML = '<span class="btn-text">Message Sent!</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="btn-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>';
            btn.style.background = '#22c55e';
            
            // Reset form
            form.reset();
            
            // Reset button after delay
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.style.background = '';
                lucide.createIcons();
            }, 3000);
        }, 1500);
    });
}

// ============================================
// BACK TO TOP
// ============================================

function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    
    if (!backToTop) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Account for fixed navbar
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// PERFORMANCE OPTIMIZATIONS
// ============================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Preload critical resources
const preloadLinks = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap'
];

preloadLinks.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
});

// Dynamic copyright year
const currentYearEl = document.getElementById('current-year');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

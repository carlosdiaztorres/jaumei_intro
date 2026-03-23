// script.js

document.addEventListener("DOMContentLoaded", () => {
    // Intersection Observer callback to trigger scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Fire when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve if you only want the animation to happen once
                // observer.unobserve(entry.target);
            } else {
                // Optional: Remove class if you want animations to repeat when scrolling up and down
                // (Depends on the desired effect, leaving it active creates a more dynamic scroll feel)
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    // Apply observer to all elements with class 'section-scroll'
    const scrollElements = document.querySelectorAll('.section-scroll');
    scrollElements.forEach(el => observer.observe(el));
    
    // Add small progressive delay to features list to create a beautiful staggered effect
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.15}s`;
    });

    // --- Video Presentation Mode (Slide Dissolve) ---
    const videoBtn = document.getElementById('video-mode-btn');
    if (videoBtn) {
        // Clone button to securely remove old event listeners if reloading script
        const newBtn = videoBtn.cloneNode(true);
        videoBtn.parentNode.replaceChild(newBtn, videoBtn);
        
        newBtn.addEventListener('click', async () => {
            newBtn.classList.add('recording');
            document.body.classList.add('video-mode-active');
            window.scrollTo(0, 0); // Reset scroll physically just in case
            
            const wait = ms => new Promise(r => setTimeout(r, ms));
            await wait(1500); // Time to click record
            
            const sections = document.querySelectorAll('header.hero, section, footer');
            sections.forEach(sec => sec.classList.remove('active-slide'));
            
            // 1. Initial slide setup
            sections[0].classList.add('active-slide');
            const heroContent = sections[0].querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.opacity = '0';
                heroContent.style.transition = 'opacity 2s ease-in-out';
                await wait(2500); // Pure BG
                heroContent.style.opacity = '1'; // Dissolve text
                await wait(6000); // Reading time
            }
            
            // 2. Loop for true overlapping cross-dissolve
            for (let i = 1; i < sections.length; i++) {
                // Determine read time for the upcoming section based on text size
                let readTime = 6000; // Default for small sections
                if (sections[i].classList.contains('philosophy')) {
                    readTime = 10000; // 3 large paragraphs
                } else if (sections[i].classList.contains('educational-project')) {
                    readTime = 9000; // 6 features
                } else if (sections[i].classList.contains('special-projects')) {
                    readTime = 6000; // Just visual tags
                } else if (sections[i].classList.contains('services')) {
                    readTime = 7000; // 4 rows
                } else if (sections[i].tagName.toLowerCase() === 'footer') {
                    readTime = 4000; // Just image and short text
                }
                
                // Start cross-dissolve: fade next slide IN
                sections[i].classList.add('active-slide');
                
                // Wait for the new slide to become fully opaque (1.5s CSS transition overlap)
                await wait(1500);
                
                // Safely remove the old slide from underneath
                sections[i - 1].classList.remove('active-slide');
                
                // Wait for the user to read the current slide
                await wait(readTime);
            }
            
            // Presentation Concluded
            await wait(4000);
            document.body.classList.remove('video-mode-active');
            newBtn.classList.remove('recording');
            
            // Clean up inline styles
            const cleanupHero = document.querySelector('.hero-content');
            if (cleanupHero) {
                cleanupHero.style.opacity = '';
                cleanupHero.style.transition = '';
            }
        });
    }
});

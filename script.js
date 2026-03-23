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
            
            for (let i = 0; i < sections.length; i++) {
                sections[i].classList.add('active-slide');
                
                if (i === 0) {
                    // Hero: show Only BG for a few seconds
                    const heroContent = sections[0].querySelector('.hero-content');
                    if (heroContent) {
                        heroContent.style.opacity = '0';
                        heroContent.style.transition = 'opacity 2s ease-in-out';
                        
                        await wait(2500); // Background only
                        heroContent.style.opacity = '1'; // Dissolve texts in
                        await wait(6000); // Read time for title
                    }
                } else {
                    // Reading time based on section content size to be comfortable
                    let readTime = 8000;
                    if (sections[i].classList.contains('philosophy') || sections[i].classList.contains('educational-project')) {
                        readTime = 12000;
                    } else if (sections[i].classList.contains('special-projects') || sections[i].classList.contains('services')) {
                        readTime = 10000;
                    } else if (sections[i].tagName.toLowerCase() === 'footer') {
                        readTime = 6000;
                    }
                    await wait(readTime);
                }
                
                // Fade out current slide, unless it's the final slide
                if (i < sections.length - 1) {
                    sections[i].classList.remove('active-slide');
                    await wait(1500); // Let the CSS dissolve transition complete before showing the next one
                }
            }
            
            // Presentation Concluded
            await wait(4000);
            document.body.classList.remove('video-mode-active');
            newBtn.classList.remove('recording');
            
            // Clean up inline styles
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.opacity = '';
                heroContent.style.transition = '';
            }
        });
    }
});

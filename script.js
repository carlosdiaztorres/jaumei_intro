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

    // --- Video Auto-Scroll Mode ---
    const videoBtn = document.getElementById('video-mode-btn');
    if (videoBtn) {
        videoBtn.addEventListener('click', async () => {
            // Smoothly hide button
            videoBtn.classList.add('recording');
            
            // Wait 1.5 seconds so the user has time to start recording without mouse movement
            await new Promise(r => setTimeout(r, 1500));
            
            // Scroll to top first just in case
            window.scrollTo({ top: 0, behavior: 'instant' });
            await new Promise(r => setTimeout(r, 1000));
            
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const duration = 35000; // 35 seconds total scroll time -> nice, readable pace
            const startTime = performance.now();
            
            function step(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Linear scroll for cinematic smoothness
                const currentScroll = totalHeight * progress;
                window.scrollTo(0, currentScroll);
                
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    // Re-show button 3 seconds after reaching bottom
                    setTimeout(() => videoBtn.classList.remove('recording'), 3000);
                }
            }
            
            window.requestAnimationFrame(step);
        });
    }
});

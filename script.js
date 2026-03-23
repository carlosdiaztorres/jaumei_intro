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
        item.style.transitionDelay = `${index * 0.1}s`;
    });
});

// reveal-on-scroll.js
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Trigger when 30% visible
    };

    // Store timeouts to clear them if user scrolls away quickly
    const animationTimeouts = new Map();

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // If it's the split wrapper, trigger the unique split animation
                if (entry.target.classList.contains('split-animation-wrapper')) {
                    // Clear any existing timeout (if re-entering quickly)
                    if (animationTimeouts.has(entry.target)) {
                        clearTimeout(animationTimeouts.get(entry.target));
                    }

                    // "Stick" effect: Wait 1 second before triggering the split
                    const timeoutId = setTimeout(() => {
                        entry.target.classList.add('split-active');
                    }, 1000); // 1000ms delay

                    animationTimeouts.set(entry.target, timeoutId);

                    // Do NOT unobserve to allow reversing
                    // observer.unobserve(entry.target);
                }
                // Fallback for other standard reveals
                else if (entry.target.classList.contains('reveal-on-scroll')) {
                    entry.target.classList.add('card-visible');
                    // observer.unobserve(entry.target); // Optional: keep observing if you want cards to reset too
                }
                // DETAILS STACK ANIMATION
                else if (entry.target.classList.contains('details-stack-wrapper')) {
                    if (animationTimeouts.has(entry.target)) {
                        clearTimeout(animationTimeouts.get(entry.target));
                    }

                    // Wait 1 second before unstacking
                    const timeoutId = setTimeout(() => {
                        entry.target.classList.add('details-active');
                    }, 1000);

                    animationTimeouts.set(entry.target, timeoutId);
                }
            } else {
                // REVERSE ANIMATION: When key element leaves viewport
                if (entry.target.classList.contains('split-animation-wrapper')) {
                    // Clear pending split if user scrolls away before 1s
                    if (animationTimeouts.has(entry.target)) {
                        clearTimeout(animationTimeouts.get(entry.target));
                        animationTimeouts.delete(entry.target);
                    }

                    // Reset to initial state (Single Surname Box)
                    entry.target.classList.remove('split-active');
                }
                // Reverse Details Stack
                else if (entry.target.classList.contains('details-stack-wrapper')) {
                    if (animationTimeouts.has(entry.target)) {
                        clearTimeout(animationTimeouts.get(entry.target));
                        animationTimeouts.delete(entry.target);
                    }
                    entry.target.classList.remove('details-active');
                }
            }
        });
    }, observerOptions);

    // Observe the main wrapper for the split animation
    const splitWrapper = document.querySelector('.split-animation-wrapper');
    if (splitWrapper) observer.observe(splitWrapper);

    // Observe details stack wrapper
    const detailsWrapper = document.querySelector('.details-stack-wrapper');
    if (detailsWrapper) observer.observe(detailsWrapper);

    // Keep observing other elements if needed
    const otherCards = document.querySelectorAll('.reveal-on-scroll:not(.final-cards .name-card)');
    otherCards.forEach(card => observer.observe(card));
});

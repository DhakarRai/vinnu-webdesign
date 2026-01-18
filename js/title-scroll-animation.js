/* ========================================
   TITLE SCROLL ANIMATION - SPLIT HEADINGS
   Controls animated title reveal during hero scroll
   ======================================== */

(function () {
    'use strict';

    // ========================================
    // STATE
    // ========================================
    const state = {
        titleTop: null,
        titleBottom: null,
        heroSection: null,
        canvasWrapper: null,
        ticking: false,
        virtualScroll: 0,
        scrollProgress: 0,
        lastTouchY: null
    };

    // ========================================
    // CONFIGURATION
    // ========================================
    const config = {
        // Sync with hero-scroll-animation.js
        scrollDistance: 800,
        // Animation starts immediately with scroll
        animationStartProgress: 0.0,
        animationEndProgress: 1.0
    };

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        // Get DOM elements
        state.titleTop = document.querySelector('.animated-title-top');
        state.titleBottom = document.querySelector('.animated-title-bottom');
        state.heroSection = document.querySelector('.hero-section');
        state.canvasWrapper = document.querySelector('.canvas-wrapper');

        // Check if elements exist
        if (!state.titleTop || !state.titleBottom) {
            console.warn('Title scroll animation: Required elements not found');
            return;
        }

        // Set up scroll listener - must match hero-scroll-animation.js
        setupScrollLockListener();

        // Initial state
        applyTitleTransforms(0);
    }

    // ========================================
    // SCROLL LOCK LISTENER (BI-DIRECTIONAL)
    // ========================================
    function setupScrollLockListener() {
        // Intercept wheel events (mouse scroll)
        window.addEventListener('wheel', onWheel, { passive: true });

        // Intercept touch events (mobile)
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: true });
    }

    function onWheel(e) {
        const scrollY = window.scrollY;

        if (scrollY < 5) {
            const deltaY = e.deltaY;

            // Update virtual scroll
            if ((deltaY > 0 && state.scrollProgress < 1) ||
                (deltaY < 0 && state.scrollProgress > 0)) {
                state.virtualScroll += deltaY;
                updateVirtualScroll();
            }
        }
    }

    function onTouchStart(e) {
        if (e.touches.length > 0) {
            state.lastTouchY = e.touches[0].clientY;
        }
    }

    function onTouchMove(e) {
        const scrollY = window.scrollY;

        if (scrollY < 5 && state.lastTouchY !== null) {
            const touch = e.touches[0];
            const deltaY = state.lastTouchY - touch.clientY;

            if ((deltaY > 0 && state.scrollProgress < 1) ||
                (deltaY < 0 && state.scrollProgress > 0)) {
                state.virtualScroll += deltaY * 2;
                updateVirtualScroll();
            }

            state.lastTouchY = touch.clientY;
        }
    }

    function updateVirtualScroll() {
        // Clamp virtual scroll
        state.virtualScroll = Math.max(0, Math.min(config.scrollDistance, state.virtualScroll));

        // Calculate progress
        state.scrollProgress = state.virtualScroll / config.scrollDistance;

        requestAnimationUpdate();
    }

    function requestAnimationUpdate() {
        if (!state.ticking) {
            window.requestAnimationFrame(() => {
                applyTitleTransforms(state.scrollProgress);
                state.ticking = false;
            });
            state.ticking = true;
        }
    }

    // ========================================
    // APPLY TITLE TRANSFORMS
    // ========================================
    function applyTitleTransforms(progress) {
        // Clamp progress between 0 and 1
        progress = Math.max(0, Math.min(1, progress));

        // Calculate translateX values
        // Top title: from -120% to 0%
        const topTranslateX = -120 + (120 * progress);
        // Bottom title: from 120% to 0%
        const bottomTranslateX = 120 - (120 * progress);

        // Calculate opacity - fade in as animation progresses
        const opacity = progress;

        // Apply transforms
        if (state.titleTop) {
            state.titleTop.style.transform = `translateX(${topTranslateX}%)`;
            state.titleTop.style.opacity = opacity;
        }

        if (state.titleBottom) {
            state.titleBottom.style.transform = `translateX(${bottomTranslateX}%)`;
            state.titleBottom.style.opacity = opacity;
        }
    }

    // ========================================
    // START
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

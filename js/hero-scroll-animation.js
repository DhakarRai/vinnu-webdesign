/* ========================================
   HERO IMAGE SCROLL ANIMATION - STICKY + BI-DIRECTIONAL
   Prevents page scroll, allows reversible animation
   ======================================== */

(function () {
    'use strict';

    // ========================================
    // STATE
    // ========================================
    const state = {
        heroSection: null,
        canvasWrapper: null,
        signatureOverlay: null,
        revealCanvas: null,
        ticking: false,
        scrollProgress: 0,
        virtualScroll: 0,  // Track virtual scroll (can go up and down)
        animationComplete: false,
        lastTouchY: null
    };

    // ========================================
    // CONFIGURATION
    // ========================================
    const config = {
        // Scroll distance (in pixels) for full animation
        scrollDistance: 800,
        // Scale transformation: from 1.0 to 0.6
        scaleStart: 1.0,
        scaleEnd: 0.6,
        // Grayscale filter: from 0% to 85%
        grayscaleStart: 0,
        grayscaleEnd: 85,
        // Signature opacity: from 0 to 1
        signatureOpacityStart: 0,
        signatureOpacityEnd: 1,
        // Signature scale: from 0.8 to 1
        signatureScaleStart: 0.8,
        signatureScaleEnd: 1.0
    };

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        // Get DOM elements
        state.heroSection = document.querySelector('.hero-section');
        state.canvasWrapper = document.querySelector('.canvas-wrapper');
        state.signatureOverlay = document.querySelector('.signature-overlay');
        state.revealCanvas = document.getElementById('revealCanvas');

        // Check if elements exist
        if (!state.heroSection || !state.canvasWrapper || !state.signatureOverlay) {
            console.warn('Hero scroll animation: Required elements not found');
            return;
        }

        // Set up scroll lock listener
        setupScrollLockListener();

        // Initial state
        applyAnimations();
    }

    // ========================================
    // SCROLL LOCK LISTENER (BI-DIRECTIONAL)
    // ========================================
    function setupScrollLockListener() {
        // Intercept wheel events (mouse scroll)
        window.addEventListener('wheel', onWheel, { passive: false });

        // Intercept touch events (mobile) - touchstart is passive for better performance
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: false });
    }

    function onWheel(e) {
        const scrollY = window.scrollY;

        // Logic for Sticky Start / End
        // We only intervene if we are at the top of the page (or close enough)
        if (scrollY < 5) {
            const deltaY = e.deltaY;

            // SCROLL DOWN
            if (deltaY > 0) {
                // If animation NOT complete, stick and animate
                if (state.scrollProgress < 1) {
                    if (e.cancelable) e.preventDefault();
                    state.virtualScroll += deltaY;
                    updateVirtualScroll();
                }
                // If animation IS complete (progress >= 1), do nothing.
                // This allows the default scroll behavior to take over and scroll the page down.
            }
            // SCROLL UP
            else if (deltaY < 0) {
                // If animation is active (progress > 0), stick and reverse animate
                if (state.scrollProgress > 0) {
                    if (e.cancelable) e.preventDefault();
                    state.virtualScroll += deltaY;
                    updateVirtualScroll();
                }
                // If animation is at start (progress <= 0), do nothing.
            }
        }
    }

    function onTouchStart(e) {
        // Don't preventDefault - let it be passive for better scroll performance
        if (e.touches.length > 0) {
            state.lastTouchY = e.touches[0].clientY;
        }
    }

    function onTouchMove(e) {
        const scrollY = window.scrollY;

        if (scrollY < 5 && state.lastTouchY !== null) {
            const touch = e.touches[0];
            const deltaY = state.lastTouchY - touch.clientY; // Positive for spread/scroll down

            // SCROLL DOWN
            if (deltaY > 0) {
                if (state.scrollProgress < 1) {
                    if (e.cancelable) e.preventDefault();
                    state.virtualScroll += deltaY * 2; // Sensitivity
                    updateVirtualScroll();
                }
            }
            // SCROLL UP
            else if (deltaY < 0) {
                if (state.scrollProgress > 0) {
                    if (e.cancelable) e.preventDefault();
                    state.virtualScroll += deltaY * 2;
                    updateVirtualScroll();
                }
            }

            state.lastTouchY = touch.clientY;
        }
    }

    function updateVirtualScroll() {
        // Clamp virtual scroll
        state.virtualScroll = Math.max(0, Math.min(config.scrollDistance, state.virtualScroll));

        // Calculate progress
        state.scrollProgress = state.virtualScroll / config.scrollDistance;

        // We removed explicit 'animationComplete' flag reliance for locking logic 
        // because we check progress < 1 dynamically now.

        requestAnimationUpdate();
    }

    function requestAnimationUpdate() {
        if (!state.ticking) {
            window.requestAnimationFrame(() => {
                applyAnimations();
                state.ticking = false;
            });
            state.ticking = true;
        }
    }

    // ========================================
    // APPLY ANIMATIONS
    // ========================================
    function applyAnimations() {
        const progress = state.scrollProgress;

        // Calculate values based on progress
        const scale = lerp(config.scaleStart, config.scaleEnd, progress);
        const grayscale = lerp(config.grayscaleStart, config.grayscaleEnd, progress);
        const signatureOpacity = lerp(config.signatureOpacityStart, config.signatureOpacityEnd, progress);
        const signatureScale = lerp(config.signatureScaleStart, config.signatureScaleEnd, progress);
        const canvasOpacity = 1 - progress;

        // Apply scale to canvas wrapper
        if (state.canvasWrapper) {
            state.canvasWrapper.style.transform = `scale(${scale})`;
        }

        // Apply grayscale filter ONLY to canvas and hero-background
        // NOT to wrapper, so signature stays bright green!
        if (state.revealCanvas) {
            state.revealCanvas.style.filter = `grayscale(${grayscale}%)`;
            state.revealCanvas.style.opacity = canvasOpacity;
        }

        // Apply grayscale to hero-background
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.filter = `grayscale(${grayscale}%)`;
        }

        // Apply signature overlay animation
        if (state.signatureOverlay) {
            state.signatureOverlay.style.opacity = signatureOpacity;
            state.signatureOverlay.style.transform = `scale(${signatureScale})`;
        }
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================

    // Linear interpolation
    function lerp(start, end, progress) {
        return start + (end - start) * progress;
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

/* ========================================
   ULTRA-SMOOTH LIQUID REVEAL SYSTEM
   SILK-LIKE TRANSITIONS WITH SPLASH EFFECT
   ======================================== */

(function () {
    'use strict';

    // ========================================
    // CONFIGURATION
    // ========================================
    const CONFIG = {
        coverImage: '../images/cover-artistic.jpg',
        realImage: '../images/hero-photo.jpg',

        // Smoothness settings - reduced for mobile
        // Smoothness settings - reduced for mobile
        baseRadius: /Mobi|Android/i.test(navigator.userAgent) ? 70 : 110, // Increased slightly for "strength"
        maxRadius: /Mobi|Android/i.test(navigator.userAgent) ? 100 : 150,
        rippleRadius: /Mobi|Android/i.test(navigator.userAgent) ? 130 : 220,

        // Trail and fade settings - INCREASED SIGNIFICANTLY for "strength"
        maxTrailPoints: /Mobi|Android/i.test(navigator.userAgent) ? 40 : 80, // Was 6/12 - now much longer trail
        fadeDuration: 0.15, // Slower fade = persists longer

        // Quality - balanced for mobile (1.5x max) vs quality (2x max for desktop)

        // Quality - balanced for mobile (1.5x max) vs quality (2x max for desktop)
        canvasQuality: /Mobi|Android/i.test(navigator.userAgent)
            ? Math.min(window.devicePixelRatio || 1, 1.5)
            : Math.min(window.devicePixelRatio || 1, 2),
        smoothingSteps: 3 // Interpolation smoothness
    };

    // ========================================
    // STATE MANAGEMENT
    // ========================================
    const state = {
        canvas: null,
        ctx: null,
        offscreenCanvas: null,  // For creating the mask
        offscreenCtx: null,
        coverImg: null,
        realImg: null,
        isRevealing: false,

        // Cached image dimensions (prevents size changes)
        cachedImageDimensions: null,

        // Smooth position tracking
        currentX: null,
        currentY: null,
        targetX: null,
        targetY: null,

        // Trail system with alpha and size
        trailPoints: [],

        // Ripple effect on touch
        ripples: [],

        // Sparkle particles
        sparkles: [],

        imagesLoaded: 0,
        instructionOverlay: null,
        animationFrame: null,
        lastFrameTime: 0,

        // Performance: pause animation when idle
        isIdle: false
    };

    // ... (rest of the file) ...

    function updateAnimation(deltaTime) {
        // ... (existing update logic) ...

        // Update ripples
        state.ripples = state.ripples.map(ripple => {
            ripple.age += deltaTime;
            const progress = ripple.age / ripple.duration;

            ripple.radius = ripple.startRadius + (ripple.endRadius - ripple.startRadius) * progress;
            ripple.alpha = Math.max(0, 1 - Math.pow(progress, 0.8)); // Smooth fade

            return ripple;
        }).filter(ripple => ripple.alpha > 0.01);

        // Update sparkles
        state.sparkles = state.sparkles.map(sparkle => {
            sparkle.x += sparkle.vx;
            sparkle.y += sparkle.vy;
            sparkle.alpha -= sparkle.decay;
            sparkle.rotation += sparkle.rotSpeed;
            return sparkle;
        }).filter(sparkle => sparkle.alpha > 0.01);
    }

    // ... (rest of the file) ...

    function drawScene() {
        // ... (existing draw logic) ...

        // STEP 2: Draw cover layer on top (with touch reveals creating holes)
        // ...

        if (state.trailPoints.length > 0 || state.ripples.length > 0) {
            // ... (existing masking logic) ...

            // Draw sparkles on top of everything
            state.ctx.globalCompositeOperation = 'screen';
            state.sparkles.forEach(sparkle => {
                drawSparkle(state.ctx, sparkle);
            });

        } else {
            // ...
        }

        // Restore context state
        state.ctx.restore();
    }

    // ...

    // ========================================
    // SPARKLE EFFECT
    // ========================================
    function createSparkles(x, y) {
        // Create 3-5 sparkles per event
        const count = 3 + Math.floor(Math.random() * 3);

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 4;

            state.sparkles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 4,
                alpha: 1.0,
                decay: 0.02 + Math.random() * 0.03,
                rotation: Math.random() * Math.PI,
                rotSpeed: (Math.random() - 0.5) * 0.2,
                color: Math.random() > 0.3 ? '#D4AF37' : '#FFFFFF' // Mostly Gold, some White
            });
        }
    }

    function drawSparkle(ctx, sparkle) {
        ctx.save();
        ctx.translate(sparkle.x, sparkle.y);
        ctx.rotate(sparkle.rotation);
        ctx.globalAlpha = sparkle.alpha;
        ctx.fillStyle = sparkle.color;

        // Draw a diamond shape (star)
        ctx.beginPath();
        ctx.moveTo(0, -sparkle.size);
        ctx.lineTo(sparkle.size * 0.3, 0);
        ctx.lineTo(0, sparkle.size);
        ctx.lineTo(-sparkle.size * 0.3, 0);
        ctx.closePath();
        ctx.fill();

        // Cross shine
        ctx.beginPath();
        ctx.moveTo(0, -sparkle.size * 1.5);
        ctx.lineTo(0.5, 0);
        ctx.lineTo(0, sparkle.size * 1.5);
        ctx.lineTo(-0.5, 0);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-sparkle.size * 1.5, 0);
        ctx.lineTo(0, 0.5);
        ctx.lineTo(sparkle.size * 1.5, 0);
        ctx.lineTo(0, -0.5);
        ctx.fill();

        ctx.restore();
    }

    // ========================================
    // RIPPLE EFFECT
    // ========================================
    function createRipple(x, y) {
        // ... (existing)
        state.ripples.push({ /* ... */ });

        // Also trigger sparkles
        createSparkles(x, y);
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    function init() {
        state.canvas = document.getElementById('revealCanvas');
        state.instructionOverlay = document.getElementById('instructionOverlay');

        if (!state.canvas || !state.instructionOverlay) {
            console.error('Canvas or instruction overlay not found');
            return;
        }

        state.ctx = state.canvas.getContext('2d', {
            willReadFrequently: false,
            alpha: true
        });

        loadImages();
        setupEventListeners();
        preventPageZoom();

        preventPageZoom();

        // Removed auto-hide on scroll to keep "Touch to reveal" visible until interaction
        window.addEventListener('resize', debounce(handleResize, 250));
    }

    // ========================================
    // IMAGE LOADING
    // ========================================
    function loadImages() {
        state.coverImg = new Image();
        state.realImg = new Image();

        state.coverImg.onload = handleImageLoad;
        state.realImg.onload = handleImageLoad;

        state.coverImg.onerror = () => handleImageError('cover');
        state.realImg.onerror = () => handleImageError('real');

        state.coverImg.src = CONFIG.coverImage;
        state.realImg.src = CONFIG.realImage;
    }

    function handleImageLoad() {
        state.imagesLoaded++;

        if (state.imagesLoaded === 2) {
            setupCanvas();

            // Initial draw to ensure cover is visible
            drawScene();

            // Now reveal the hero background (it's behind the cover)
            const heroBg = document.querySelector('.hero-background');
            if (heroBg) {
                // Small delay to ensure canvas paint is registered
                requestAnimationFrame(() => {
                    heroBg.classList.add('ready');
                });
            }

            startRenderLoop();
        }
    }

    function handleImageError(type) {
        console.error(`Failed to load ${type} image`);
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        if (type === 'cover') {
            const gradient = ctx.createLinearGradient(0, 0, 600, 800);
            gradient.addColorStop(0, '#E6E6FA');
            gradient.addColorStop(0.5, '#FFF5EC');
            gradient.addColorStop(1, '#F4E4C1');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 600, 800);

            ctx.fillStyle = '#D4AF37';
            ctx.font = 'bold 48px "Noto Sans Telugu"';
            ctx.textAlign = 'center';
            ctx.fillText('✦', 300, 400);

            state.coverImg.src = canvas.toDataURL();
        } else {
            ctx.fillStyle = '#FFF5EC';
            ctx.fillRect(0, 0, 600, 800);

            ctx.fillStyle = '#C71585';
            ctx.font = 'bold 32px "Noto Sans Telugu"';
            ctx.textAlign = 'center';
            ctx.fillText('సౌమ్య', 300, 400);

            state.realImg.src = canvas.toDataURL();
        }
    }

    // ========================================
    // CANVAS SETUP
    // ========================================
    function setupCanvas() {
        const wrapper = state.canvas.parentElement;
        // Use getBoundingClientRect for accurate rendered dimensions
        const rect = wrapper.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Set internal canvas resolution (scaled for quality)
        state.canvas.width = width * CONFIG.canvasQuality;
        state.canvas.height = height * CONFIG.canvasQuality;

        // DO NOT set inline styles - let CSS handle display size (100%)
        // This prevents conflicts between CSS and JavaScript sizing

        // Reset transform and apply scaling ONCE
        state.ctx.setTransform(1, 0, 0, 1, 0, 0);
        state.ctx.scale(CONFIG.canvasQuality, CONFIG.canvasQuality);

        // Enable anti-aliasing for ultra-smooth edges
        state.ctx.imageSmoothingEnabled = true;
        state.ctx.imageSmoothingQuality = 'high';

        // Create/recreate offscreen canvas for masking
        state.offscreenCanvas = document.createElement('canvas');
        state.offscreenCanvas.width = state.canvas.width;
        state.offscreenCanvas.height = state.canvas.height;
        state.offscreenCtx = state.offscreenCanvas.getContext('2d', { alpha: true });

        // Reset and apply scaling ONCE
        state.offscreenCtx.setTransform(1, 0, 0, 1, 0, 0);
        state.offscreenCtx.scale(CONFIG.canvasQuality, CONFIG.canvasQuality);
        state.offscreenCtx.imageSmoothingEnabled = true;
        state.offscreenCtx.imageSmoothingQuality = 'high';

        // Clear cached dimensions on resize
        state.cachedImageDimensions = null;
    }

    // ========================================
    // SMOOTH ANIMATION LOOP
    // ========================================
    function startRenderLoop() {
        function render(timestamp) {
            // Performance optimization: Stop loop if idle
            if (!state.isRevealing && state.trailPoints.length === 0 && state.ripples.length === 0 && state.sparkles.length === 0) {
                state.isIdle = true;
                return; // Exit loop - will resume when interaction starts
            }
            state.isIdle = false;

            const deltaTime = timestamp - state.lastFrameTime;
            state.lastFrameTime = timestamp;

            updateAnimation(deltaTime);
            drawScene();

            state.animationFrame = requestAnimationFrame(render);
        }
        state.animationFrame = requestAnimationFrame(render);
    }

    // Resume loop when interaction starts (after being paused)
    function resumeRenderLoop() {
        if (state.isIdle) {
            state.isIdle = false;
            state.lastFrameTime = performance.now();
            startRenderLoop();
        }
    }

    function updateAnimation(deltaTime) {
        // Smooth position interpolation (easing)
        if (state.targetX !== null && state.targetY !== null) {
            const ease = 0.25; // Smoothness factor

            if (state.currentX === null) {
                state.currentX = state.targetX;
                state.currentY = state.targetY;
            } else {
                const dx = state.targetX - state.currentX;
                const dy = state.targetY - state.currentY;
                const distance = Math.hypot(dx, dy);

                // Snap to target if very close (prevents micro-jitter when still)
                if (distance < 0.5) {
                    state.currentX = state.targetX;
                    state.currentY = state.targetY;
                } else {
                    state.currentX += dx * ease;
                    state.currentY += dy * ease;
                }
            }
        }

        // Update trail points
        if (state.isRevealing && state.currentX !== null && state.currentY !== null) {
            const lastPoint = state.trailPoints[state.trailPoints.length - 1];

            // Add new trail point only if moved enough
            if (!lastPoint ||
                Math.hypot(state.currentX - lastPoint.x, state.currentY - lastPoint.y) > 8) {

                state.trailPoints.push({
                    x: state.currentX,
                    y: state.currentY,
                    alpha: 1.0,
                    radius: CONFIG.baseRadius,
                    age: 0
                });

                if (state.trailPoints.length > CONFIG.maxTrailPoints) {
                    state.trailPoints.shift();
                }
            }
        }

        // Smooth fade-out with exponential decay
        state.trailPoints = state.trailPoints.map((point, index) => {
            point.age += deltaTime;

            // Keep the most recent point stable when hovering (prevents flicker)
            const isNewestPoint = index === state.trailPoints.length - 1;

            // Check if hovering with small tolerance (exact equality too strict)
            const distanceToTarget = state.isRevealing && state.currentX !== null && state.targetX !== null
                ? Math.hypot(state.currentX - state.targetX, state.currentY - state.targetY)
                : Infinity;
            const isStillHovering = distanceToTarget < 1.0;

            if (isNewestPoint && isStillHovering) {
                // Keep full alpha for stable hover reveal
                point.alpha = 1.0;
                point.radius = CONFIG.baseRadius;
            } else {
                // Exponential fade (smoother than linear)
                const fadeProgress = point.age / 2500; // Lasts 2.5 seconds now (was 0.5s)
                point.alpha = Math.max(0, 1 - Math.pow(fadeProgress * 2, 1.5));

                // Slight radius expansion as it fades
                point.radius = CONFIG.baseRadius + (CONFIG.maxRadius - CONFIG.baseRadius) * (1 - point.alpha);
            }

            return point;
        }).filter(point => point.alpha > 0.01);

        // Update sparkles
        state.sparkles = state.sparkles.map(sparkle => {
            sparkle.x += sparkle.vx;
            sparkle.y += sparkle.vy;
            sparkle.alpha -= sparkle.decay;
            sparkle.rotation += sparkle.rotSpeed;
            return sparkle;
        }).filter(sparkle => sparkle.alpha > 0.01);

        // Update ripples
        state.ripples = state.ripples.map(ripple => {
            ripple.age += deltaTime;
            const progress = ripple.age / ripple.duration;

            ripple.radius = ripple.startRadius + (ripple.endRadius - ripple.startRadius) * progress;
            ripple.alpha = Math.max(0, 1 - Math.pow(progress, 0.8)); // Smooth fade

            return ripple;
        }).filter(ripple => ripple.alpha > 0.01);
    }

    // ========================================
    // ULTRA-SMOOTH RENDERING
    // ========================================
    function drawScene() {
        const width = state.canvas.width / CONFIG.canvasQuality;
        const height = state.canvas.height / CONFIG.canvasQuality;

        // Save context state
        state.ctx.save();

        // Clear main canvas
        state.ctx.clearRect(0, 0, width, height);

        // STEP 1: ALWAYS draw hero photo as the base layer (this is what gets revealed)
        state.ctx.globalCompositeOperation = 'source-over';
        drawImageCover(state.ctx, state.realImg, width, height);

        // STEP 2: Draw cover layer on top (with touch reveals creating holes)
        // When user touches/hovers, the cover gets holes punched in it, revealing hero photo below

        if (state.trailPoints.length > 0 || state.ripples.length > 0) {
            // User is interacting - create masked cover with reveals
            state.offscreenCtx.save();
            state.offscreenCtx.clearRect(0, 0, width, height);

            // Draw cover image on offscreen canvas
            state.offscreenCtx.globalCompositeOperation = 'source-over';
            drawImageCover(state.offscreenCtx, state.coverImg, width, height);

            // Cut holes in the cover using destination-out
            state.offscreenCtx.globalCompositeOperation = 'destination-out';

            // Draw ripple reveals (creates transparent holes)
            state.ripples.forEach(ripple => {
                drawRipple(state.offscreenCtx, ripple);
            });

            // Draw trail reveals (creates transparent holes)
            state.trailPoints.forEach((point, index) => {
                drawSmoothReveal(state.offscreenCtx, point, index);
            });

            state.offscreenCtx.restore();

            // Composite the masked cover onto the main canvas
            state.ctx.save();
            state.ctx.setTransform(1, 0, 0, 1, 0, 0);
            state.ctx.globalCompositeOperation = 'source-over';
            state.ctx.drawImage(state.offscreenCanvas, 0, 0);
            state.ctx.restore();

            // Restore the scale for glow effects
            state.ctx.setTransform(1, 0, 0, 1, 0, 0);
            state.ctx.scale(CONFIG.canvasQuality, CONFIG.canvasQuality);

            // Add glow effects on top
            state.ctx.globalCompositeOperation = 'screen';
            state.trailPoints.forEach(point => {
                drawGoldenGlow(point);
            });

            // Draw sparkles on top of everything
            state.ctx.globalCompositeOperation = 'screen';
            state.sparkles.forEach(sparkle => {
                drawSparkle(state.ctx, sparkle);
            });

        } else {
            // No interaction - just draw full cover over hero photo
            state.ctx.globalCompositeOperation = 'source-over';
            drawImageCover(state.ctx, state.coverImg, width, height);
        }

        // Restore context state
        state.ctx.restore();
    }

    function drawImageCover(ctx, img, canvasWidth, canvasHeight) {
        // Create cache key based on logical canvas dimensions
        const cacheKey = `${canvasWidth}_${canvasHeight}`;

        // Use cached dimensions if available AND canvas size hasn't changed
        if (!state.cachedImageDimensions || state.cachedImageDimensions.key !== cacheKey) {
            const imgRatio = img.width / img.height;
            const canvasRatio = canvasWidth / canvasHeight;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (imgRatio > canvasRatio) {
                drawHeight = canvasHeight;
                drawWidth = drawHeight * imgRatio;
                offsetX = (canvasWidth - drawWidth) / 2;
                offsetY = 0;
            } else {
                drawWidth = canvasWidth;
                drawHeight = drawWidth / imgRatio;
                offsetX = 0;
                offsetY = (canvasHeight - drawHeight) / 2;
            }

            // Cache these dimensions with validation key
            state.cachedImageDimensions = {
                key: cacheKey,
                drawWidth,
                drawHeight,
                offsetX,
                offsetY
            };
        }

        const { drawWidth, drawHeight, offsetX, offsetY } = state.cachedImageDimensions;
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    function drawSmoothReveal(ctx, point, index) {
        // Optimized single-layer gradient for better mobile performance
        const { x, y, alpha, radius } = point;

        // Single optimized gradient (was 3 layers before)
        const gradient = ctx.createRadialGradient(
            x, y, 0,
            x, y, radius * 1.5
        );
        gradient.addColorStop(0, `rgba(0, 0, 0, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(0, 0, 0, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    function drawGoldenGlow(point) {
        const { x, y, alpha, radius } = point;

        state.ctx.globalCompositeOperation = 'screen';

        const glowGradient = state.ctx.createRadialGradient(
            x, y, radius * 0.7,
            x, y, radius * 1.4
        );

        glowGradient.addColorStop(0, `rgba(255, 215, 0, 0)`);
        glowGradient.addColorStop(0.4, `rgba(255, 215, 0, ${alpha * 0.15})`);
        glowGradient.addColorStop(0.7, `rgba(212, 175, 55, ${alpha * 0.1})`);
        glowGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        state.ctx.fillStyle = glowGradient;
        state.ctx.beginPath();
        state.ctx.arc(x, y, radius * 1.4, 0, Math.PI * 2);
        state.ctx.fill();
    }

    function drawRipple(ctx, ripple) {
        const { x, y, radius, alpha } = ripple;

        // Expanding ring effect
        const gradient = ctx.createRadialGradient(
            x, y, radius * 0.8,
            x, y, radius
        );

        gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
        gradient.addColorStop(0.5, `rgba(0, 0, 0, ${alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================
    function setupEventListeners() {
        state.canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        state.canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        state.canvas.addEventListener('touchend', handleTouchEnd);
        state.canvas.addEventListener('touchcancel', handleTouchEnd);

        state.canvas.addEventListener('mouseenter', handleMouseEnter);
        state.canvas.addEventListener('mousemove', handleMouseMove);
        state.canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    // ========================================
    // PREVENT PAGE ZOOM (UNIQUE NAMESPACE)
    // ========================================
    function preventPageZoom() {
        // Prevent double-tap zoom on the entire document
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (e) {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
            lastTouchEnd = now;
        }, { passive: false });

        // Prevent pinch-zoom gesture
        document.addEventListener('gesturestart', function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }, { passive: false });

        document.addEventListener('gesturechange', function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }, { passive: false });

        document.addEventListener('gestureend', function (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }, { passive: false });

        // Prevent multi-touch zoom
        document.addEventListener('touchstart', function (e) {
            if (e.touches.length > 1) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }, { passive: false });

        document.addEventListener('touchmove', function (e) {
            if (e.touches.length > 1) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        }, { passive: false });
    }

    // ========================================
    // TOUCH HANDLERS
    // ========================================
    function handleTouchStart(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        state.isRevealing = true;
        resumeRenderLoop(); // Resume animation if paused
        hideInstruction();

        const touch = e.touches[0];
        const pos = getTouchPosition(touch);

        state.targetX = pos.x;
        state.targetY = pos.y;

        // Create splash ripple
        createRipple(pos.x, pos.y);
    }

    function handleTouchMove(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (!state.isRevealing) return;

        const touch = e.touches[0];
        const pos = getTouchPosition(touch);

        state.targetX = pos.x;
        state.targetY = pos.y;
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        state.isRevealing = false;
        state.targetX = null;
        state.targetY = null;
    }

    function getTouchPosition(touch) {
        const rect = state.canvas.getBoundingClientRect();
        return {
            x: (touch.clientX - rect.left),
            y: (touch.clientY - rect.top)
        };
    }

    // ========================================
    // MOUSE HANDLERS
    // ========================================
    function handleMouseEnter(e) {
        state.isRevealing = true;
        resumeRenderLoop(); // Resume animation if paused
        hideInstruction();

        const pos = getMousePosition(e);
        state.targetX = pos.x;
        state.targetY = pos.y;

        createRipple(pos.x, pos.y);
    }

    function handleMouseMove(e) {
        if (!state.isRevealing) {
            state.isRevealing = true;
            resumeRenderLoop(); // Resume animation if paused
            hideInstruction();
        }

        const pos = getMousePosition(e);
        state.targetX = pos.x;
        state.targetY = pos.y;
    }

    function handleMouseLeave() {
        state.isRevealing = false;
        state.targetX = null;
        state.targetY = null;
    }

    function getMousePosition(e) {
        const rect = state.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    // ========================================
    // SPARKLE EFFECT
    // ========================================
    function createSparkles(x, y) {
        // Create 3-5 sparkles per event
        const count = 3 + Math.floor(Math.random() * 3);

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 4;

            state.sparkles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 2 + Math.random() * 4,
                alpha: 1.0,
                decay: 0.02 + Math.random() * 0.03,
                rotation: Math.random() * Math.PI,
                rotSpeed: (Math.random() - 0.5) * 0.2,
                color: Math.random() > 0.3 ? '#D4AF37' : '#FFFFFF' // Mostly Gold, some White
            });
        }
    }

    function drawSparkle(ctx, sparkle) {
        ctx.save();
        ctx.translate(sparkle.x, sparkle.y);
        ctx.rotate(sparkle.rotation);
        ctx.globalAlpha = sparkle.alpha;
        ctx.fillStyle = sparkle.color;

        // Draw a diamond shape (star)
        ctx.beginPath();
        ctx.moveTo(0, -sparkle.size);
        ctx.lineTo(sparkle.size * 0.3, 0);
        ctx.lineTo(0, sparkle.size);
        ctx.lineTo(-sparkle.size * 0.3, 0);
        ctx.closePath();
        ctx.fill();

        // Cross shine
        ctx.beginPath();
        ctx.moveTo(0, -sparkle.size * 1.5);
        ctx.lineTo(0.5, 0);
        ctx.lineTo(0, sparkle.size * 1.5);
        ctx.lineTo(-0.5, 0);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-sparkle.size * 1.5, 0);
        ctx.lineTo(0, 0.5);
        ctx.lineTo(sparkle.size * 1.5, 0);
        ctx.lineTo(0, -0.5);
        ctx.fill();

        ctx.restore();
    }

    // ========================================
    // RIPPLE EFFECT
    // ========================================
    function createRipple(x, y) {
        state.ripples.push({
            x: x,
            y: y,
            startRadius: 20,
            endRadius: CONFIG.rippleRadius,
            radius: 20,
            alpha: 1.0,
            age: 0,
            duration: 800 // milliseconds
        });

        // Also trigger sparkles
        createSparkles(x, y);
    }

    // ========================================
    // INSTRUCTION OVERLAY
    // ========================================
    function hideInstruction() {
        if (state.instructionOverlay && !state.instructionOverlay.classList.contains('hidden')) {
            state.instructionOverlay.classList.add('hidden');

            setTimeout(() => {
                if (state.instructionOverlay && state.instructionOverlay.parentElement) {
                    state.instructionOverlay.remove();
                }
            }, 500);
        }
    }

    // ========================================
    // WINDOW RESIZE
    // ========================================
    function handleResize() {
        if (state.imagesLoaded === 2) {
            setupCanvas();
            state.trailPoints = [];
            state.ripples = [];
        }
    }

    // ========================================
    // UTILITIES
    // ========================================
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

    // ========================================
    // CLEANUP
    // ========================================
    window.addEventListener('beforeunload', () => {
        if (state.animationFrame) {
            cancelAnimationFrame(state.animationFrame);
        }
    });

    // ========================================
    // START
    // ========================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

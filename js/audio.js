document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById('bgMusic');

    // Set volume to a pleasant background level
    audio.volume = 0.5;

    // Function to attempt playback
    const playMusic = () => {
        audio.play().then(() => {
            // Success - remove listeners
            document.removeEventListener('click', playMusic);
            document.removeEventListener('touchstart', playMusic);
            document.removeEventListener('scroll', playMusic);
            console.log("Background music started.");
        }).catch(err => {
            // Auto-play was prevented
            console.log("Audio playback waiting for interaction");
        });
    };

    // Try to play immediately on load (Browser might block this)
    playMusic();

    // Add listeners with capture: true to ensure we catch them before other scripts (like the canvas) stop propagation
    const options = { capture: true, once: false, passive: true };
    const aggressiveOptions = { capture: true, once: false, passive: false };

    document.addEventListener('click', playMusic, options);
    document.addEventListener('touchstart', playMusic, options);
    document.addEventListener('scroll', playMusic, options);
    document.addEventListener('wheel', playMusic, options); // Catches mouse wheel scrolling
    document.addEventListener('mousedown', playMusic, options);
    document.addEventListener('mousemove', playMusic, options);
    document.addEventListener('keydown', playMusic, options); // Catches keyboard interaction
});

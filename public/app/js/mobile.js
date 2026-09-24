// Independent from map/auth/CDN scripts: opening the app must never depend on them.
(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) splash.remove();

    const viewport = window.visualViewport;
    const updateViewport = () => {
        if (!viewport || viewport.scale !== 1) return;
        document.documentElement.style.setProperty('--mobile-height', `${viewport.height}px`);
        document.documentElement.style.setProperty('--mobile-top', `${viewport.offsetTop}px`);
    };
    updateViewport();
    viewport?.addEventListener('resize', updateViewport);
    viewport?.addEventListener('scroll', updateViewport);
})();

(() => {
    const gallery = document.getElementById('life-gallery');
    if (!gallery) return;

    const photos = Array.from(gallery.querySelectorAll('img'));
    const pagination = document.querySelector('.gallery-pagination');
    const previous = pagination.querySelector('.gallery-previous');
    const next = pagination.querySelector('.gallery-next');
    const status = document.querySelector('.gallery-status');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pageSize = 6;
    const pageCount = Math.ceil(photos.length / pageSize);
    let currentPage = 1;
    let transitioning = false;

    function showPage(page) {
        currentPage = page;
        const start = (page - 1) * pageSize;
        photos.forEach((photo, index) => {
            photo.hidden = index < start || index >= start + pageSize;
        });
        previous.disabled = page === 1;
        next.disabled = page === pageCount;
        status.textContent = `Photos ${start + 1}-${Math.min(start + pageSize, photos.length)} of ${photos.length}. Page ${page} of ${pageCount}.`;
        if (document.activeElement === previous && previous.disabled) next.focus();
        else if (document.activeElement === next && next.disabled) previous.focus();
    }

    async function animatePage(frames, duration) {
        if (reducedMotion.matches || !gallery.animate) return;
        const animation = gallery.animate(frames, {
            duration,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            fill: 'forwards'
        });
        try {
            await animation.finished;
        } catch {
            // A cancelled animation should never leave navigation locked.
        }
        return animation;
    }

    async function changePage(direction) {
        const target = currentPage + direction;
        if (transitioning || target < 1 || target > pageCount) return;
        transitioning = true;
        gallery.setAttribute('aria-busy', 'true');
        previous.setAttribute('aria-disabled', 'true');
        next.setAttribute('aria-disabled', 'true');
        let outgoing;
        let incoming;
        try {
            // Decode the next photos while the current page remains visible.
            const start = (target - 1) * pageSize;
            await Promise.all(photos.slice(start, start + pageSize).map(photo => {
                photo.loading = 'eager';
                return photo.decode ? photo.decode().catch(() => {}) : Promise.resolve();
            }));
            outgoing = await animatePage([
                { opacity: 1, transform: 'translateX(0)' },
                { opacity: 0, transform: `translateX(${-direction * 12}px)` }
            ], 150);
            showPage(target);
            outgoing?.cancel();
            incoming = await animatePage([
                { opacity: 0, transform: `translateX(${direction * 12}px)` },
                { opacity: 1, transform: 'translateX(0)' }
            ], 260);
        } finally {
            outgoing?.cancel();
            incoming?.cancel();
            transitioning = false;
            gallery.removeAttribute('aria-busy');
            previous.removeAttribute('aria-disabled');
            next.removeAttribute('aria-disabled');
        }
    }

    if (photos.length) {
        gallery.classList.add('is-paginated');
        previous.addEventListener('click', () => changePage(-1));
        next.addEventListener('click', () => changePage(1));
        showPage(1);
        pagination.hidden = pageCount <= 1;
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initActiveNavLinks();
    initProjectModals();
});

function initTheme() {
    const savedTheme = localStorage.getItem('cynthia_theme') || 'dark';
    applyTheme(savedTheme);

    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(nextTheme);
            localStorage.setItem('cynthia_theme', nextTheme);
            showToast(`Switched to ${nextTheme} mode`, 'info');
        });
    });
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    updateThemeIcons(theme);
}

function updateThemeIcons(theme) {
    const icons = document.querySelectorAll('.theme-toggle-btn i');
    icons.forEach(icon => {
        if (theme === 'light') {
            icon.className = 'fa-solid fa-moon';
        } else {
            icon.className = 'fa-solid fa-sun';
        }
    });
}

function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navMenu.classList.contains('open');
        if (isOpen) {
            closeMobileNav(toggleBtn, navMenu);
        } else {
            openMobileNav(toggleBtn, navMenu);
        }
    });

    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileNav(toggleBtn, navMenu);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            closeMobileNav(toggleBtn, navMenu);
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && navMenu.classList.contains('open')) {
            closeMobileNav(toggleBtn, navMenu);
        }
    });
}

function openMobileNav(btn, menu) {
    menu.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    document.body.style.overflow = 'hidden';
}

function closeMobileNav(btn, menu) {
    menu.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.body.style.overflow = '';
}

function initActiveNavLinks() {
    const currentPath = window.location.pathname.toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href').toLowerCase();
        if (currentPath.endsWith(href) || 
            (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/index.html') || currentPath === '')) ||
            (currentPath.includes(href) && href !== 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'fa-circle-info';
    if (type === 'success') iconClass = 'fa-circle-check';
    if (type === 'error') iconClass = 'fa-circle-exclamation';

    toast.innerHTML = `
        <i class="fa-solid ${iconClass}" style="color: ${type === 'success' ? 'var(--color-success)' : (type === 'error' ? 'var(--color-danger)' : 'var(--accent-gold)')}; font-size: 1.2rem;"></i>
        <span style="font-size: 0.9rem; font-weight: 500;">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

function initProjectModals() {
    const modalBackdrop = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalTech = document.getElementById('modalTech');
    const modalAction = document.getElementById('modalAction');
    const closeBtn = document.getElementById('modalCloseBtn');

    if (!modalBackdrop) return;

    const openBtns = document.querySelectorAll('[data-project-trigger]');
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const title = btn.getAttribute('data-project-title') || 'Project Preview';
            const desc = btn.getAttribute('data-project-desc') || 'Full project overview and live simulation.';
            const tech = btn.getAttribute('data-project-tech') || 'HTML, CSS, JavaScript';
            const link = btn.getAttribute('data-project-link') || '#';

            if (modalTitle) modalTitle.textContent = title;
            if (modalDesc) modalDesc.textContent = desc;
            if (modalTech) modalTech.innerHTML = tech.split(',').map(t => `<span class="tech-tag">${t.trim()}</span>`).join(' ');
            if (modalAction) modalAction.setAttribute('href', link);

            modalBackdrop.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeModal = () => {
        modalBackdrop.classList.remove('open');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) closeModal();
    });
}

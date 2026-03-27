// Единый компонент шапки для всех страниц - ИСПРАВЛЕНО для мобильного меню
function createHeader() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const navItems = [
        { href: 'index.html', icon: 'fa-newspaper', text: 'Новости' },
        { href: 'cyberattackmap.html', icon: 'fa-map', text: 'Карта атак' },
        { href: 'glossary.html', icon: 'fa-book', text: 'Глоссарий' },
        { href: 'learn.html', icon: 'fa-graduation-cap', text: 'Учебник' },
        { href: 'about.html', icon: 'fa-info-circle', text: 'О проекте' }
    ];
    
    const navLinks = navItems.map(item => 
        `<li><a href="${item.href}" ${currentPage === item.href ? 'class="active"' : ''}><i class="fas ${item.icon}"></i> ${item.text}</a></li>`
    ).join('');
    
    const headerHTML = `
    <header class="main-header">
        <div class="container">
            <a href="index.html" class="logo">
                <i class="fas fa-shield-alt"></i>
                <h1>CyberThreat<span>Explorer</span></h1>
                <small>для начинающих</small>
            </a>
            <nav class="main-nav">
                <ul>
                    ${navLinks}
                </ul>
            </nav>
            <button class="mobile-menu-btn" aria-label="Открыть меню" aria-expanded="false">
                <i class="fas fa-bars menu-icon"></i>
            </button>
        </div>
    </header>
    `;
    
    // Удаляем старую шапку если есть
    const oldHeader = document.querySelector('header.main-header');
    if (oldHeader) {
        oldHeader.remove();
    }
    
    // Вставляем новую шапку
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    
    // Инициализируем мобильное меню с задержкой для гарантии DOM
    setTimeout(initMobileMenu, 100);
}

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    const menuIcon = document.querySelector('.menu-icon');
    
    if (!mobileMenuBtn || !mainNav) {
        console.warn('Элементы меню не найдены, повтор через 200мс');
        setTimeout(initMobileMenu, 200);
        return;
    }
    
    // Очищаем старые обработчики
    mobileMenuBtn.removeEventListener('click', handleMenuToggle);
    mobileMenuBtn.removeEventListener('touchstart', handleMenuToggle);
    
    function handleMenuToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isActive = mainNav.classList.contains('active');
        
        mainNav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', !isActive);
        
        // Меняем иконку
        if (menuIcon) {
            menuIcon.className = mainNav.classList.contains('active') 
                ? 'fas fa-times menu-icon' 
                : 'fas fa-bars menu-icon';
        }
        
        // Блокировка скролла
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        
        // Закрытие при клике вне меню
        if (!isActive) {
            document.addEventListener('click', closeMenuOnOutsideClick);
        }
    }
    
    // Добавляем обработчики
    mobileMenuBtn.addEventListener('click', handleMenuToggle);
    mobileMenuBtn.addEventListener('touchstart', handleMenuToggle, { passive: false });
    
    // Закрывать меню при клике на ссылку
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mainNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            if (menuIcon) menuIcon.className = 'fas fa-bars menu-icon';
            document.body.style.overflow = '';
            document.removeEventListener('click', closeMenuOnOutsideClick);
        });
    });
    
    function closeMenuOnOutsideClick(e) {
        if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mainNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            if (menuIcon) menuIcon.className = 'fas fa-bars menu-icon';
            document.body.style.overflow = '';
            document.removeEventListener('click', closeMenuOnOutsideClick);
        }
    }
}

// Инициализация при загрузке страницы + fallback
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createHeader);
} else {
    createHeader();
}

// Fallback для случаев когда скрипт загружается после DOM
window.addEventListener('load', () => {
    if (!document.querySelector('.main-header')) {
        createHeader();
    }
});


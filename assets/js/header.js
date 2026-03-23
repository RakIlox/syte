// Единый компонент шапки для всех страниц
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
            <button class="mobile-menu-btn"><i class="fas fa-bars"></i></button>
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
    
    // Инициализируем мобильное меню
    initMobileMenu();
}

function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Закрывать меню при клике на ссылку
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    createHeader();
});


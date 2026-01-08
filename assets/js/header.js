// Единый компонент шапки для всех страниц
function createHeader() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
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
                    <li><a href="index.html" ${currentPage === 'index.html' ? 'class="active"' : ''}><i class="fas fa-map"></i> Карта атак</a></li>
                    <li><a href="glossary.html" ${currentPage === 'glossary.html' ? 'class="active"' : ''}><i class="fas fa-book"></i> Глоссарий</a></li>
                    <li><a href="learn.html" ${currentPage === 'learn.html' ? 'class="active"' : ''}><i class="fas fa-graduation-cap"></i> Учебник</a></li>
                    <li><a href="about.html" ${currentPage === 'about.html' ? 'class="active"' : ''}><i class="fas fa-info-circle"></i> О проекте</a></li>
                </ul>
            </nav>
            <button class="mobile-menu-btn"><i class="fas fa-bars"></i></button>
        </div>
    </header>
    `;
    
    // Находим тег body и вставляем header в начало
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

// Функция для замены старой шапки на новую единую
function replaceOldHeader() {
    const oldHeader = document.querySelector('header.main-header');
    if (oldHeader) {
        oldHeader.remove();
    }
    
    const logoDiv = document.querySelector('.main-header .container > div.logo');
    if (logoDiv) {
        logoDiv.parentElement.parentElement.querySelector('.main-nav')?.remove();
        logoDiv.parentElement.parentElement.querySelector('.mobile-menu-btn')?.remove();
        logoDiv.remove();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    replaceOldHeader();
    createHeader();
});


// uiManager.js - управление интерфейсом

class UIManager {
    constructor() {
        this.currentFilters = {
            attackType: 'all',
            severity: 'all',
            targetSector: 'all'
        };
    }

    // Инициализация UI - вызывается после создания всех компонентов
    init() {
        this.bindEvents();
        this.updateStats();
        this.setupMobileMenu();
    }

    bindEvents() {
        // Кнопки фильтров (только если элементы существуют)
        const applyFiltersBtn = document.getElementById('apply-filters');
        const resetFiltersBtn = document.getElementById('reset-filters');
        
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => this.applyFilters());
        }
        
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => this.resetFilters());
        }
        
        // Кнопки управления картой (проверяем существование)
        const zoomIn = document.getElementById('zoom-in');
        const zoomOut = document.getElementById('zoom-out');
        const resetView = document.getElementById('reset-view');
        const playPause = document.getElementById('play-pause');
        
        if (zoomIn) {
            zoomIn.addEventListener('click', () => window.mapRenderer?.zoomIn());
        }
        
        if (zoomOut) {
            zoomOut.addEventListener('click', () => window.mapRenderer?.zoomOut());
        }
        
        if (resetView) {
            resetView.addEventListener('click', () => window.mapRenderer?.resetView());
        }
        
        if (playPause) {
            playPause.addEventListener('click', (e) => this.toggleAnimation(e));
        }
        
        // Модальное окно
        const modalCloseBtns = document.querySelectorAll('.modal-close');
        if (modalCloseBtns.length > 0) {
            modalCloseBtns.forEach(btn => {
                btn.addEventListener('click', () => this.closeModal());
            });
        }
        
        const learnMoreBtn = document.getElementById('learn-more-btn');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                alert('Раздел "Учебник" находится в разработке!');
            });
        }
        
        // Закрытие модального окна по клику на фон
        const attackModal = document.getElementById('attack-modal');
        if (attackModal) {
            attackModal.addEventListener('click', (e) => {
                if (e.target.id === 'attack-modal') {
                    this.closeModal();
                }
            });
        }
        
        // События данных
        document.addEventListener('newAttack', (e) => {
            this.handleNewAttack(e.detail);
        });
        
        document.addEventListener('showAttackDetails', (e) => {
            this.showAttackDetails(e.detail);
        });
        
        // Обновление статистики каждые 30 секунд
        setInterval(() => this.updateStats(), 30000);
    }

    // Настройка мобильного меню
    setupMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const nav = document.querySelector('.main-nav');
        
        if (menuBtn && nav) {
            menuBtn.addEventListener('click', () => {
                nav.classList.toggle('active');
                menuBtn.innerHTML = nav.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
            
            // Закрытие меню при клике на ссылку
            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                });
            });
        }
    }

    // Применение фильтров
    applyFilters() {
        const attackTypeEl = document.getElementById('attack-type');
        const severityEl = document.getElementById('severity');
        const targetSectorEl = document.getElementById('target-sector');
        
        if (attackTypeEl) this.currentFilters.attackType = attackTypeEl.value;
        if (severityEl) this.currentFilters.severity = severityEl.value;
        if (targetSectorEl) this.currentFilters.targetSector = targetSectorEl.value;
        
        const filteredAttacks = dataHandler.filterAttacks(this.currentFilters);
        
        // Обновляем карту
        if (window.mapRenderer && window.mapRenderer.drawAttacks) {
            window.mapRenderer.drawAttacks(filteredAttacks);
        }
        
        // Обновляем статистику
        this.updateStats();
        
        // Показываем уведомление
        this.showNotification(`Применены фильтры: ${filteredAttacks.length} атак`);
    }

    // Сброс фильтров
    resetFilters() {
        const attackTypeEl = document.getElementById('attack-type');
        const severityEl = document.getElementById('severity');
        const targetSectorEl = document.getElementById('target-sector');
        
        if (attackTypeEl) attackTypeEl.value = 'all';
        if (severityEl) severityEl.value = 'all';
        if (targetSectorEl) targetSectorEl.value = 'all';
        
        this.currentFilters = {
            attackType: 'all',
            severity: 'all',
            targetSector: 'all'
        };
        
        // Показываем все активные атаки
        if (window.mapRenderer) {
            const activeAttacks = dataHandler.filterAttacks(this.currentFilters);
            window.mapRenderer.drawAttacks(activeAttacks);
        }
        
        this.updateStats();
        this.showNotification('Фильтры сброшены');
    }

    // Обработка новой атаки
    handleNewAttack(attack) {
        // Добавляем на карту
        if (window.mapRenderer) {
            const isVisible = dataHandler.filterAttacks(this.currentFilters)
                .some(a => a.id === attack.id);
            if (isVisible) {
                window.mapRenderer.addAttack(attack);
            }
        }
        
        // Обновляем статистику
        this.updateStats();
    }

    // Показать детали атаки
    showAttackDetails(attack) {
        const details = dataHandler.getAttackDetails(attack);
        
        // Заполняем модальное окно
        const modalTitle = document.getElementById('modal-title');
        const modalSource = document.getElementById('modal-source');
        const modalTarget = document.getElementById('modal-target');
        const modalSector = document.getElementById('modal-sector');
        const severityElement = document.getElementById('modal-severity');
        const modalExplanation = document.getElementById('modal-explanation');
        const modalTechnical = document.getElementById('modal-technical');
        const learnMoreBtn = document.getElementById('learn-more-btn');
        const attackModal = document.getElementById('attack-modal');
        
        if (modalTitle) modalTitle.textContent = details.title;
        if (modalSource) modalSource.textContent = details.source;
        if (modalTarget) modalTarget.textContent = details.target;
        if (modalSector) modalSector.textContent = details.sector;
        
        if (severityElement) {
            severityElement.textContent = details.severity;
            severityElement.className = details.severityClass;
        }
        
        if (modalExplanation) modalExplanation.textContent = details.explanation;
        if (modalTechnical) modalTechnical.textContent = details.technical;
        
        // Заполняем список защиты
        const protectionList = document.getElementById('modal-protection');
        if (protectionList) {
            protectionList.innerHTML = '';
            details.protection.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                protectionList.appendChild(li);
            });
        }
        
        // Устанавливаем статью для кнопки "Узнать больше"
        if (learnMoreBtn) {
            learnMoreBtn.dataset.article = details.article;
        }
        
        // Показываем модальное окно
        if (attackModal) {
            attackModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Закрыть модальное окно
    closeModal() {
        const attackModal = document.getElementById('attack-modal');
        if (attackModal) {
            attackModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Переключение анимации
    toggleAnimation(e) {
        const isPlaying = dataHandler.toggleAnimation();
        const icon = e.currentTarget.querySelector('i');
        
        if (icon) {
            if (isPlaying) {
                icon.className = 'fas fa-pause';
                e.currentTarget.title = 'Пауза';
            } else {
                icon.className = 'fas fa-play';
                e.currentTarget.title = 'Продолжить';
            }
        }
    }

    // Обновление статистики
    updateStats() {
        const stats = dataHandler.getStats();
        const lastUpdate = dataHandler.updateLastUpdateTime();
        
        const totalEl = document.getElementById('total-attacks');
        const activeEl = document.getElementById('active-now');
        const topCountryEl = document.getElementById('top-country');
        const topTypeEl = document.getElementById('top-type');
        const timeEl = document.getElementById('last-update');
        
        if (totalEl) totalEl.textContent = stats.total;
        if (activeEl) activeEl.textContent = stats.active;
        if (topCountryEl) topCountryEl.textContent = stats.topCountry;
        if (topTypeEl) topTypeEl.textContent = stats.topType;
        if (timeEl) timeEl.textContent = lastUpdate;
    }

    // Показать уведомление
    showNotification(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Стили уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'warning' ? '#dc2626' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 3000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        
        // Анимация
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        // Добавляем на страницу
        document.body.appendChild(notification);
        
        // Кнопка закрытия
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Автоматическое закрытие через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}


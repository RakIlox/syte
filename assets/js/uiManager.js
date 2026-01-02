// uiManager.js - управление интерфейсом

class UIManager {
    constructor() {
        this.currentFilters = {
            attackType: 'all',
            severity: 'all',
            targetSector: 'all'
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateStats();
        this.setupMobileMenu();
    }

    // Привязка событий
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
        
        // Кнопки управления картой
        document.getElementById('zoom-in').addEventListener('click', () => mapRenderer?.zoomIn());
        document.getElementById('zoom-out').addEventListener('click', () => mapRenderer?.zoomOut());
        document.getElementById('reset-view').addEventListener('click', () => mapRenderer?.resetView());
        document.getElementById('play-pause').addEventListener('click', (e) => this.toggleAnimation(e));
        
        // Модальное окно
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        
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
        this.currentFilters = {
            attackType: document.getElementById('attack-type').value,
            severity: document.getElementById('severity').value,
            targetSector: document.getElementById('target-sector').value
        };
        
        const filteredAttacks = dataHandler.filterAttacks(this.currentFilters);
        
        // Обновляем карту (добавлена проверка)
        if (mapRenderer && mapRenderer.drawAttacks) {
            mapRenderer.drawAttacks(filteredAttacks);
        }
        
        // Обновляем статистику
        this.updateStats();
        
        // Показываем уведомление
        this.showNotification(`Применены фильтры: ${filteredAttacks.length} атак`);
    }

     // Сброс фильтров
    resetFilters() {
        document.getElementById('attack-type').value = 'all';
        document.getElementById('severity').value = 'all';
        document.getElementById('target-sector').value = 'all';
        
        this.currentFilters = {
            attackType: 'all',
            severity: 'all',
            targetSector: 'all'
        };
        
        // Показываем все активные атаки
        if (mapRenderer) {
            const activeAttacks = dataHandler.filterAttacks(this.currentFilters);
            mapRenderer.drawAttacks(activeAttacks);
        }
        
        this.updateStats();
        this.showNotification('Фильтры сброшены');
    }

    // Обработка новой атаки
    handleNewAttack(attack) {
        // Добавляем на карту (используем filterAttacks для проверки)
        if (mapRenderer) {
            const isVisible = dataHandler.filterAttacks(this.currentFilters)
                .some(a => a.id === attack.id);
            if (isVisible) {
                mapRenderer.addAttack(attack);
            }
        }
        
        // Обновляем статистику
        this.updateStats();
    }

    // Показать детали атаки
    showAttackDetails(attack) {
        const details = dataHandler.getAttackDetails(attack);
        
        // Заполняем модальное окно
        document.getElementById('modal-title').textContent = details.title;
        document.getElementById('modal-source').textContent = details.source;
        document.getElementById('modal-target').textContent = details.target;
        document.getElementById('modal-sector').textContent = details.sector;
        
        const severityElement = document.getElementById('modal-severity');
        severityElement.textContent = details.severity;
        severityElement.className = details.severityClass;
        
        document.getElementById('modal-explanation').textContent = details.explanation;
        document.getElementById('modal-technical').textContent = details.technical;
        
        // Заполняем список защиты
        const protectionList = document.getElementById('modal-protection');
        protectionList.innerHTML = '';
        details.protection.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            protectionList.appendChild(li);
        });
        
        // Устанавливаем статью для кнопки "Узнать больше"
        document.getElementById('learn-more-btn').dataset.article = details.article;
        
        // Показываем модальное окно
        document.getElementById('attack-modal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Закрыть модальное окно
    closeModal() {
        document.getElementById('attack-modal').classList.remove('active');
        document.body.style.overflow = '';
    }

    // Переключение анимации
    toggleAnimation(e) {
        const isPlaying = dataHandler.toggleAnimation();
        const icon = e.currentTarget.querySelector('i');
        
        if (isPlaying) {
            icon.className = 'fas fa-pause';
            e.currentTarget.title = 'Пауза';
        } else {
            icon.className = 'fas fa-play';
            e.currentTarget.title = 'Продолжить';
        }
    }

    // Обновление статистики
    updateStats() {
        const stats = dataHandler.getStats();
        const lastUpdate = dataHandler.updateLastUpdateTime();
        
        document.getElementById('total-attacks').textContent = stats.total;
        document.getElementById('active-now').textContent = stats.active;
        document.getElementById('top-country').textContent = stats.topCountry;
        document.getElementById('top-type').textContent = stats.topType;
        document.getElementById('last-update').textContent = lastUpdate;
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

// Создаем глобальный экземпляр
let uiManager = null;
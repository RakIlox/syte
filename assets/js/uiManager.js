// uiManager.js - управление интерфейсом

class UIManager {
    constructor() {
        this.currentFilters = {
            attackType: 'all',
            severity: 'all',
            targetSector: 'all'
        };
        this.notificationStyleAdded = false;
    }

    // Инициализация UI - вызывается после создания всех компонентов
    init() {
        this.bindEvents();
        this.updateStats();
        this.setupMobileMenu();
        this.setupAnimations();
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
                const article = learnMoreBtn.dataset.article;
                if (article) {
                    window.location.href = `article.html?id=${article}`;
                } else {
                    this.showNotification('Статья находится в разработке!', 'info');
                }
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
            
            // Закрытие по Esc
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && attackModal.classList.contains('active')) {
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
                
                // Блокируем скролл при открытом меню
                if (nav.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
            
            // Закрытие меню при клике на ссылку
            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('active');
                    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    document.body.style.overflow = '';
                });
            });
        }
    }

    // Настройка анимаций
    setupAnimations() {
        // Добавляем стили для анимаций если ещё нет
        if (!document.getElementById('ui-animations-style')) {
            const style = document.createElement('style');
            style.id = 'ui-animations-style';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes modalSlideIn {
                    from { opacity: 0; transform: scale(0.9) translateY(-20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes modalBackdrop {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes statPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .stat-value {
                    transition: all 0.3s ease;
                }
                .stat-value:hover {
                    animation: statPulse 0.5s ease;
                }
                .notification-entering {
                    animation: slideInRight 0.3s ease forwards;
                }
                .notification-exiting {
                    animation: slideOutRight 0.3s ease forwards;
                }
                .modal-backdrop-active {
                    animation: modalBackdrop 0.2s ease forwards;
                }
                .modal-content-active {
                    animation: modalSlideIn 0.3s ease forwards;
                }
                .attack-modal.active .modal-content {
                    animation: modalSlideIn 0.3s ease forwards;
                }
                .attack-modal.active .modal-backdrop {
                    animation: modalBackdrop 0.2s ease forwards;
                }
            `;
            document.head.appendChild(style);
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
        this.showNotification(`Фильтры применены: ${filteredAttacks.length} атак`, 'success');
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
        this.showNotification('Фильтры сброшены', 'info');
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

    // Показать детали атаки с расширенной информацией
    showAttackDetails(attack) {
        const details = dataHandler.getAttackDetails(attack);
        
        // Заполняем модальное окно
        const modalTitle = document.getElementById('modal-title');
        const modalIcon = document.getElementById('modal-icon');
        const modalShortDesc = document.getElementById('modal-short-desc');
        const modalSource = document.getElementById('modal-source');
        const modalTarget = document.getElementById('modal-target');
        const modalSector = document.getElementById('modal-sector');
        const severityElement = document.getElementById('modal-severity');
        const modalExplanation = document.getElementById('modal-explanation');
        const modalTechnical = document.getElementById('modal-technical');
        const modalHowToRecognize = document.getElementById('modal-how-to-recognize');
        const modalRealExamples = document.getElementById('modal-real-examples');
        const modalStatistics = document.getElementById('modal-statistics');
        const modalProtection = document.getElementById('modal-protection');
        const learnMoreBtn = document.getElementById('learn-more-btn');
        const attackModal = document.getElementById('attack-modal');
        
        // Заголовок с иконкой
        if (modalTitle) {
            modalTitle.innerHTML = `<span style="font-size: 28px; margin-right: 10px;">${details.icon || '⚠️'}</span>${details.title}`;
        }
        
        if (modalIcon) {
            modalIcon.innerHTML = details.icon || '⚠️';
            modalIcon.style.color = details.color || '#ef4444';
        }
        
        if (modalShortDesc) {
            modalShortDesc.textContent = details.shortDesc || '';
            modalShortDesc.style.color = details.color || '#94a3b8';
        }
        
        if (modalSource) modalSource.innerHTML = `<strong>${details.source}</strong>`;
        if (modalTarget) modalTarget.innerHTML = `<strong>${details.target}</strong>`;
        if (modalSector) modalSector.innerHTML = `<strong>${details.sector}</strong>`;
        
        if (severityElement) {
            severityElement.innerHTML = details.severity;
            severityElement.className = details.severityClass;
            severityElement.style.background = details.severityColor || '#ef4444';
        }
        
        if (modalExplanation) modalExplanation.textContent = details.explanation;
        if (modalTechnical) modalTechnical.textContent = details.technical;
        
        // Как распознать атаку
        if (modalHowToRecognize && details.howToRecognize) {
            modalHowToRecognize.innerHTML = '';
            details.howToRecognize.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<span style="color: ${details.color};">●</span> ${item}`;
                li.style.marginBottom = '8px';
                li.style.display = 'flex';
                li.style.alignItems = 'flex-start';
                li.style.gap = '8px';
                modalHowToRecognize.appendChild(li);
            });
        }
        
        // Реальные примеры
        if (modalRealExamples && details.realExamples) {
            modalRealExamples.innerHTML = '';
            details.realExamples.forEach((example, index) => {
                const div = document.createElement('div');
                div.innerHTML = `<span style="color: ${details.color}; font-weight: bold; margin-right: 8px;">${index + 1}.</span>${example}`;
                div.style.marginBottom = '8px';
                div.style.padding = '8px 12px';
                div.style.background = 'rgba(59, 130, 246, 0.1)';
                div.style.borderRadius = '6px';
                div.style.fontSize = '13px';
                modalRealExamples.appendChild(div);
            });
        }
        
        // Статистика
        if (modalStatistics) {
            modalStatistics.innerHTML = `<span style="font-size: 20px; margin-right: 8px;">📊</span>${details.statistics}`;
            modalStatistics.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))';
        }
        
        // Заполняем список защиты с иконками
        const protectionList = document.getElementById('modal-protection');
        if (protectionList && details.protection) {
            protectionList.innerHTML = '';
            details.protection.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = item;
                li.style.marginBottom = '10px';
                li.style.padding = '10px 12px';
                li.style.background = 'rgba(59, 130, 246, 0.08)';
                li.style.borderRadius = '8px';
                li.style.fontSize = '13px';
                li.style.borderLeft = `3px solid ${details.color || '#3b82f6'}`;
                protectionList.appendChild(li);
            });
        }
        
        // Устанавливаем статью для кнопки "Узнать больше"
        if (learnMoreBtn) {
            learnMoreBtn.dataset.article = details.article;
            learnMoreBtn.style.display = details.article ? 'inline-flex' : 'none';
        }
        
        // Показываем модальное окно с анимацией
        if (attackModal) {
            const backdrop = attackModal.querySelector('.modal-backdrop');
            const content = attackModal.querySelector('.modal-content');
            
            attackModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            if (backdrop) backdrop.classList.add('modal-backdrop-active');
            if (content) content.classList.add('modal-content-active');
        }
    }

    // Закрыть модальное окно
    closeModal() {
        const attackModal = document.getElementById('attack-modal');
        if (attackModal) {
            const backdrop = attackModal.querySelector('.modal-backdrop');
            const content = attackModal.querySelector('.modal-content');
            
            attackModal.classList.remove('active');
            document.body.style.overflow = '';
            
            if (backdrop) backdrop.classList.remove('modal-backdrop-active');
            if (content) content.classList.remove('modal-content-active');
        }
    }

    // Переключение анимации
    toggleAnimation(e) {
        if (!e) return;
        
        const isPlaying = dataHandler.toggleAnimation();
        const icon = e.currentTarget.querySelector('i');
        const btn = e.currentTarget;
        
        if (icon) {
            if (isPlaying) {
                icon.className = 'fas fa-pause';
                btn.title = 'Пауза';
                this.showNotification('Анимация возобновлена', 'success');
            } else {
                icon.className = 'fas fa-play';
                btn.title = 'Продолжить';
                this.showNotification('Анимация приостановлена', 'warning');
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
        
        if (totalEl) {
            totalEl.textContent = stats.total;
            totalEl.classList.add('stat-value');
        }
        if (activeEl) {
            activeEl.textContent = stats.active;
            activeEl.classList.add('stat-value');
        }
        if (topCountryEl) {
            topCountryEl.textContent = stats.topCountry;
            topCountryEl.classList.add('stat-value');
        }
        if (topTypeEl) {
            topTypeEl.textContent = stats.topType;
            topTypeEl.classList.add('stat-value');
        }
        if (timeEl) timeEl.textContent = lastUpdate;
    }

    // Показать уведомление с различными типами
    showNotification(message, type = 'info') {
        // Иконки для разных типов
        const icons = {
            success: 'fa-check-circle',
            warning: 'fa-exclamation-triangle',
            error: 'fa-times-circle',
            info: 'fa-info-circle'
        };
        
        const colors = {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        };
        
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas ${icons[type]}" style="font-size: 18px; color: ${colors[type]};"></i>
            <span style="flex: 1; font-weight: 500;">${message}</span>
            <button class="notification-close" style="background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 18px; padding: 0 4px;">&times;</button>
        `;
        
        // Стили уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95));
            color: white;
            padding: 14px 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 3000;
            max-width: 400px;
            min-width: 300px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
            border-left: 4px solid ${colors[type]};
            backdrop-filter: blur(10px);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        // Добавляем анимацию появления
        notification.classList.add('notification-entering');
        
        // Добавляем на страницу
        document.body.appendChild(notification);
        
        // Кнопка закрытия
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Автоматическое закрытие через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                this.removeNotification(notification);
            }
        }, 5000);
    }

    // Удаление уведомления с анимацией
    removeNotification(notification) {
        if (!notification.parentNode) return;
        
        notification.classList.remove('notification-entering');
        notification.classList.add('notification-exiting');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }
}


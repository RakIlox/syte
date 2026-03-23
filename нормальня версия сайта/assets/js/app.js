// app.js - Оптимизированный основной файл приложения

class CyberThreatApp {
    constructor() {
        this.dataHandler = null;
        this.mapRenderer = null;
        this.uiManager = null;
        this.isInitialized = false;
        this.isMapVisible = false;
        this.hasAnimatedAttacks = false;
        this.initTimeout = null;
    }

    async init() {
        try {
            // Проверяем, загружен ли dataHandler
            if (typeof dataHandler === 'undefined') {
                console.error('DataHandler не загружен!');
                this.showError('Ошибка загрузки данных. Проверьте подключение к интернету.');
                return;
            }
            
            this.dataHandler = dataHandler;
            
            // Инициализируем обработчик данных (без запуска анимации)
            await this.dataHandler.init();
            
            // Проверяем, загружен ли MapRenderer
            if (typeof MapRenderer === 'undefined') {
                console.error('MapRenderer не загружен!');
                this.showError('Ошибка загрузки карты. Проверьте подключение к интернету.');
                return;
            }
            
            // Инициализируем карту
            this.mapRenderer = new MapRenderer('world-map');
            await this.mapRenderer.init();
            
            // Делаем глобально доступным
            window.mapRenderer = this.mapRenderer;
            
            // Инициализируем UI менеджер
            if (typeof UIManager !== 'undefined') {
                this.uiManager = new UIManager();
                this.uiManager.init();
                window.uiManager = this.uiManager;
            } else {
                console.warn('UIManager не загружен, используем базовый UI');
                this.initBasicUI();
            }
            
            // Отключаем старую статистику карты
            this.isInitialized = true;
            console.log('Приложение инициализировано успешно');
            
            // Устанавливаем Intersection Observer для lazy loading
            this.setupIntersectionObserver();
            
        } catch (error) {
            console.error('Ошибка инициализации:', error);
            this.showError('Ошибка инициализации: ' + error.message);
        }
    }

    // Оптимизация: Отложенная загрузка атак (2-3 секунды после готовности карты)
    scheduleAttackAnimation() {
        // Задержка 2 секунды перед первой анимацией атак
        this.initTimeout = setTimeout(() => {
            this.animateAttacks();
        }, 2000);
    }

    // Оптимизация: Постепенное добавление атак
    animateAttacks() {
        if (this.hasAnimatedAttacks || !this.mapRenderer || !this.dataHandler) {
            return;
        }
        
        this.hasAnimatedAttacks = true;
        
        // Получаем начальные атаки
        const initialAttacks = this.dataHandler.getMapData();
        
        // Рисуем атаки с анимацией (постепенно)
        if (this.mapRenderer && typeof this.mapRenderer.drawAttacks === 'function') {
            this.mapRenderer.drawAttacks(initialAttacks, {
                delay: 100,  // Задержка между батчами (мс)
                maxAtOnce: 3 // Количество атак за один раз
            });
        }
        
        console.log('Анимация атак запущена, добавлено ' + initialAttacks.length + ' атак');
    }

    // Оптимизация: Intersection Observer для lazy loading
    setupIntersectionObserver() {
        // Проверяем поддержку Intersection Observer
        if ('IntersectionObserver' in window) {
            const mapContainer = document.getElementById('world-map');
            
            if (mapContainer) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.isMapVisible = true;
                            console.log('Карта стала видимой');
                            
                            // Если карта стала видимой и атаки ещё не анимированы
                            if (!this.hasAnimatedAttacks) {
                                this.animateAttacks();
                            }
                            
                            // Отключаем observer после первого срабатывания
                            observer.disconnect();
                        }
                    });
                }, {
                    threshold: 0.1, // 10% видимости
                    rootMargin: '100px' //提前 100px 开始加载
                });
                
                observer.observe(mapContainer);
                console.log('Intersection Observer установлен');
            }
        } else {
            // Fallback для старых браузеров - сразу запускаем
            console.log('Intersection Observer не поддерживается, используем fallback');
            setTimeout(() => this.animateAttacks(), 1000);
        }
    }

    initBasicUI() {
        console.log('Используется базовый UI');
    }

    showError(message) {
        const container = document.querySelector('.main-content');
        if (container) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = 'background: rgba(239, 68, 68, 0.2); border: 1px solid #ef4444; border-radius: 12px; padding: 20px; margin: 20px; color: #fca5a5;';
            errorDiv.innerHTML = '<h3 style="margin: 0 0 10px;"><i class="fas fa-exclamation-triangle"></i> Ошибка</h3><p style="margin: 0;">' + message + '</p>';
            container.insertBefore(errorDiv, container.firstChild);
        }
    }
}

// Запуск приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    // Проверяем загрузку всех необходимых библиотек
    const requiredLibs = ['d3'];
    const missingLibs = [];
    
    requiredLibs.forEach(lib => {
        if (typeof d3 === 'undefined') {
            missingLibs.push(lib);
        }
    });
    
    if (missingLibs.length > 0) {
        console.error('Отсутствуют библиотеки:', missingLibs);
        const mapContainer = document.getElementById('world-map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #94a3b8; text-align: center; padding: 20px;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 20px;"></i>
                    <h3 style="margin: 0 0 10px;">Ошибка загрузки</h3>
                    <p>Не удалось загрузить библиотеки: ${missingLibs.join(', ')}</p>
                    <p>Проверьте подключение к интернету.</p>
                </div>
            `;
        }
        return;
    }
    
    const app = new CyberThreatApp();
    
    try {
        await app.init();
    } catch (error) {
        console.error('Критическая ошибка:', error);
    }
});


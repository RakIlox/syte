// app.js - основной файл приложения

class CyberThreatApp {
    constructor() {
        this.dataHandler = dataHandler;
        this.mapRenderer = null;
        this.uiManager = null;
        this.isInitialized = false;
    }

    // Инициализация приложения
    async init() {
        try {
            console.log('Запуск CyberThreat Explorer...');
            
            // Инициализируем обработчик данных
            await this.dataHandler.init();
            
            // Инициализируем рендерер карты
            this.mapRenderer = new MapRenderer('world-map');
            await this.mapRenderer.init();
            
            // Инициализируем UI менеджер
            this.uiManager = new UIManager();
            
            // Отрисовываем начальные атаки
            const initialAttacks = this.dataHandler.filterAttacks({
                attackType: 'all',
                severity: 'all',
                targetSector: 'all'
            });
            this.mapRenderer.drawAttacks(initialAttacks);
            
            this.isInitialized = true;
            console.log('Приложение успешно запущено!');
            
            // Показываем приветственное сообщение
           // setTimeout(() => {
             //   this.uiManager.showNotification('Добро пожаловать в CyberThreat Explorer! Изучайте кибератаки в реальном времени.', 'info');
            //}, 1000);
            
        } catch (error) {
            console.error('Ошибка инициализации приложения:', error);
            this.showError('Не удалось загрузить карту. Проверьте подключение к интернету.');
        }
    }

    // Показать ошибку
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #dc2626;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            z-index: 10000;
            max-width: 400px;
        `;
        
        errorDiv.innerHTML = `
            <h3><i class="fas fa-exclamation-triangle"></i> Ошибка</h3>
            <p>${message}</p>
            <button id="retry-btn" style="
                margin-top: 15px;
                padding: 8px 20px;
                background: white;
                color: #dc2626;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            ">Повторить попытку</button>
        `;
        
        document.body.appendChild(errorDiv);
        
        document.getElementById('retry-btn').addEventListener('click', () => {
            errorDiv.remove();
            this.init();
        });
    }

    // Получить статус приложения
    getStatus() {
        return {
            initialized: this.isInitialized,
            attacksCount: this.dataHandler.attacks.length,
            activeAttacks: this.dataHandler.attacks.filter(a => a.active).length
        };
    }
}

// Запуск приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    const app = new CyberThreatApp();
    window.app = app; // Делаем доступным в консоли
    
    try {
        await app.init();
    } catch (error) {
        console.error('Критическая ошибка:', error);
    }
});

// Глобальные функции для отладки
window.debug = {
    addTestAttack: () => {
        if (window.app && window.app.dataHandler) {
            const attack = window.app.dataHandler.addNewAttack();
            console.log('Добавлена тестовая атака:', attack);
            return attack;
        }
    },
    
    clearAllAttacks: () => {
        if (window.app && window.app.mapRenderer) {
            window.app.mapRenderer.clearAttacks();
            console.log('Все атаки очищены');
        }
    },
    
    getStats: () => {
        if (window.app && window.app.dataHandler) {
            return window.app.dataHandler.getStats();
        }
    }
};

/**
 * News Detail Modal - модальное окно для просмотра подробностей новости
 */

// Данные новостей с расширенным контентом
const newsDetails = {
    'cisco-vulnerability': {
        title: 'Critical уязвимость в Cisco ASA и FTD позволяет удалённо выполнить код',
        date: '17 января 2025',
        source: 'SecurityLab',
        tags: ['Уязвимость', 'Critical', 'Cisco'],
        content: `
            <h4>Описание уязвимости</h4>
            <p>Критическая уязвимость CVE-2025-0001 была обнаружена в межсетевых экранах Cisco Adaptive Security Appliance (ASA) и Cisco Firepower Threat Defense (FTD). Уязвимость позволяет злоумышленникам выполнить произвольный код на целевом устройстве без аутентификации.</p>
            
            <h4>Технические детали</h4>
            <p>Уязвимость связана с некорректной обработкой определённых HTTP-запросов в веб-интерфейсе устройства. Атакующий может отправить специально сформированный запрос, который приведёт к выполнению произвольного кода с правами root на уязвимой системе.</p>
            
            <h4>Подверженные системы</h4>
            <ul>
                <li>Cisco ASA версии 9.x</li>
                <li>Cisco Firepower Threat Defense версии 6.x</li>
                <li>Cisco ASA 5500-X Series</li>
                <li>Cisco ISA 3000 Series</li>
            </ul>
            
            <h4>Рекомендации по защите</h4>
            <div class="success-box">
                <h4><i class="fas fa-shield-alt"></i> Меры защиты</h4>
                <ul>
                    <li>Немедленно установите патчи с официального сайта Cisco</li>
                    <li>Ограничьте доступ к веб-интерфейсу ASA/FTD доверенным зонам</li>
                    <li>Включите мониторинг подозрительной активности</li>
                    <li>Рассмотрите временное отключение неиспользуемых сервисов</li>
                </ul>
            </div>
            
            <h4>Оценка критичности</h4>
            <p>CVSS Score: <strong>9.8 из 10</strong> (Critical)</p>
            <p>Уязвимость имеет критический уровень опасности из-за:</p>
            <ul>
                <li>Возможности удалённого выполнения кода без аутентификации</li>
                <li>Отсутствия требуемого взаимодействия с пользователем</li>
                <li>Широкого распространения уязвимых устройств</li>
                <li>Наличия публичных эксплойтов</li>
            </ul>
            
            <h4>Информация об источнике</h4>
            <p>Данная новость основана на материалах с <a href="https://www.securitylab.ru/news/" target="_blank" rel="noopener">SecurityLab.ru</a></p>
        `
    },
    'lazarus-linkedin': {
        title: 'Хакеры Lazarus атакуют криптовалютные биржи через LinkedIn',
        date: '17 января 2025',
        source: 'SecurityLab',
        tags: ['APT', 'Фишинг', 'Криптовалюта'],
        content: `
            <h4>Описание кампании</h4>
            <p>Группировка Lazarus, связанная с Северной Кореей, начала новую фишинговую кампанию, нацеленную на сотрудников криптовалютных компаний. Злоумышленники создают фальшивые профили рекрутеров на LinkedIn и предлагают высокооплачиваемые позиции в крупных технологических компаниях.</p>
            
            <h4>Метод атаки</h4>
            <p>После установления первоначального контакта злоумышленники отправляют PDF-файл с описанием вакансии. Этот файл содержит вредоносный код, который устанавливает троян удалённого доступа (RAT) на компьютер жертвы.</p>
            
            <h4>Цели атаки</h4>
            <ul>
                <li>Сотрудники криптовалютных бирж</li>
                <li>Разработчики блокчейн-проектов</li>
                <li>Специалисты по безопасности в крипто-компаниях</li>
                <li>Финансовые аналитики</li>
            </ul>
            
            <h4>Признаки фишинга</h4>
            <div class="warning-box">
                <h4><i class="fas fa-exclamation-triangle"></i> На что обратить внимание</h4>
                <ul>
                    <li>Предложения о работе от неизвестных рекрутеров</li>
                    <li>Просьба загрузить PDF-файл или документ</li>
                    <li>Обещание высокой зарплаты без собеседования</li>
                    <li>Профили с минимальной историей активности</li>
                    <li>Просьба использовать личный email для коммуникации</li>
                </ul>
            </div>
            
            <h4>Рекомендации по защите</h4>
            <ul>
                <li>Проверяйте профили рекрутеров через официальные каналы компании</li>
                <li>Не загружайте файлы из непроверенных источников</li>
                <li>Используйте корпоративные средства проверки файлов</li>
                <li>Сообщайте о подозрительных предложениях в службу безопасности</li>
            </ul>
            
            <h4>Информация об источнике</h4>
            <p>Данная новость основана на материалах с <a href="https://www.securitylab.ru/news/" target="_blank" rel="noopener">SecurityLab.ru</a></p>
        `
    },
    'data-breach': {
        title: 'Massive утечка данных: 2.7 млрд записей с персональными данными в открытом доступе',
        date: '16 января 2025',
        source: 'SecurityLab',
        tags: ['Утечка', 'Персональные данные', 'Масштабная'],
        content: `
            <h4>Описание инцидента</h4>
            <p>Исследователи в области кибербезопасности обнаружили в открытом доступе базу данных объёмом более 1 терабайта, содержащую 2.7 миллиарда записей с персональными данными пользователей из нескольких стран.</p>
            
            <h4>Типы скомпрометированных данных</h4>
            <ul>
                <li>Полные имена пользователей</li>
                <li>Адреса электронной почты</li>
                <li>Номера телефонов</li>
                <li>Даты рождения</li>
                <li>Адреса проживания</li>
                <li>Данные о местах работы</li>
            </ul>
            
            <h4>Возможные последствия</h4>
            <div class="warning-box">
                <h4><i class="fas fa-exclamation-triangle"></i> Чем это грозит</h4>
                <ul>
                    <li>Фишинговые атаки с использованием реальных данных</li>
                    <li>Кража личности</li>
                    <li>Спам и нежелательные рассылки</li>
                    <li>Социальная инженерия</li>
                    <li>Компрометация других аккаунтов</li>
                </ul>
            </div>
            
            <h4>Рекомендации по защите</h4>
            <div class="success-box">
                <h4><i class="fas fa-shield-alt"></i> Что делать</h4>
                <ul>
                    <li>Измените пароли на всех важных аккаунтах</li>
                    <li>Включите двухфакторную аутентификацию везде</li>
                    <li>Следите за подозрительной активностью</li>
                    <li>Не открывайте письма от незнакомцев</li>
                    <li>Используйте менеджеры паролей</li>
                </ul>
            </div>
            
            <h4>Информация об источнике</h4>
            <p>Данная новость основана на материалах с <a href="https://www.securitylab.ru/news/" target="_blank" rel="noopener">SecurityLab.ru</a></p>
        `
    },
    'blacklock-ransomware': {
        title: 'Новый ransomware Blacklock атакует Linux-серверы корпораций',
        date: '16 января 2025',
        source: 'SecurityLab',
        tags: ['Ransomware', 'Linux', 'Критический'],
        content: `
            <h4>Описание угрозы</h4>
            <p>Исследователи обнаружили новый штамм программы-вымогателя под названием Blacklock, который специализируется на атаках Linux-систем в корпоративных сетях. В отличие от большинства ransomware, Blacklock не шифрует файлы, а крадёт данные и требует выкуп за их непубликацию.</p>
            
            <h4>Методы распространения</h4>
            <ul>
                <li>Эксплуатация уязвимостей в популярных CMS (WordPress, Drupal)</li>
                <li>Брутфорс SSH-серверов</li>
                <li>Фишинговые письма с вредоносными вложениями</li>
                <li>Компрометация VPN-шлюзов</li>
            </ul>
            
            <h4>Особенности Blacklock</h4>
            <div class="info-box">
                <h4><i class="fas fa-info-circle"></i> Технические характеристики</h4>
                <ul>
                    <li>Использует RSA-2048 для шифрования ключей</li>
                    <li>Удаляет теневые копии файлов</li>
                    <li>Отключает системы мониторинга</li>
                    <li>Работает с правами root</li>
                </ul>
            </div>
            
            <h4>Рекомендации по защите</h4>
            <div class="success-box">
                <h4><i class="fas fa-shield-alt"></i> Меры защиты</h4>
                <ul>
                    <li>Регулярно обновляйте CMS и плагины</li>
                    <li>Используйте сильные пароли для SSH</li>
                    <li>Настройте fail2ban для защиты от брутфорса</li>
                    <li>Создавайте резервные копии</li>
                    <li>Ограничьте права пользователей</li>
                </ul>
            </div>
            
            <h4>Информация об источнике</h4>
            <p>Данная новость основана на материалах с <a href="https://www.securitylab.ru/news/" target="_blank" rel="noopener">SecurityLab.ru</a></p>
        `
    },
    'browser-patches': {
        title: 'Chrome и Firefox получили патчи с устранением 0-day уязвимостей',
        date: '15 января 2025',
        source: 'SecurityLab',
        tags: ['0-day', 'Браузер', 'Патч'],
        content: `
            <h4>Описание обновлений</h4>
            <p>Компании Google и Mozilla выпустили экстренные обновления безопасности для своих браузеров Chrome и Firefox. Обновления устраняют критические уязвимости, которые активно эксплуатировались злоумышленниками в реальных атаках.</p>
            
            <h4>Уязвимости в Chrome</h4>
            <ul>
                <li>CVE-2025-0001: Use-after-free в Blink</li>
                <li>CVE-2025-0002: Heap buffer overflow в V8</li>
                <li>CVE-2025-0003: Ошибка в Policy реализации</li>
            </ul>
            
            <h4>Уязвимости в Firefox</h4>
            <ul>
                <li>CVE-2025-0004: Memory safety bug</li>
                <li>CVE-2025-0005: Same-origin policy bypass</li>
            </ul>
            
            <h4>Рекомендации</h4>
            <div class="warning-box">
                <h4><i class="fas fa-exclamation-triangle"></i> Важно</h4>
                <p>Уязвимости активно эксплуатируются в реальных атаках. Немедленно обновите браузеры!</p>
            </div>
            
            <h4>Как обновить</h4>
            <ul>
                <li><strong>Chrome:</strong> Меню → Справка → О Google Chrome</li>
                <li><strong>Firefox:</strong> Меню → Справка → О Firefox</li>
            </ul>
            
            <h4>Информация об источнике</h4>
            <p>Данная новость основана на материалах с <a href="https://www.securitylab.ru/news/" target="_blank" rel="noopener">SecurityLab.ru</a></p>
        `
    },
    'deepfake-fraud': {
        title: 'AI-генерированные дипфейки используются для мошенничества на видеоконференциях',
        date: '15 января 2025',
        source: 'SecurityLab',
        tags: ['AI', 'Дипфейк', 'Мошенничество'],
        content: `
            <h4>Описание проблемы</h4>
            <p>Киберпреступники всё чаще используют технологии искусственного интеллекта для создания убедительных дипфейков в корпоративных видеоконференциях. Мошенники имитируют руководителей компаний для хищения средств через BEC-атаки (Business Email Compromise).</p>
            
            <h4>Как работает атака</h4>
            <ol>
                <li>Злоумышленники собирают информацию о компании и руководстве</li>
                <li>Создают фальшивый профиль руководителя</li>
                <li>Генерируют дипфейк видео с использованием AI</li>
                <li>Организуют срочный видеозвонок с сотрудником</li>
                <li>Просят перевести деньги или раскрыть конфиденциальные данные</li>
            </ol>
            
            <h4>Признаки дипфейка</h4>
            <div class="warning-box">
                <h4><i class="fas fa-exclamation-triangle"></i> На что обратить внимание</h4>
                <ul>
                    <li>Неестественное движение губ</li>
                    <li>Странное освещение лица</li>
                    <li>Немного "размытое" лицо</li>
                    <li>Несовпадение голоса с видео</li>
                    <li>Слишком "идеальное" качество видео</li>
                    <li>Срочность и давление</li>
                </ul>
            </div>
            
            <h4>Рекомендации по защите</h4>
            <ul>
                <li>Внедрите многофакторную аутентификацию для финансовых операций</li>
                <li>Установите кодовое слово для подтверждения личности</li>
                <li>Проверяйте запросы через альтернативные каналы</li>
                <li>Обучите сотрудников распознавать признаки мошенничества</li>
                <li>Используйте корпоративные мессенджеры для важных решений</li>
            </ul>
            
            <h4>Информация об источнике</h4>
            <p>Данная новость основана на материалах с <a href="https://www.securitylab.ru/news/" target="_blank" rel="noopener">SecurityLab.ru</a></p>
        `
    },
    'spyware-googleplay': {
        title: 'Шпионское ПО скомпрометировало более 1000 Android-приложений в Google Play',
        date: '14 января 2025',
        source: 'SecurityLab',
        tags: ['Android', 'Шпионское ПО', 'Google Play'],
        content: `
            <h4>Описание кампании</h4>
            <p>Исследователи в области мобильной безопасности обнаружили масштабную кампанию по распространению шпионского ПО через Google Play Store. Более 1000 приложений были заражены вредоносным кодом, который похищает персональные данные пользователей.</p>
            
            <h4>Функции вредоносного ПО</h4>
            <ul>
                <li>Кража SMS-сообщений</li>
                <li>Перехват телефонных звонков</li>
                <li>Доступ к контактам</li>
                <li>Отслеживание геолокации</li>
                <li>Запись аудио с микрофона</li>
                <li>Кража файлов с устройства</li>
            </ul>
            
            <h4>Как защитить устройство</h4>
            <div class="success-box">
                <h4><i class="fas fa-shield-alt"></i> Меры защиты</h4>
                <ul>
                    <li>Обновите Android до последней версии</li>
                    <li>Проверьте приложения в списке разрешений</li>
                    <li>Установите антивирусное ПО</li>
                    <li>Удалите подозрительные приложения</li>
                    <li>Не предоставляйте избыточные разрешения приложениям</li>
                </ul>
            </div>
            
            <h4>Как удалить шпионское ПО</h4>
            <ol>
                <li>Перезагрузите устройство в безопасном режиме</li>
                <li>Перейдите в Настройки → Приложения</li>
                <li>Найдите и удалите подозрительные приложения</li>
                <li>Сбросьте настройки аккаунтов</li>
                <li>Рассмотрите сброс к заводским настройкам</li>
            </ol>
            
            <h4>Информация об источнике</h4>
            <p>Данная новость основана на материалах с <a href="https://www.securitylab.ru/news/" target="_blank" rel="noopener">SecurityLab.ru</a></p>
        `
    },
    'russia-bank-ddos': {
        title: 'Крупный банк России подвергся DDoS-атаке мощностью более 500 Гбит/с',
        date: '14 января 2025',
        source: 'SecurityLab',
        tags: ['DDoS', 'Финансы', 'IoT'],
        content: `
            <h4>Описание инцидента</h4>
            <p>Крупный российский банк подвергся мощной распределённой атаке на отказ в обслуживании (DDoS), которая парализовала работу его онлайн-сервисов. Атака продолжалась более 8 часов и была одной из самых мощных за последние годы.</p>
            
            <h4>Технические характеристики атаки</h4>
            <ul>
                <li>Мощность: более 500 Гбит/с</li>
                <li>Продолжительность: более 8 часов</li>
                <li>Источник: ботнет из IoT-устройств</li>
                <li>Тип: комбинированная атака (L3/L4/L7)</li>
            </ul>
            
            <h4>Последствия атаки</h4>
            <div class="warning-box">
                <h4><i class="fas fa-exclamation-triangle"></i> Влияние на клиентов</h4>
                <ul>
                    <li>Недоступность мобильного приложения</li>
                    <li>Проблемы с интернет-банкингом</li>
                    <li>Сбои в работе банкоматов</li>
                    <li>Задержки в обработке платежей</li>
                </ul>
            </div>
            
            <h4>Методы защиты от DDoS</h4>
            <div class="success-box">
                <h4><i class="fas fa-shield-alt"></i> Рекомендации для организаций</h4>
                <ul>
                    <li>Используйте CDN с защитой от DDoS</li>
                    <li>Настройте rate limiting</li>
                    <li>Внедрите системы мониторинга трафика</li>
                    <li>Имейте план реагирования на инциденты</li>
                    <li>Рассмотрите специализированные DDoS-митигаторы</li>
                </ul>
            </div>
            
            <h4>Информация об источнике</h4>
            <p>Данная новость основана на материалах с <a href="https://www.securitylab.ru/news/" target="_blank" rel="noopener">SecurityLab.ru</a></p>
        `
    }
};

// Функция для открытия модального окна новости
function openNewsDetail(newsId) {
    const news = newsDetails[newsId];
    if (!news) {
        console.warn('Новость не найдена:', newsId);
        return;
    }
    
    const modal = document.getElementById('news-detail-modal');
    if (!modal) {
        console.error('Модальное окно не найдено!');
        return;
    }
    
    // Заполняем модальное окно данными
    document.getElementById('news-detail-title').innerHTML = '<i class="fas fa-newspaper"></i> ' + news.title;
    document.getElementById('news-detail-date').innerHTML = '<i class="fas fa-calendar-alt"></i> ' + news.date;
    document.getElementById('news-detail-source').innerHTML = '<i class="fas fa-link"></i> Источник: ' + news.source;
    
    // Генерируем теги
    const tagsContainer = document.getElementById('news-detail-tags');
    tagsContainer.innerHTML = news.tags.map(function(tag) {
        return '<span class="news-tag">' + tag + '</span>';
    }).join('');
    
    // Вставляем контент
    document.getElementById('news-detail-content').innerHTML = news.content;
    
    // Показываем модальное окно
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Функция для закрытия модального окна
function closeNewsDetail() {
    const modal = document.getElementById('news-detail-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем обработчики клика на карточки новостей
    const newsCards = document.querySelectorAll('.news-card');
    
    newsCards.forEach(function(card) {
        // Получаем ID новости из атрибута data-news-id
        const newsId = card.getAttribute('data-news-id');
        
        if (!newsId) {
            return;
        }
        
        // Добавляем кнопку "Читать подробнее"
        const tagsContainer = card.querySelector('.news-tags');
        if (tagsContainer) {
            const readMoreBtn = document.createElement('button');
            readMoreBtn.className = 'news-read-more';
            readMoreBtn.innerHTML = '<i class="fas fa-arrow-right"></i> Читать подробнее';
            readMoreBtn.style.cssText = 'display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 20px; font-size: 0.8rem; font-weight: 500; cursor: pointer; margin-top: 10px; transition: all 0.3s ease;';
            readMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openNewsDetail(newsId);
            });
            tagsContainer.appendChild(readMoreBtn);
        }
        
        // Делаем всю карточку кликабельной
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            openNewsDetail(newsId);
        });
    });
    
    // Закрытие модального окна при клике на backdrop
    const modal = document.getElementById('news-detail-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeNewsDetail();
            }
        });
    }
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeNewsDetail();
        }
    });
});

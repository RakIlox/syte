/**
 * TestModal - Модальное окно теста для проверки знаний
 * Порог прохождения: 80%
 */

class TestModal {
    constructor() {
        this.modalId = 'test-modal';
        this.activeChapter = null;
        this.currentQuestion = 0;
        this.answers = {};
        this.questions = [];
        
        this.tests = {
            chapter1: {
                title: 'Тест по главе 1: Основы безопасности',
                description: 'Проверьте свои знания основ кибербезопасности',
                passingScore: 80,
                questions: [
                    {
                        id: 'q1',
                        question: 'Что такое DDoS-атака?',
                        options: [
                            'Вирус, который крадёт пароли',
                            'Массовая атака на сервер, перегружающая его запросами',
                            'Фишинговое письмо',
                            'Взлом через Wi-Fi'
                        ],
                        correct: 1,
                        explanation: 'DDoS (Distributed Denial of Service) — это атака, при которой множество компьютеров одновременно отправляют запросы на сервер, перегружая его и делая недоступным.'
                    },
                    {
                        id: 'q2',
                        question: 'Какой пароль считается надёжным?',
                        options: [
                            '123456',
                            'Имя вашего питомца',
                            'Пароль длиной 12+ символов с буквами, цифрами и спецсимволами',
                            'Дата вашего рождения'
                        ],
                        correct: 2,
                        explanation: 'Надёжный пароль должен быть длинным (минимум 12 символов) и содержать разные типы символов: буквы (верхний и нижний регистр), цифры и специальные символы.'
                    },
                    {
                        id: 'q3',
                        question: 'Что такое фишинг?',
                        options: [
                            'Ловля рыбы в интернете',
                            'Вид мошенничества с поддельными сайтами и письмами',
                            'Программа для взлома паролей',
                            'Вирус-шифровальщик'
                        ],
                        correct: 1,
                        explanation: 'Фишинг — это метод мошенничества, при котором злоумышленники создают поддельные сайты и письма, чтобы заставить жертву раскрыть конфиденциальные данные.'
                    },
                    {
                        id: 'q4',
                        question: 'Что такое двухфакторная аутентификация (2FA)?',
                        options: [
                            'Два пароля от одного аккаунта',
                            'Подтверждение личности двумя способами (например, пароль + код из SMS)',
                            'Двухуровневая защита антивирусом',
                            'Шифрование данных двумя ключами'
                        ],
                        correct: 1,
                        explanation: '2FA — это метод защиты, при котором для подтверждения личности нужно использовать два разных фактора: что вы знаете (пароль) и что у вас есть (телефон, приложение).'
                    },
                    {
                        id: 'q5',
                        question: 'Как защититься от вирусов-вымогателей (ransomware)?',
                        options: [
                            'Установить VPN',
                            'Регулярно делать резервные копии файлов',
                            'Использовать прокси-сервер',
                            'Отключить антивирус для ускорения'
                        ],
                        correct: 1,
                        explanation: 'Резервные копии — лучшая защита от вымогателей. Если ваши файлы зашифрованы, вы можете восстановить их из бэкапа.'
                    },
                    {
                        id: 'q6',
                        question: 'Что такое VPN?',
                        options: [
                            'Антивирусная программа',
                            'Технология для создания защищённого интернет-соединения',
                            'Браузер для анонимного сёрфинга',
                            'Пароль от Wi-Fi'
                        ],
                        correct: 1,
                        explanation: 'VPN (Virtual Private Network) создаёт защищённый туннель между вашим устройством и интернетом, шифруя весь трафик.'
                    },
                    {
                        id: 'q7',
                        question: 'Какой из этих признаков указывает на фишинговое письмо?',
                        options: [
                            'Письмо от известной компании',
                            'Срочный призыв перейти по ссылке и ввести данные',
                            'Письмо на русском языке',
                            'Наличие логотипа компании'
                        ],
                        correct: 1,
                        explanation: 'Мошенники часто создают срочность, чтобы жертва не успела задуматься. Настоящие организации не просят срочно вводить данные по ссылке.'
                    },
                    {
                        id: 'q8',
                        question: 'Что такое социальная инженерия?',
                        options: [
                            'Программирование социальных сетей',
                            'Метод обмана людей для получения информации',
                            'Создание фейковых аккаунтов',
                            'Взлом через уязвимости в соцсетях'
                        ],
                        correct: 1,
                        explanation: 'Социальная инженерия — это манипулирование людьми с целью заставить их раскрыть конфиденциальную информацию или выполнить определённые действия.'
                    },
                    {
                        id: 'q9',
                        question: 'Почему опасно использовать публичный Wi-Fi без VPN?',
                        options: [
                            'Wi-Fi всегда платный в публичных местах',
                            'Хакеры могут перехватывать ваш трафик',
                            'Публичный Wi-Fi медленный',
                            'Он автоматически сохраняет пароли'
                        ],
                        correct: 1,
                        explanation: 'В открытых сетях хакеры могут перехватывать данные между вашим устройством и интернетом. VPN шифрует трафик, делая его недоступным для перехвата.'
                    },
                    {
                        id: 'q10',
                        question: 'Какой из этих способов защиты пароля самый эффективный?',
                        options: [
                            'Использовать один сложный пароль везде',
                            'Записать пароль на бумажке',
                            'Использовать разные пароли для разных сайтов + менеджер паролей',
                            'Менять пароль каждый день'
                        ],
                        correct: 2,
                        explanation: 'Менеджер паролей позволяет использовать уникальные сложные пароли для каждого сайта, не запоминая их все.'
                    }
                ]
            },
            chapter2: {
                title: 'Тест по главе 2: Продвинутая защита',
                description: 'Проверьте свои знания по продвинутым методам защиты',
                passingScore: 80,
                questions: [
                    {
                        id: 'q1',
                        question: 'Что такое сквозное шифрование?',
                        options: [
                            'Шифрование только на сервере',
                            'Шифрование, при котором сообщения могут расшифровать только отправитель и получатель',
                            'Шифрование файлов на диске',
                            'Защита паролей в браузере'
                        ],
                        correct: 1,
                        explanation: 'При сквозном (end-to-end) шифровании сообщения шифруются на устройстве отправителя и расшифровываются только на устройстве получателя. Даже сервис не может их прочитать.'
                    },
                    {
                        id: 'q2',
                        question: 'Что такое холодный кошелёк для криптовалют?',
                        options: [
                            'Кошелёк с небольшим количеством криптовалюты',
                            'Кошелёк, не подключённый к интернету',
                            'Бесплатный криптокошелёк',
                            'Кошелёк на бирже'
                        ],
                        correct: 1,
                        explanation: 'Холодный кошелёк — это аппаратное устройство или бумажный кошелёк, который не подключён к интернету и считается наиболее безопасным способом хранения криптовалюты.'
                    },
                    {
                        id: 'q3',
                        question: 'Что такое груминг в интернете?',
                        options: [
                            'Установка вредоносных программ',
                            'Манипуляции взрослого для установления доверительных отношений с ребёнком',
                            'Кража личных данных',
                            'Фишинг в социальных сетях'
                        ],
                        correct: 1,
                        explanation: 'Груминг — это процесс, при котором взрослый манипулирует ребёнком, чтобы установить доверительные отношения и впоследствии подвергнуть его насилию или эксплуатации.'
                    },
                    {
                        id: 'q4',
                        question: 'Какое правило нужно соблюдать при создании бэкапов?',
                        options: [
                            'Хранить бэкап в том же месте, что и оригинальные файлы',
                            'Правило 3-2-1: 3 копии, 2 разных носителя, 1 копия в другом месте',
                            'Делать бэкап только один раз',
                            'Хранить бэкап на рабочем столе'
                        ],
                        correct: 1,
                        explanation: 'Правило 3-2-1 обеспечивает надёжность: минимум 3 копии данных, на 2 разных носителях, причём 1 копия хранится в другом месте (например, в облаке).'
                    },
                    {
                        id: 'q5',
                        question: 'Что такое анонимность в интернете?',
                        options: [
                            'Использование VPN',
                            'Невозможность идентифицировать пользователя в сети',
                            'Скрытие только IP-адреса',
                            'Использование режима инкогнито'
                        ],
                        correct: 1,
                        explanation: 'Анонимность означает, что вас нельзя идентифицировать в интернете. Это комплексная защита, включающая скрытие IP, cookies, отпечатков браузера и других данных.'
                    },
                    {
                        id: 'q6',
                        question: 'Почему IoT-устройства считаются небезопасными?',
                        options: [
                            'Они слишком дорогие',
                            'Часто имеют слабую защиту и уязвимости',
                            'Их нельзя обновить',
                            'Они потребляют много электричества'
                        ],
                        correct: 1,
                        explanation: 'IoT-устройства часто выпускаются с минимальной безопасностью: стандартные пароли, отсутствие обновлений, уязвимости в прошивке. Это делает их лёгкой мишенью для хакеров.'
                    },
                    {
                        id: 'q7',
                        question: 'Что такое аппаратный ключ безопасности (2FA)?',
                        options: [
                            'Физическое устройство для подтверждения входа',
                            'Программа для генерации кодов',
                            'Пароль на флешке',
                            'Смс-код от банка'
                        ],
                        correct: 0,
                        explanation: 'Аппаратный ключ (например, YubiKey) — это физическое устройство, которое подключается к компьютеру или телефону и подтверждает вашу личность.'
                    },
                    {
                        id: 'q8',
                        question: 'Какой тип аутентификации самый безопасный для 2FA?',
                        options: [
                            'SMS-код',
                            'Приложение-аутентификатор (TOTP)',
                            'Аппаратный ключ безопасности',
                            'Email-код'
                        ],
                        correct: 2,
                        explanation: 'Аппаратные ключи — самый безопасный метод, так как физическое устройство невозможно перехватить удалённо (в отличие от SMS или email).'
                    },
                    {
                        id: 'q9',
                        question: 'Что такое SIM-swap атака?',
                        options: [
                            'Замена SIM-карты жертвы для перехвата SMS',
                            'Клонирование SIM-карты',
                            'Вирус, заражающий SIM-карты',
                            'Кража телефона с SIM-картой'
                        ],
                        correct: 0,
                        explanation: 'SIM-swap — это когда мошенник убеждает оператора перевести ваш номер на его SIM-карту, получая таким образом доступ к SMS-кодам.'
                    },
                    {
                        id: 'q10',
                        question: 'Какой уровень безопасности лучше выбрать для домашней Wi-Fi сети?',
                        options: [
                            'WEP',
                            'WPA',
                            'WPA2 или WPA3',
                            'Без шифрования для скорости'
                        ],
                        correct: 2,
                        explanation: 'WPA2 и WPA3 обеспечивают надёжное шифрование. WEP и WPA устарели и легко взламываются.'
                    }
                ]
            },
            chapter3: {
                title: 'Тест по главе 3: Теория информационной безопасности',
                description: 'Проверьте свои знания теоретических основ ТИБ',
                passingScore: 80,
                questions: [
                    {
                        id: 'q1',
                        question: 'Что включает в себя триада CIA информационной безопасности?',
                        options: [
                            'Конфиденциальность, Целостность, Доступность',
                            'Контроль, Изоляция, Аутентификация',
                            'Криптография, Инфраструктура, Архитектура',
                            'Классы, Идентификация, Аудит'
                        ],
                        correct: 0,
                        explanation: 'Триада CIA — это три главных свойства безопасности: Confidentiality (конфиденциальность), Integrity (целостность), Availability (доступность).'
                    },
                    {
                        id: 'q2',
                        question: 'Что такое уязвимость в системе безопасности?',
                        options: [
                            'Активное действие хакера',
                            'Слабость в системе, которую можно использовать для атаки',
                            'Вирус в системе',
                            'Ошибка пользователя'
                        ],
                        correct: 1,
                        explanation: 'Уязвимость — это недостаток или слабость в системе, которая может быть использована злоумышленником для нарушения безопасности.'
                    },
                    {
                        id: 'q3',
                        question: 'Что такое модель нарушителя в ТИБ?',
                        options: [
                            'База данных известных хакеров',
                            'Описание потенциального злоумышленника: его цели, возможности и методы',
                            'Программа для поимки нарушителей',
                            'Закон о кибербезопасности'
                        ],
                        correct: 1,
                        explanation: 'Модель нарушителя — это формализованное описание потенциального злоумышленника, включающее его квалификацию, мотивацию, доступ к ресурсам и методы атак.'
                    },
                    {
                        id: 'q4',
                        question: 'Какой тип угрозы считается «естественной» угрозой?',
                        options: [
                            'Действия хакеров',
                            'Пожар, наводнение, землетрясение',
                            'Ошибки сотрудников',
                            'Вирусы и вредоносное ПО'
                        ],
                        correct: 1,
                        explanation: 'Естественные угрозы вызываются природными явлениями: пожар, наводнение, землетрясение, гроза и т.д. Искусственные угрозы — результат действий людей.'
                    },
                    {
                        id: 'q5',
                        question: 'Что такое дискреционная модель управления доступом?',
                        options: [
                            'Доступ определяется системой по уровням секретности',
                            'Владелец объекта сам решает, кто может получить доступ',
                            'Доступ по ролям пользователей',
                            'Доступ по времени суток'
                        ],
                        correct: 1,
                        explanation: 'В дискреционной модели (например, HRU) права доступа определяются владельцем ресурса. Субъект может передавать свои права другим.'
                    },
                    {
                        id: 'q6',
                        question: 'Что такое мандатная модель управления доступом?',
                        options: [
                            'Доступ по ролям',
                            'Доступ определяется системой на основе уровней допуска',
                            'Доступ по решению администратора',
                            'Случайный доступ'
                        ],
                        correct: 1,
                        explanation: 'В мандатной модели (например, Белла-Лападулы) система строго определяет доступ на основе уровней секретности субъектов и объектов. Пользователь не может передать свои права.'
                    },
                    {
                        id: 'q7',
                        question: 'Какое правило описывает модель Белла-Лападулы?',
                        options: [
                            'Чтение только сверху вниз, запись только снизу вверх',
                            'Чтение только снизу вверх, запись только сверху вниз',
                            'Свободный доступ для чтения и записи',
                            'Доступ только по паролю'
                        ],
                        correct: 0,
                        explanation: 'Модель Белла-Лападулы имеет два правила: простое свойство (чтение только с уровнем ≤ своему) и *-свойство (запись только с уровнем ≥ своему).'
                    },
                    {
                        id: 'q8',
                        question: 'Что такое политика безопасности?',
                        options: [
                            'Антивирусная программа',
                            'Совокупность правил и принципов защиты информации',
                            'Закон о защите данных',
                            'Пароль от системы'
                        ],
                        correct: 1,
                        explanation: 'Политика безопасности — это документ, определяющий правила и принципы защиты информации в организации.'
                    },
                    {
                        id: 'q9',
                        question: 'Что такое несанкционированный доступ (НСД)?',
                        options: [
                            'Доступ к информации в нарушение установленных правил',
                            'Доступ без пароля',
                            'Хакерская атака',
                            'Вирус в системе'
                        ],
                        correct: 0,
                        explanation: 'Несанкционированный доступ — это получение доступа к информации лицом, не имеющим на это права согласно установленным правилам.'
                    },
                    {
                        id: 'q10',
                        question: 'Что такое целостность информации?',
                        options: [
                            'Информация доступна только авторизованным пользователям',
                            'Информация верна, полна и не была изменена без разрешения',
                            'Информация доступна в нужный момент',
                            'Информация зашифрована'
                        ],
                        correct: 1,
                        explanation: 'Целостность — это свойство информации, означающее её достоверность и неизменность. Данные должны быть защищены от несанкционированной модификации.'
                    },
                    {
                        id: 'q11',
                        question: 'Что такое модель Кларка-Вильсона?',
                        options: [
                            'Модель для криптовалют',
                            'Модель контроля целостности данных в бизнес-процессах',
                            'Модель сетевой безопасности',
                            'Модель парольной защиты'
                        ],
                        correct: 1,
                        explanation: 'Модель Кларка-Вильсона ориентирована на обеспечение целостности данных в бизнес-процессах через правильно сформированные транзакции и разделение обязанностей.'
                    }
                ]
            }
        };
        
        this.init();
    }

    // Инициализация модального окна
    init() {
        // Создаём модальное окно в DOM
        this.createModal();
        
        // Привязываем события
        this.bindEvents();
    }

    // Создание HTML модального окна
    createModal() {
        const modalHTML = `
            <div id="${this.modalId}" class="test-modal-overlay">
                <div class="test-modal">
                    <div class="test-modal-header">
                        <div class="test-modal-title-wrap">
                            <h3 id="test-title">Тест по главе</h3>
                            <p id="test-description"></p>
                        </div>
                        <button class="test-modal-close">&times;</button>
                    </div>
                    
                    <div class="test-progress">
                        <div class="test-progress-bar">
                            <div class="test-progress-fill" id="test-progress-fill"></div>
                        </div>
                        <span id="test-progress-text">Вопрос 1 из 10</span>
                    </div>
                    
                    <div class="test-content" id="test-content">
                        <!-- Вопросы будут добавлены динамически -->
                    </div>
                    
                    <div class="test-results" id="test-results" style="display: none;">
                        <div class="test-results-icon" id="test-results-icon"></div>
                        <h3 id="test-results-title"></h3>
                        <div class="test-score">
                            <span id="test-score-value">0</span>
                            <span class="test-score-max">/ 100</span>
                        </div>
                        <p id="test-results-message"></p>
                        <div class="test-actions">
                            <button class="btn btn-primary" id="btn-retry-test">
                                <i class="fas fa-redo"></i> Попробовать снова
                            </button>
                            <button class="btn btn-secondary" id="btn-close-results">
                                <i class="fas fa-times"></i> Закрыть
                            </button>
                        </div>
                    </div>
                    
                    <div class="test-footer">
                        <button class="btn btn-secondary" id="btn-prev" style="visibility: hidden;">
                            <i class="fas fa-arrow-left"></i> Назад
                        </button>
                        <button class="btn btn-primary" id="btn-next">
                            Далее <i class="fas fa-arrow-right"></i>
                        </button>
                        <button class="btn btn-success" id="btn-finish" style="display: none;">
                            <i class="fas fa-check"></i> Завершить тест
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Привязка событий
    bindEvents() {
        const modal = document.getElementById(this.modalId);
        if (!modal) return;
        
        // Закрытие модального окна
        modal.querySelector('.test-modal-close').addEventListener('click', () => this.close());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.close();
        });
        
        // Кнопки навигации
        document.getElementById('btn-prev').addEventListener('click', () => this.prevQuestion());
        document.getElementById('btn-next').addEventListener('click', () => this.nextQuestion());
        document.getElementById('btn-finish').addEventListener('click', () => this.finishTest());
        
        // Кнопки результатов
        document.getElementById('btn-retry-test').addEventListener('click', () => this.retryTest());
        document.getElementById('btn-close-results').addEventListener('click', () => this.close());
        
        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    // Открыть тест для главы
    open(chapterId) {
        if (!this.tests[chapterId]) {
            console.error('Тест не найден для главы:', chapterId);
            return false;
        }
        
        this.activeChapter = chapterId;
        this.questions = this.tests[chapterId].questions;
        this.currentQuestion = 0;
        this.answers = {};
        
        // Настройка заголовка
        const test = this.tests[chapterId];
        document.getElementById('test-title').textContent = test.title;
        document.getElementById('test-description').textContent = test.description;
        
        // Скрыть результаты, показать контент
        document.getElementById('test-results').style.display = 'none';
        document.getElementById('test-content').style.display = 'block';
        document.getElementById('test-footer').style.display = 'flex';
        
        // Показать модальное окно
        document.getElementById(this.modalId).classList.add('active');
        
        // Рендер первого вопроса
        this.renderQuestion();
        this.updateProgress();
        
        return true;
    }

    // Закрыть модальное окно
    close() {
        document.getElementById(this.modalId).classList.remove('active');
        this.activeChapter = null;
    }

    // Рендер текущего вопроса
    renderQuestion() {
        const question = this.questions[this.currentQuestion];
        const content = document.getElementById('test-content');
        
        const optionsHTML = question.options.map((option, index) => {
            const isSelected = this.answers[question.id] === index;
            return `
                <div class="test-option ${isSelected ? 'selected' : ''}" data-index="${index}">
                    <div class="option-indicator"></div>
                    <span class="option-text">${option}</span>
                </div>
            `;
        }).join('');
        
        content.innerHTML = `
            <div class="test-question">
                <h4>${question.question}</h4>
                <div class="test-options">
                    ${optionsHTML}
                </div>
            </div>
        `;
        
        // Привязка событий к вариантам ответа
        content.querySelectorAll('.test-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectAnswer(parseInt(option.dataset.index));
            });
        });
        
        this.updateButtons();
    }

    // Выбор ответа
    selectAnswer(index) {
        const question = this.questions[this.currentQuestion];
        this.answers[question.id] = index;
        
        // Визуальное обновление
        document.querySelectorAll('.test-option').forEach((opt, i) => {
            opt.classList.toggle('selected', i === index);
        });
        
        this.updateButtons();
    }

    // Переход к следующему вопросу
    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
            this.updateProgress();
        }
    }

    // Переход к предыдущему вопросу
    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
            this.updateProgress();
        }
    }

    // Обновление прогресс-бара
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        document.getElementById('test-progress-fill').style.width = progress + '%';
        document.getElementById('test-progress-text').textContent = 
            `Вопрос ${this.currentQuestion + 1} из ${this.questions.length}`;
    }

    // Обновление кнопок навигации
    updateButtons() {
        const prevBtn = document.getElementById('btn-prev');
        const nextBtn = document.getElementById('btn-next');
        const finishBtn = document.getElementById('btn-finish');
        const question = this.questions[this.currentQuestion];
        const hasAnswer = this.answers[question.id] !== undefined;
        
        prevBtn.style.visibility = this.currentQuestion > 0 ? 'visible' : 'hidden';
        
        if (this.currentQuestion === this.questions.length - 1) {
            nextBtn.style.display = 'none';
            finishBtn.style.display = hasAnswer ? 'block' : 'none';
        } else {
            nextBtn.style.display = 'block';
            finishBtn.style.display = 'none';
        }
        
        nextBtn.disabled = !hasAnswer;
        nextBtn.style.opacity = hasAnswer ? '1' : '0.5';
    }

    // Завершение теста и подсчёт результатов
    finishTest() {
        let correct = 0;
        const results = [];
        
        this.questions.forEach((question, index) => {
            const userAnswer = this.answers[question.id];
            const isCorrect = userAnswer === question.correct;
            
            if (isCorrect) correct++;
            
            results.push({
                question: question.question,
                userAnswer: question.options[userAnswer],
                correctAnswer: question.options[question.correct],
                isCorrect: isCorrect,
                explanation: question.explanation
            });
        });
        
        const score = Math.round((correct / this.questions.length) * 100);
        const test = this.tests[this.activeChapter];
        const passed = score >= test.passingScore;
        
        // Сохраняем результат
        progressManager.saveTestResult(this.activeChapter, score, passed);
        
        // Показываем результаты
        this.showResults(score, passed, correct, results);
        
        // Отправляем событие для обновления UI
        document.dispatchEvent(new CustomEvent('testCompleted', {
            detail: {
                chapter: this.activeChapter,
                score: score,
                passed: passed
            }
        }));
    }

    // Показ экрана результатов
    showResults(score, passed, correct, results) {
        document.getElementById('test-content').style.display = 'none';
        document.getElementById('test-footer').style.display = 'none';
        document.getElementById('test-results').style.display = 'block';
        
        const resultsIcon = document.getElementById('test-results-icon');
        const resultsTitle = document.getElementById('test-results-title');
        const resultsMessage = document.getElementById('test-results-message');
        
        if (passed) {
            resultsIcon.innerHTML = '<i class="fas fa-trophy"></i>';
            resultsIcon.style.color = '#10b981';
            resultsTitle.textContent = 'Поздравляем!';
            resultsMessage.textContent = `Вы успешно сдали тест! Теперь доступна следующая глава.`;
        } else {
            resultsIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
            resultsIcon.style.color = '#ef4444';
            resultsTitle.textContent = 'Тест не сдан';
            resultsMessage.textContent = `Нужно набрать минимум ${this.tests[this.activeChapter].passingScore}%. Попробуйте ещё раз.`;
        }
        
        document.getElementById('test-score-value').textContent = score;
        document.getElementById('test-score-value').style.color = passed ? '#10b981' : '#ef4444';
        
        // Показать детали ответов
        this.showAnswerDetails(results);
    }

    // Показать детали ответов
    showAnswerDetails(results) {
        const resultsEl = document.getElementById('test-results');
        
        const detailsHTML = results.map((r, i) => `
            <div class="answer-detail ${r.isCorrect ? 'correct' : 'incorrect'}">
                <div class="answer-header">
                    <span class="answer-number">${i + 1}</span>
                    <span class="answer-status">
                        <i class="fas ${r.isCorrect ? 'fa-check' : 'fa-times'}"></i>
                        ${r.isCorrect ? 'Правильно' : 'Неправильно'}
                    </span>
                </div>
                <p class="answer-question">${r.question}</p>
                <p class="answer-your">Ваш ответ: ${r.userAnswer}</p>
                ${!r.isCorrect ? `<p class="answer-correct">Правильный ответ: ${r.correctAnswer}</p>` : ''}
                <p class="answer-explanation"><i class="fas fa-info-circle"></i> ${r.explanation}</p>
            </div>
        `).join('');
        
        // Добавляем контейнер для деталей
        let detailsContainer = resultsEl.querySelector('.answer-details');
        if (!detailsContainer) {
            detailsContainer = document.createElement('div');
            detailsContainer.className = 'answer-details';
            resultsEl.insertBefore(detailsContainer, resultsEl.querySelector('.test-actions'));
        }
        detailsContainer.innerHTML = `
            <h4>Разбор ответов:</h4>
            ${detailsHTML}
        `;
    }

    // Повторить тест
    retryTest() {
        this.answers = {};
        this.currentQuestion = 0;
        
        document.getElementById('test-results').style.display = 'none';
        document.getElementById('test-content').style.display = 'block';
        document.getElementById('test-footer').style.display = 'flex';
        
        this.renderQuestion();
        this.updateProgress();
    }

    // Проверить, доступен ли тест для главы
    isTestAvailable(chapterId, totalLessons) {
        return progressManager.isTestAvailable(chapterId, totalLessons);
    }
}

// Создаём глобальный экземпляр
const testModal = new TestModal();


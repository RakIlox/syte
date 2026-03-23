/**
 * Fisher-Yates shuffle algorithm for randomizing arrays
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Shuffle answers while tracking correct index
 */
function shuffleAnswers(question) {
    const answers = question.a.map((text, index) => ({
        text,
        isCorrect: index === question.c
    }));
    const shuffledAnswers = shuffleArray(answers);
    
    // Find new correct index
    const newCorrectIndex = shuffledAnswers.findIndex(a => a.isCorrect);
    
    return {
        ...question,
        shuffledAnswers,
        correctIndex: newCorrectIndex
    };
}

/**
 * Глава 1-3: Основы безопасности (30 вопросов)
 */
const test1Questions = [
    // Глава 1 - Основы безопасности (10 уроков)
    {q: 'Что означает аббревиатура DDoS?', a: ['Digital Denial of Service', 'Distributed Denial of Service', 'Direct Denial of Service', 'Dynamic Denial of Service'], c: 1, e: 'DDoS = Distributed Denial of Service — распределённый отказ в обслуживании.', chapter: 1},
    {q: 'Что такое фишинг?', a: ['Вирус для рыб', 'Интернет-мошенничество для кражи данных', 'Тип шифрования', 'Антивирусная программа'], c: 1, e: 'Фишинг — это мошенничество для кражи данных через поддельные сайты и письма.', chapter: 1},
    {q: 'Какой пароль считается надёжным?', a: ['123456', 'Ваше имя + год рождения', 'Пароль из 12+ символов с разными регистрами', 'Дата рождения'], c: 2, e: 'Надёжный пароль содержит минимум 12 символов, цифры, буквы разного регистра и спецсимволы.', chapter: 1},
    {q: 'Что такое вишинг?', a: ['Фишинг через email', 'Фишинг через звонки', 'Фишинг через SMS', 'Фишинг в соцсетях'], c: 1, e: 'Вишинг — это телефонное мошенничество (голосовой фишинг).', chapter: 1},
    {q: 'Что такое социальная инженерия?', a: ['Обучение в соцсетях', 'Манипуляции для получения информации', 'Программирование на Python', 'Сетевой протокол'], c: 1, e: 'Социальная инженерия — это манипулирование людьми для получения конфиденциальной информации.', chapter: 1},
    {q: 'Что такое ботнет?', a: ['Сеть роботов', 'Сеть заражённых компьютеров', 'Сеть серверов', 'Сеть Wi-Fi'], c: 1, e: 'Ботнет — это сеть компьютеров, заражённых вредоносным ПО и управляемых злоумышленником.', chapter: 1},
    {q: 'Какой порт по умолчанию использует HTTP?', a: ['21', '22', '80', '443'], c: 2, e: 'HTTP по умолчанию работает на порту 80.', chapter: 1},
    {q: 'Что такое VPN?', a: ['Вирусный номер программы', 'Виртуальная частная сеть', 'Новый пароль входа', 'Вредоносная программа'], c: 1, e: 'VPN создаёт защищённое зашифрованное соединение через интернет.', chapter: 1},
    {q: 'Для чего нужен бэкап?', a: ['Для ускорения интернета', 'Для создания резервных копий', 'Для шифрования данных', 'Для анонимности'], c: 1, e: 'Бэкап (backup) — это резервная копия данных для защиты от потери.', chapter: 1},
    {q: 'Что такое программа-вымогатель (ransomware)?', a: ['Антивирус', 'Вредоносное ПО, шифрующее файлы', 'Брандмауэр', 'Программа для очистки системы'], c: 1, e: 'Ransomware шифрует файлы и требует выкуп за расшифровку.', chapter: 1},
    
    // Глава 2 - Продвинутая защита (10 уроков)
    {q: 'Что такое 2FA?', a: ['Двухфакторная аутентификация', 'Два файла антивируса', 'Два пароля', 'Два сервера'], c: 0, e: '2FA (Two-Factor Authentication) — это дополнительный уровень защиты с кодом из SMS или приложения.', chapter: 2},
    {q: 'Какой тип шифрования использует публичный и приватный ключи?', a: ['Симметричное', 'Асимметричное', 'Одноразовое', 'Поточное'], c: 1, e: 'Асимметричное шифрование использует пару ключей: публичный для шифрования, приватный для расшифровки.', chapter: 2},
    {q: 'Что такое seed-фраза в криптовалютах?', a: ['Пароль от биржи', '12-24 слова для восстановления кошелька', 'Номер кошелька', 'Код транзакции'], c: 1, e: 'Seed-фраза — это 12-24 слова, восстанавливающие доступ к криптокошельку.', chapter: 2},
    {q: 'Почему IoT-устройства считаются небезопасными?', a: ['Они слишком дорогие', 'Часто имеют пароли по умолчанию и уязвимости', 'Их невозможно взломать', 'Они не подключаются к интернету'], c: 1, e: '70% IoT-устройств имеют уязвимости из-за паролей по умолчанию и отсутствия обновлений.', chapter: 2},
    {q: 'Что такое груминг?', a: ['Установка родительского контроля', 'Манипуляции взрослого для эксплуатации ребёнка', 'Вирус для детей', 'Тип пароля'], c: 1, e: 'Груминг — это процесс манипуляции ребёнком для последующей эксплуатации.', chapter: 2},
    {q: 'Какое правило нужно соблюдать при создании бэкапов?', a: ['Делать бэкап раз в год', 'Правило 3-2-1: 3 копии, 2 носителя, 1 в другом месте', 'Хранить бэкап на рабочем столе', 'Достаточно одной копии'], c: 1, e: 'Правило 3-2-1 обеспечивает надёжность данных при любых сбоях.', chapter: 2},
    {q: 'Какие уровни анонимности существуют?', a: ['Только Tor', 'Базовый, средний, высокий, максимальный', 'Анонимность невозможна', 'Только режим инкогнито'], c: 1, e: 'Уровни: базовый (VPN), средний (отдельные профили), высокий (Tor), максимальный (физическая изоляция).', chapter: 2},
    {q: 'Что такое SIM-swap атака?', a: ['Замена SIM для перехвата SMS 2FA', 'Вирус на SIM-карте', 'Клонирование SIM через Bluetooth', 'Кража SIM-карты'], c: 0, e: 'SIM-swap — это когда мошенник переводит ваш номер на свою SIM для перехвата кодов.', chapter: 2},
    {q: 'Какие виды фишинга существуют?', a: ['Только email', 'Email, spear, smishing, vishing, whaling, клонирование', 'Только SMS', 'Только звонки'], c: 1, e: '6 типов: классический email, spear phishing (целевой), smishing (SMS), vishing (голос), whaling (руководители), клонирование.', chapter: 2},
    {q: 'Что такое холодный кошелёк?', a: ['Бесплатный кошелёк', 'Не подключён к интернету (аппаратный/бумажный)', 'Кошелёк для холодной валюты', 'Кошелёк без пароля'], c: 1, e: 'Холодный кошелёк не подключён к интернету, что делает его неуязвимым для онлайн-атак.', chapter: 2},

    // Глава 3 - Теория ИБ (10 уроков)
    {q: 'Что изучает дисциплина ТИБ?', a: ['Только установку антивирусов', 'Защиту информации от угроз', 'Только программирование', 'Только законодательство'], c: 1, e: 'ТИБ изучает угрозы и методы защиты информации.', chapter: 3},
    {q: 'Какие виды тайны информации существуют в РФ?', a: ['Только государственная', 'Государственная, коммерческая, профессиональная, персональные данные', 'Только персональные', 'Только коммерческая'], c: 1, e: 'В РФ: гос.тайна, коммерческая, профессиональная (врачебная, адвокатская) и персональные данные.', chapter: 3},
    {q: 'Как классифицируются угрозы по источнику?', a: ['Только внешние', 'Внешние и внутренние', 'Только от природных катастроф', 'Только от вирусов'], c: 1, e: 'Угрозы бывают внешние (извне) и внутренние (от сотрудников).', chapter: 3},
    {q: 'Что такое уязвимость?', a: ['Атака хакера', 'Слабость в системе, используемая для атаки', 'Устаревшее ПО', 'Слабый пароль'], c: 1, e: 'Уязвимость — недостаток в системе, используемый для нарушения безопасности.', chapter: 3},
    {q: 'Что включает модель нарушителя?', a: ['Только фотографию', 'Тип, квалификация, мотивация', 'Только IP-адрес', 'Только имя'], c: 1, e: 'Модель нарушителя включает: тип (внешний/внутренний), квалификация, мотивация.', chapter: 3},
    {q: 'Что такое политика безопасности?', a: ['Антивирус', 'Совокупность правил защиты информации', 'Закон о защите данных', 'Пароль от системы'], c: 1, e: 'Политика безопасности — документ с правилами защиты информации.', chapter: 3},
    {q: 'Что описывает модель HRU?', a: ['Доступ определяется системой', 'Владелец объекта сам определяет права доступа', 'Доступ по ролям', 'Случайный доступ'], c: 1, e: 'Модель HRU — дискреционная, где владелец объекта определяет права.', chapter: 3},
    {q: 'Какие правила описывает модель Белла-Лападулы?', a: ['Свободный доступ', 'Простое свойство (чтение ≤) и *-свойство (запись ≥)', 'Доступ по паролю', 'Доступ только для админа'], c: 1, e: 'Модель Белла-Лападулы: читать можно только данные с уровнем ≤ своему, записывать — с уровнем ≥ своему.', chapter: 3},
    {q: 'Какие модели контроля целостности существуют?', a: ['Только антивирус', 'Модель Биба и Кларк-Вильсона', 'Только бэкап', 'Только шифрование'], c: 1, e: 'Модели целостности: Биба (мандатная) и Кларк-Вильсона (процедурная).', chapter: 3},
    {q: 'Что такое НСД?', a: ['Незаконный системный доступ', 'Несанкционированный доступ', 'Нормативный доступ', 'Новый сетевой драйвер'], c: 1, e: 'НСД — это несанкционированный доступ к информации или системам.', chapter: 3}
];

/**
 * Глава 4-7: Продвинутые техники (35 вопросов)
 */
const test2Questions = [
    // Глава 4 - Безопасность на практике (9 уроков)
    {q: 'Что такое архитектура безопасности?', a: ['Дизайн здания', 'Проектирование защищённых IT-систем', 'Установка замков', 'Покупка антивируса'], c: 1, e: 'Архитектура безопасности — это проектирование систем с учётом защиты на всех уровнях.', chapter: 4},
    {q: 'Что такое криптография?', a: ['Изучение тайных языков', 'Наука о методах обеспечения конфиденциальности', 'Программирование шифров', 'Взлом паролей'], c: 1, e: 'Криптография — это наука о методах обеспечения конфиденциальности, целостности и аутентичности.', chapter: 4},
    {q: 'Что такое управление уязвимостями?', a: ['Удаление вирусов', 'Сканирование и оценка рисков уязвимостей', 'Установка обновлений', 'Создание паролей'], c: 1, e: 'Управление уязвимостями включает: обнаружение, оценку, приоритизацию и устранение уязвимостей.', chapter: 4},
    {q: 'Что такое сетевой мониторинг?', a: ['Наблюдение за сотрудниками', 'Анализ сетевого трафика в реальном времени', 'Проверка паролей', 'Установка firewall'], c: 1, e: 'Сетевой мониторинг — это анализ трафика для обнаружения аномалий и угроз.', chapter: 4},
    {q: 'Что такое EDR?', a: ['Загрузка системы', 'Endpoint Detection and Response — обнаружение на хостах', 'Шифрование диска', 'Удаление файлов'], c: 1, e: 'EDR (Endpoint Detection and Response) — технология обнаружения и реагирования на угрозы на конечных устройствах.', chapter: 4},
    {q: 'Что такое SOAR?', a: ['Звуковой сигнал', 'Security Orchestration, Automation and Response — автоматизация SOC', 'Тип вируса', 'Программа для backup'], c: 1, e: 'SOAR автоматизирует процессы реагирования на инциденты в центре мониторинга.', chapter: 4},
    {q: 'Что такое SecOps?', a: ['Безопасность операций', 'Security + Operations — интеграция безопасности в IT-операции', 'Тип атаки', 'Вид firewall'], c: 1, e: 'SecOps — это интеграция практик безопасности в IT-операции для ускорения обнаружения угроз.', chapter: 4},
    {q: 'Что такое аудит и комплаенс?', a: ['Проверка соответствия требованиям', 'Установка антивируса', 'Создание паролей', 'Удаление файлов'], c: 1, e: 'Аудит и комплаенс — это проверка соответствия системы стандартам и требованиям.', chapter: 4},
    {q: 'Что такое моделирование угроз на практике?', a: ['Создание угроз', 'Систематический анализ потенциальных угроз для системы', 'Взлом системы', 'Установка firewall'], c: 1, e: 'Моделирование угроз — это анализ возможных атак на систему для определения защиты.', chapter: 4},

    // Глава 5 - Анализ и расследование (5 уроков)
    {q: 'Что такое анализ вредоносного ПО?', a: ['Создание вирусов', 'Изучение поведения и кода вредоносных программ', 'Удаление вирусов', 'Установка антивируса'], c: 1, e: 'Анализ вредоносного ПО включает статический и динамический анализ для понимания его функций.', chapter: 5},
    {q: 'Что такое форензика памяти?', a: ['Анализ жёсткого диска', 'Анализ дампов RAM для следов активности', 'Восстановление файлов', 'Проверка паролей'], c: 1, e: 'Форензика памяти анализирует содержимое RAM для обнаружения следов вредоносного ПО.', chapter: 5},
    {q: 'Что такое Threat Intelligence?', a: ['Угрозы в интернете', 'Разведка угроз — сбор и анализ информации об угрозах', 'Спам-рассылки', 'Фишинг'], c: 1, e: 'Threat Intelligence — это сбор и анализ информации об угрозах для улучшения защиты.', chapter: 5},
    {q: 'Что такое Incident Response?', a: ['Ответ на инциденты', 'Планирование и реагирование на инциденты безопасности', 'Установка обновлений', 'Создание бэкапов'], c: 1, e: 'Incident Response — это процесс обнаружения, анализа и реагирования на инциденты безопасности.', chapter: 5},
    {q: 'Что такое реверс-инжиниринг?', a: ['Обратная разработка', 'Анализ бинарного кода для понимания функций', 'Создание программ', 'Взлом паролей'], c: 1, e: 'Реверс-инжиниринг — это анализ бинарного кода для понимания работы программы.', chapter: 5},

    // Глава 6 - Тестирование и аудит (5 уроков)
    {q: 'Что такое Red Teaming?', a: ['Команда хакеров', 'Комплексное тестирование безопасности всей организации', 'Команда разработчиков', 'Антивирусная команда'], c: 1, e: 'Red Teaming — это имитация реальных атак для тестирования защиты организации.', chapter: 6},
    {q: 'Что такое Web Security Testing?', a: ['Тестирование браузеров', 'Тестирование безопасности веб-приложений', 'Проверка паролей', 'Установка SSL'], c: 1, e: 'Web Security Testing — это тестирование веб-приложений на уязвимости (OWASP Top 10).', chapter: 6},
    {q: 'Что такое Cloud Security?', a: ['Безопасность облаков', 'Защита облачных инфраструктур и сервисов', 'Хранение файлов', 'Резервные копии'], c: 1, e: 'Cloud Security — это защита облачных сред (AWS, Azure, GCP) от угроз.', chapter: 6},
    {q: 'Что такое Exploitation?', a: ['Использование', 'Техники эксплуатации уязвимостей для получения доступа', 'Установка обновлений', 'Создание паролей'], c: 1, e: 'Exploitation — это использование уязвимостей для получения несанкционированного доступа.', chapter: 6},
    {q: 'Что такое ICS Security?', a: ['Защита интернета', 'Безопасность промышленных систем управления (SCADA, PLC)', 'Защита компьютеров', 'Сетевая безопасность'], c: 1, e: 'ICS Security защищает промышленные системы управления от кибератак.', chapter: 6},

    // Глава 7 - Этичный хакинг и пентестинг (10 уроков)
    {q: 'Что такое этичный хакинг?', a: ['Взлом без причины', 'Легальное тестирование безопасности с разрешения', 'Создание вирусов', 'Воровство данных'], c: 1, e: 'Этичный хакинг — это легальное тестирование безопасности с письменного разрешения владельца.', chapter: 7},
    {q: 'Какие виды тестирования существуют?', a: ['Только черный ящик', 'Black box, White box, Gray box', 'Только внутреннее', 'Только внешнее'], c: 1, e: '3 вида: Black box (без знаний о системе), White box (полный доступ), Gray box (частичный).', chapter: 7},
    {q: 'Какие фазы пентестинга существуют?', a: ['Только взлом', 'Разведка, сканирование, эксплуатация, пост-эксплуатация, отчёт', 'Только сканирование', 'Только отчётность'], c: 1, e: '7 фаз PTES: разведка, сбор информации, энумерация, анализ уязвимостей, эксплуатация, пост-эксплуатация, отчёт.', chapter: 7},
    {q: 'Что такое OSINT?', a: ['Open Source Intelligence', 'Operating System Intelligence', 'Online Security Investigation', 'Open System Interface'], c: 0, e: 'OSINT — сбор информации из открытых источников (соцсети, WHOIS, DNS).', chapter: 7},
    {q: 'Какой тип сканирования Nmap является наиболее скрытным?', a: ['TCP Connect (-sT)', 'SYN Scan (-sS)', 'UDP Scan (-sU)', 'ACK Scan (-sA)'], c: 1, e: 'SYN scan (-sS) отправляет только SYN пакет и не устанавливает полное соединение.', chapter: 7},
    {q: 'Что такое энумерация?', a: ['Сканирование портов', 'Процесс обнаружения и идентификации сетевых ресурсов', 'Шифрование данных', 'Взлом системы'], c: 1, e: 'Энумерация — это систематический процесс обнаружения ресурсов в сети.', chapter: 7},
    {q: 'Что означает аббревиатура CVSS?', a: ['Common Vulnerability Scoring System', 'Computer Virus Security Standard', 'Cyber Attack Vulnerability Score', 'Computer Vulnerability Status'], c: 0, e: 'CVSS — стандартная система оценки критичности уязвимостей (0-10).', chapter: 7},
    {q: 'Какой уровень критичности имеет CVSS 9.0?', a: ['Средний', 'Высокий', 'Критический', 'Низкий'], c: 2, e: 'CVSS 9.0-10.0 классифицируется как Critical (Критический).', chapter: 7},
    {q: 'Что такое SQL-инъекция?', a: ['Атака на SQL-сервер', 'Внедрение SQL-запросов через уязвимый ввод', 'Удаление базы данных', 'Создание таблиц'], c: 1, e: 'SQL-инъекция позволяет внедрять произвольные SQL-запросы через поля ввода.', chapter: 7},
    {q: 'Что такое RCE?', a: ['Remote Code Execution', 'Remote Computer Endpoint', 'Reduced Code Efficiency', 'Random Code Execution'], c: 0, e: 'RCE — это возможность удалённого выполнения кода на целевой системе.', chapter: 7},
    {q: 'Что такое LPE?', a: ['Local Program Execution', 'Low Priority Error', 'Local Privilege Escalation', 'Log Password Extraction'], c: 2, e: 'LPE — повышение привилегий до уровня администратора/root.', chapter: 7},
    {q: 'Что такое пост-эксплуатация?', a: ['Первичный взлом', 'Этап после получения доступа для закрепления и продвижения', 'Восстановление системы', 'Установка антивируса'], c: 1, e: 'Пост-эксплуатация включает: закрепление, повышение привилегий, продвижение по сети.', chapter: 7},
    {q: 'Что такое persistence (закрепление)?', a: ['Увеличение скорости', 'Сохранение доступа после перезагрузки', 'Очистка логов', 'Резервное копирование'], c: 1, e: 'Закрепление — это механизмы для сохранения доступа после перезагрузки системы.', chapter: 7},
    {q: 'Какой инструмент используется для анализа Active Directory?', a: ['Mimikatz', 'BloodHound', 'SQLMap', 'Nmap'], c: 1, e: 'BloodHound визуализирует и анализирует связи в Active Directory.', chapter: 7},
    {q: 'Что такое Metasploit?', a: ['Антивирус', 'Платформа для разработки и выполнения эксплойтов', 'Программа для взлома паролей', 'Firewall'], c: 1, e: 'Metasploit — это фреймворк для тестирования на проникновение с множеством эксплойтов.', chapter: 7},
    {q: 'Что такое Burp Suite?', a: ['Антивирус', 'Инструмент для тестирования веб-приложений', 'Программа для сканирования сети', 'Password cracker'], c: 1, e: 'Burp Suite — это инструмент для тестирования безопасности веб-приложений.', chapter: 7}
];

let currentTestQuestions = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;
let answered = false;

function openTest1() {
    // Shuffle questions
    const shuffledQuestions = shuffleArray(test1Questions);
    // Shuffle answers and track correct index
    currentTestQuestions = shuffledQuestions.map(shuffleAnswers);
    currentQuestionIndex = 0;
    correctAnswers = 0;
    answered = false;
    
    document.getElementById('quiz-modal-header-title').innerHTML = '<i class="fas fa-shield-alt"></i> Тест: Основы безопасности (Главы 1-3)';
    document.getElementById('quiz-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCurrentQuestion();
}

function openTest2() {
    // Shuffle questions
    const shuffledQuestions = shuffleArray(test2Questions);
    // Shuffle answers and track correct index
    currentTestQuestions = shuffledQuestions.map(shuffleAnswers);
    currentQuestionIndex = 0;
    correctAnswers = 0;
    answered = false;
    
    document.getElementById('quiz-modal-header-title').innerHTML = '<i class="fas fa-bug"></i> Тест: Продвинутые техники (Главы 4-7)';
    document.getElementById('quiz-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
    renderCurrentQuestion();
}

function renderCurrentQuestion() {
    const container = document.getElementById('quiz-container');
    const progress = document.getElementById('quiz-progress');
    
    // Check if test is complete
    if (currentQuestionIndex >= currentTestQuestions.length) {
        showCompletion();
        return;
    }
    
    const question = currentTestQuestions[currentQuestionIndex];
    const total = currentTestQuestions.length;
    
    progress.textContent = `Вопрос ${currentQuestionIndex + 1} из ${total}`;
    
    container.innerHTML = `
        <div class="quiz-question" id="question-${currentQuestionIndex}">
            <p>${currentQuestionIndex + 1}. ${question.q}</p>
            ${question.shuffledAnswers.map((opt, j) => 
                `<div class="quiz-option" data-question="${currentQuestionIndex}" data-answer="${j}">
                    <span>${opt.text}</span>
                </div>`
            ).join('')}
            <div class="quiz-explanation" id="explanation-${currentQuestionIndex}"></div>
            <button class="next-question-btn" id="next-btn" style="display: none;" onclick="nextQuestion()">
                Следующий вопрос <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
}

function showCompletion() {
    const container = document.getElementById('quiz-container');
    const progress = document.getElementById('quiz-progress');
    const total = currentTestQuestions.length;
    const percentage = Math.round((correctAnswers / total) * 100);
    
    progress.textContent = '';
    
    let resultClass = '';
    let resultText = '';
    let resultIcon = '';
    
    if (percentage >= 80) {
        resultClass = 'excellent';
        resultText = 'Отлично!';
        resultIcon = 'fa-trophy';
    } else if (percentage >= 60) {
        resultClass = 'good';
        resultText = 'Хорошо!';
        resultIcon = 'fa-thumbs-up';
    } else if (percentage >= 40) {
        resultClass = 'average';
        resultText = 'Неплохо!';
        resultIcon = 'fa-minus-circle';
    } else {
        resultClass = 'needs-work';
        resultText = 'Нужно ещё поучиться';
        resultIcon = 'fa-book';
    }
    
    container.innerHTML = `
        <div class="quiz-completion">
            <div class="completion-icon ${resultClass}">
                <i class="fas ${resultIcon}"></i>
            </div>
            <h3>Тест завершён!</h3>
            <div class="completion-score">
                <span class="score-number">${correctAnswers}</span>
                <span class="score-divider">/</span>
                <span class="score-total">${total}</span>
            </div>
            <p class="score-percentage">${percentage}%</p>
            <p class="result-text ${resultClass}">${resultText}</p>
            <button class="restart-btn" onclick="restartTest()">
                <i class="fas fa-redo"></i> Пройти заново
            </button>
            <button class="close-btn" onclick="closeQuiz()">
                Закрыть
            </button>
        </div>
    `;
}

function restartTest() {
    if (document.getElementById('quiz-modal-header-title').innerHTML.includes('Основы безопасности')) {
        openTest1();
    } else {
        openTest2();
    }
}

function nextQuestion() {
    answered = false;
    currentQuestionIndex++;
    renderCurrentQuestion();
}

// Делегирование событий - один обработчик для всех вопросов
document.getElementById('quiz-container').addEventListener('click', function(e) {
    const option = e.target.closest('.quiz-option');
    if (!option || answered) return;
    
    const questionIndex = parseInt(option.dataset.question);
    const selectedAnswer = parseInt(option.dataset.answer);
    const questionData = currentTestQuestions[questionIndex];
    
    answered = true;
    
    // Находим элементы этого вопроса
    const questionEl = document.getElementById('question-' + questionIndex);
    const explanationEl = document.getElementById('explanation-' + questionIndex);
    const nextBtn = document.getElementById('next-btn');
    
    // Сбрасываем стили всех опций этого вопроса
    questionEl.querySelectorAll('.quiz-option').forEach(o => {
        o.classList.remove('correct', 'incorrect');
    });
    
    // Подсвечиваем выбранный ответ
    if (selectedAnswer === questionData.correctIndex) {
        option.classList.add('correct');
        explanationEl.className = 'quiz-explanation show correct';
        explanationEl.innerHTML = '✓ Правильно! ' + questionData.e;
        correctAnswers++;
        
        // Автоматический переход к следующему вопросу через 1.5 секунды
        setTimeout(() => {
            nextQuestion();
        }, 1500);
    } else {
        option.classList.add('incorrect');
        questionEl.querySelectorAll('.quiz-option')[questionData.correctIndex].classList.add('correct');
        explanationEl.className = 'quiz-explanation show incorrect';
        explanationEl.innerHTML = '✗ Неправильно. ' + questionData.e;
        
        // Показываем кнопку "Следующий вопрос"
        nextBtn.style.display = 'inline-flex';
    }
});


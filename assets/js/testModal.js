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
                        question: 'Что такое DDoS-атака и из чего состоит ботнет?',
                        options: [
                            'Вирус, который крадёт личные данные',
                            'Атака с использованием сети заражённых компьютеров (ботнет) для перегрузки сервера',
                            'Фишинговая атака через email',
                            'Взлом пароля методом перебора'
                        ],
                        correct: 1,
                        explanation: 'DDoS-атака использует ботнет — сеть заражённых компьютеров, которые одновременно отправляют запросы на целевой сервер, перегружая его и делая недоступным для обычных пользователей.'
                    },
                    {
                        id: 'q2',
                        question: 'Какой пароль считается надёжным по рекомендациям статьи?',
                        options: [
                            '123456',
                            'Имя вашего питомца + год рождения',
                            'Пароль длиной минимум 12 символов с разными типами символов',
                            'Дата вашего рождения в формате ДДММГГ'
                        ],
                        correct: 2,
                        explanation: 'Надёжный пароль должен быть длиной минимум 12 символов и содержать буквы верхнего и нижнего регистра, цифры и специальные символы.'
                    },
                    {
                        id: 'q3',
                        question: 'Какие основные виды вредоносного ПО существуют?',
                        options: [
                            'Только вирусы и трояны',
                            'Вирусы, трояны, программы-вымогатели, шпионское ПО и рекламное ПО',
                            'Только вирусы-шифровальщики',
                            'Баннеры и всплывающие окна'
                        ],
                        correct: 1,
                        explanation: 'Основные типы вредоносного ПО: вирусы (самокопирующиеся программы), трояны (маскируются под полезное ПО), программы-вымогатели (шифруют файлы), шпионское ПО (крадёт данные) и рекламное ПО (показывает рекламу).'
                    },
                    {
                        id: 'q4',
                        question: 'Какие техники социальной инженерии описаны в статье?',
                        options: [
                            'Только фишинг и скам',
                            'Pretexting, baiting, quid pro quo, tailgating и impersonation',
                            'Только телефонные звонки',
                            'Только взлом паролей'
                        ],
                        correct: 1,
                        explanation: '5 основных техник социальной инженерии: Pretexting (создание ложного предлога), Baiting (приманка в виде файла/устройства), Quid Pro Quo (обмен услугой за информацию), Tailgating (проход за сотрудником) и Impersonation (выдача себя за другого).'
                    },
                    {
                        id: 'q5',
                        question: 'Как защитить свой аккаунт в социальных сетях?',
                        options: [
                            'Использовать один пароль для всех соцсетей',
                            'Настроить приватность, использовать 2FA, не публиковать лишнее',
                            'Не использовать социальные сети вообще',
                            'Зарегистрироваться под вымышленным именем'
                        ],
                        correct: 1,
                        explanation: 'Защита аккаунтов в соцсетях включает: настройку приватности профиля, использование двухфакторной аутентификации, минимизацию публикуемой личной информации и осторожность с ссылками.'
                    },
                    {
                        id: 'q6',
                        question: 'Почему опасно использовать публичный Wi-Fi без защиты?',
                        options: [
                            'Публичный Wi-Fi всегда медленный',
                            'Хакеры могут перехватывать ваш трафик и данные',
                            'Он автоматически ворует пароли',
                            'Государство следит за публичным Wi-Fi'
                        ],
                        correct: 1,
                        explanation: 'В открытых незащищённых сетях хакеры могут перехватывать трафик между вашим устройством и интернетом, получая доступ к паролям, сообщениям и другим данным.'
                    },
                    {
                        id: 'q7',
                        question: 'Какие признаки указывают на фишинговое письмо?',
                        options: [
                            'Письмо от известной компании',
                            'Срочность создания, незнакомый отправитель, подозрительные ссылки, ошибки в тексте',
                            'Письмо на русском языке',
                            'Наличие логотипа компании'
                        ],
                        correct: 1,
                        explanation: 'Признаки фишинга: создание срочности/страха, незнакомый или подозрительный адрес отправителя, ссылки на неофициальные домены, грамматические ошибки и просьба ввести данные.'
                    },
                    {
                        id: 'q8',
                        question: 'Почему важно регулярно устанавливать обновления программ?',
                        options: [
                            'Обновления замедляют компьютер',
                            'Обновления содержат исправления уязвимостей безопасности',
                            'Обновления нужны только для новых функций',
                            'Обновления не влияют на безопасность'
                        ],
                        correct: 1,
                        explanation: 'Обновления программ и операционной системы содержат исправления уязвимостей безопасности. Неустановленные обновления оставляют «дыры», через которые могут проникнуть хакеры.'
                    },
                    {
                        id: 'q9',
                        question: 'Что такое программа-вымогатель (ransomware) и как от неё защититься?',
                        options: [
                            'Вирус, который крадёт пароли',
                            'Вредоносное ПО, шифрующее файлы и требующее выкуп; защита: бэкап, антивирус, осторожность с вложениями',
                            'Программа для восстановления файлов',
                            'Брандмауэр Windows'
                        ],
                        correct: 1,
                        explanation: 'Программы-вымогатели шифруют файлы и требуют выкуп за расшифровку. Защита включает: регулярный бэкап, антивирус, осторожность с email-вложениями, блокировку макросов в документах.'
                    },
                    {
                        id: 'q10',
                        question: 'Какие меры безопасности рекомендуются для защиты электронной почты?',
                        options: [
                            'Использовать один пароль для почты и всех сервисов',
                            'Включить 2FA, проверять отправителя, не открывать подозрительные вложения, использовать отдельный пароль',
                            'Не пользоваться почтой вообще',
                            'Удалять все письма после прочтения'
                        ],
                        correct: 1,
                        explanation: 'Защита почты: двухфакторная аутентификация, проверка адреса отправителя, осторожность с вложениями и ссылками, использование уникального сложного пароля, шифрование писем при необходимости.'
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
                        question: 'Какие типы двухфакторной аутентификации (2FA) существуют по статье?',
                        options: [
                            'Только SMS и email',
                            'SMS-код, приложение-аутентификатор, аппаратный ключ, биометрия',
                            'Только отпечаток пальца и Face ID',
                            'Пароль и PIN-код'
                        ],
                        correct: 1,
                        explanation: '4 основных типа 2FA: SMS-код (наименее безопасный), приложение-аутентификатор (TOTP), аппаратный ключ безопасности (самый безопасный) и биометрия (отпечаток, Face ID).'
                    },
                    {
                        id: 'q2',
                        question: 'Какие типы фишинга описаны в статье "Фишинг: глубокое погружение"?',
                        options: [
                            'Только email-фишинг',
                            'Email-фишинг, специальный фишинг (spear phishing), китобойный (whaling), smishing, вишинг, клонирование',
                            'Только SMS-фишинг',
                            'Только звонки мошенников'
                        ],
                        correct: 1,
                        explanation: '6 типов фишинга: классический email, spear phishing (целевой), whaling (на руководителей), smishing (через SMS), vishing (голосовые звонки) и клонирование писем.'
                    },
                    {
                        id: 'q3',
                        question: 'Что такое холодный кошелёк для криптовалют и чем он отличается от горячего?',
                        options: [
                            'Холодный — это бесплатный кошелёк',
                            'Холодный кошелёк не подключён к интернету (аппаратный или бумажный), горячий — всегда онлайн',
                            'Горячий — для начинающих, холодный — для профи',
                            'Разницы нет — это маркетинговые термины'
                        ],
                        correct: 1,
                        explanation: 'Холодный кошелёк не подключён к интернету (аппаратное устройство или бумага), что делает его неуязвимым для онлайн-атак. Горячий кошелёк постоянно онлайн и менее безопасен.'
                    },
                    {
                        id: 'q4',
                        question: 'Что такое seed-фраза и как её правильно хранить?',
                        options: [
                            'Пароль от криптобиржи',
                            '12-24 слова для восстановления кошелька, хранить офлайн на бумаге в безопасном месте',
                            'Код для входа в приложение',
                            'Номер криптокошелька'
                        ],
                        correct: 1,
                        explanation: 'Seed-фраза — это 12-24 слова, восстанавливающие доступ к кошельку. Её нужно записать на бумаге и хранить офлайн (сейф, банковская ячейка), никогда не в телефоне или онлайн.'
                    },
                    {
                        id: 'q5',
                        question: 'Почему IoT-устройства считаются небезопасными и как их защитить?',
                        options: [
                            'IoT-устройства невозможно защитить',
                            'Часто имеют пароли по умолчанию и уязвимости; защита: сменить пароль, создать гостевую сеть, обновлять прошивку',
                            'IoT-устройства не подключаются к интернету',
                            'Они автоматически защищены производителем'
                        ],
                        correct: 1,
                        explanation: '70% IoT-устройств имеют уязвимости. Защита: смена пароля по умолчанию, создание отдельной гостевой сети, регулярные обновления прошивки, отключение неиспользуемых функций.'
                    },
                    {
                        id: 'q6',
                        question: 'Какие атаки используются против игровых аккаунтов?',
                        options: [
                            'Только взлом пароля',
                            'Фишинг, кейлоггеры в читах, подмена файлов обновлений, торговые аферы, скам-ссылки',
                            'Только вирусы',
                            'Никакие — игры безопасны'
                        ],
                        correct: 1,
                        explanation: 'Атаки на геймеров: фишинг письмами «от Steam», кейлоггеры в пиратских читах, подмена игровых файлов, торговые аферы с подменой предметов, ссылки на «генераторы скинов».'
                    },
                    {
                        id: 'q7',
                        question: 'Что такое груминг в контексте безопасности детей в интернете?',
                        options: [
                            'Установка родительского контроля',
                            'Манипуляции взрослого для установления доверительных отношений с ребёнком с целью эксплуатации',
                            'Кража паролей у детей',
                            'Вирус в компьютере'
                        ],
                        correct: 1,
                        explanation: 'Груминг — это процесс, при котором взрослый манипулирует ребёнком, устанавливая доверительные отношения для последующей эксплуатации или насилия. Родителям важно распознавать признаки.'
                    },
                    {
                        id: 'q8',
                        question: 'Какое правило нужно соблюдать при создании бэкапов и что оно означает?',
                        options: [
                            'Делать бэкап раз в год',
                            'Правило 3-2-1: 3 копии данных, на 2 разных носителях, 1 копия в другом месте',
                            'Хранить бэкап на рабочем столе',
                            'Достаточно одной копии в облаке'
                        ],
                        correct: 1,
                        explanation: 'Правило 3-2-1 обеспечивает надёжность: минимум 3 копии данных (оригинал + 2 резервные), на 2 разных носителях (диск + облако), причём 1 копия хранится в другом географическом месте.'
                    },
                    {
                        id: 'q9',
                        question: 'Какие уровни анонимности в интернете описаны в статье?',
                        options: [
                            'Только режим инкогнито',
                            'Уровень 1: базовый (VPN, приватный браузер), уровень 2: средний (отдельные профили, блокировка трекеров), уровень 3: высокий (Tor, Tails), уровень 4: максимальный (физическая изоляция)',
                            'Только использование Tor',
                            'Анонимность невозможна, поэтому нет смысла защищаться'
                        ],
                        correct: 1,
                        explanation: '4 уровня анонимности: базовый (VPN, режим инкогнито), средний (отдельные браузерные профили, блокировщики трекеров), высокий (Tor, специализированные ОС как Tails), максимальный (отказ от смартфона, наличные, офлайн-коммуникация).'
                    },
                    {
                        id: 'q10',
                        question: 'Что включает мобильная безопасность и какие методы защиты рекомендуются?',
                        options: [
                            'Не использовать смартфоны',
                            'Блокировка экрана (PIN + биометрия), безопасность приложений (проверка разрешений), мобильный антивирус для Android, безопасность Wi-Fi и Bluetooth, бэкап данных, настройка Find My Device',
                            'Только установка антивируса',
                            'Только использование VPN'
                        ],
                        correct: 1,
                        explanation: 'Мобильная безопасность включает: настройку блокировки (PIN/пароль + биометрия), проверку разрешений приложений, использование антивируса (особенно для Android), отключение Wi-Fi/Bluetooth вне использования, регулярный бэкап и предварительную настройку Find My Device.'
                    },
                    {
                        id: 'q11',
                        question: 'Что такое SIM-swap атака и как от неё защититься?',
                        options: [
                            'Замена SIM-карты жертвы для перехвата SMS с кодами 2FA',
                            'Вирус на SIM-карте',
                            'Кража телефона с SIM-картой',
                            'Клонирование SIM-карты через Bluetooth'
                        ],
                        correct: 0,
                        explanation: 'SIM-swap — это когда мошенник убеждает оператора перевести ваш номер на его SIM-карту. Защита: установить PIN на SIM, использовать 2FA через приложение (не SMS), не привязывать номер к крипто-аккаунтам.'
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
                        question: 'Что изучает дисциплина «Теория информационной безопасности» и каковы её основные цели?',
                        options: [
                            'Только установку антивирусов',
                            'Науку о защите информации от угроз: анализ рисков, проектирование политик, формальные модели защиты',
                            'Только программирование безопасных приложений',
                            'Только законодательство в области ИБ'
                        ],
                        correct: 1,
                        explanation: 'ТИБ изучает угрозы и методы защиты информации. Цели: определить ценность информации, классифицировать угрозы, построить системы защиты, применять математические модели.'
                    },
                    {
                        id: 'q2',
                        question: 'Какие виды тайны информации существуют в РФ по статье?',
                        options: [
                            'Только государственная тайна',
                            'Государственная тайна, коммерческая тайна, профессиональная тайна, персональные данные',
                            'Только персональные данные',
                            'Только коммерческая тайна'
                        ],
                        correct: 1,
                        explanation: 'В РФ существуют 4 основных вида тайны: государственная (степени: особой важности, секретно, совершенно секретно), коммерческая (сведения с коммерческой ценностью), профессиональная (врачебная, адвокатская) и персональные данные.'
                    },
                    {
                        id: 'q3',
                        question: 'Как классифицируются угрозы безопасности информации по источнику и типу воздействия?',
                        options: [
                            'Только внешние угрозы',
                            'По источнику: внешние (хакеры, вирусы) и внутренние (сотрудники); по воздействию: пассивные (перехват) и активные (модификация данных)',
                            'Только от природных катастроф',
                            'Только от вирусов'
                        ],
                        correct: 1,
                        explanation: 'Угрозы классифицируются: по источнику — внешние (извне) и внутренние (от сотрудников); по типу воздействия — пассивные (только наблюдение) и активные (изменение данных).'
                    },
                    {
                        id: 'q4',
                        question: 'Что такое уязвимость и какие основные типы уязвимостей существуют (CWE, CVSS)?',
                        options: [
                            'Уязвимость — это атака хакера',
                            'Слабость в системе, используемая для атаки; типы: ошибки программирования (SQL-инъекция, XSS), неправильная конфигурация, человеческий фактор; оценивается по шкале CVSS (0-10)',
                            'Только устаревшее программное обеспечение',
                            'Только слабые пароли'
                        ],
                        correct: 1,
                        explanation: 'Уязвимость — недостаток в системе, используемый для нарушения безопасности. Типы: ошибки кода (SQL-инъекция, XSS, переполнение буфера), неправильная конфигурация, человеческий фактор, устаревшее ПО. Оценка опасности — по шкале CVSS 3.1 (критический 9.0-10.0).'
                    },
                    {
                        id: 'q5',
                        question: 'Что включает в себя модель нарушителя в ТИБ?',
                        options: [
                            'Только фотографию хакера',
                            'Описание потенциального злоумышленника: тип (внешний/внутренний/администратор), квалификация (любитель/профессионал/спецслужбы), мотивация (финансы, шпионаж, месть)',
                            'Только его IP-адрес',
                            'Только имя и фамилию'
                        ],
                        correct: 1,
                        explanation: 'Модель нарушителя включает: тип по доступу (внешний/внутренний/администратор), уровень квалификации (любитель/профессионал/спецслужбы), мотивацию (финансы, шпионаж, хактивизм, месть), ресурсы и методы атак.'
                    },
                    {
                        id: 'q6',
                        question: 'Какие методы моделирования угроз описаны в статье (STRIDE, DREAD, PASTA)?',
                        options: [
                            'Только STRIDE',
                            'STRIDE (6 типов угроз: Spoofing, Tampering, Repudiation, Information Disclosure, DoS, Elevation of Privilege), DREAD (оценка рисков), PASTA (7-этапный процесс)',
                            'Только антивирусное сканирование',
                            'Только установка обновлений'
                        ],
                        correct: 1,
                        explanation: 'Методы моделирования: STRIDE — 6 категорий угроз (подделка, изменение, отказ, утечка, DoS, эскалация); DREAD — критерии оценки рисков (Damage, Reproducibility, Exploitability, Affected Users, Discoverability); PASTA — 7-этапный процесс анализа.'
                    },
                    {
                        id: 'q7',
                        question: 'Что такое политика безопасности и какие основные типы политик существуют?',
                        options: [
                            'Антивирусная программа',
                            'Совокупность правил защиты информации; типы: общая политика, политики доменов (управление доступом, пароли, использование ресурсов, инциденты, удалённый доступ, BYOD)',
                            'Закон о защите данных',
                            'Пароль от системы'
                        ],
                        correct: 1,
                        explanation: 'Политика безопасности — документ с правилами защиты информации. Уровни: верхний (общая политика), средний (политики доменов), нижний (локальные политики). Включает политики управления доступом, паролей, использования ресурсов, инцидентов, удалённого доступа.'
                    },
                    {
                        id: 'q8',
                        question: 'Что описывает дискреционная модель Харрисона-Руззо-Ульмана (HRU)?',
                        options: [
                            'Доступ определяется системой по уровням',
                            'Модель, где владелец объекта сам определяет права доступа; использует матрицу доступа (субъекты × объекты) с правами r, w, x, d; поддерживает 6 операций',
                            'Доступ по ролям',
                            'Случайный доступ'
                        ],
                        correct: 1,
                        explanation: 'Модель HRU — дискреционная (избирательная) модель, где владелец объекта определяет права. Формально: система (S, O, M) где S — субъекты, O — объекты, M — матрица доступа. Операции: enter, delete, create/destroy субъекта и объекта. Права: r (чтение), w (запись), x (исполнение), d (удаление).'
                    },
                    {
                        id: 'q9',
                        question: 'Какие правила описывает мандатная модель Белла-Лападулы и как работает классификация?',
                        options: [
                            'Свободный доступ для всех',
                            'Простое свойство (чтение только ≤ своего уровня), *-свойство (запись только ≥ своего уровня); уровни: Top Secret, Secret, Confidential, Unclassified',
                            'Доступ по паролю',
                            'Доступ только для администратора'
                        ],
                        correct: 1,
                        explanation: 'Модель Белла-Лападулы — мандатная модель с классификацией по уровням секретности: Top Secret (особой важности), Secret (секретно), Confidential (конфиденциально), Unclassified (несекретно). Правила: простое свойство — читать можно только объект с уровнем ≤ своему; *-свойство — записывать можно только объект с уровнем ≥ своему.'
                    },
                    {
                        id: 'q10',
                        question: 'Какие модели контроля целостности существуют и чем они отличаются?',
                        options: [
                            'Только проверка антивирусом',
                            'Модель Биба (мандатная, зеркало Белла-Лападулы для целостности, уровни Very High/Low) и модель Кларк-Вильсона (процедурная, бизнес-транзакции, separation of duties)',
                            'Только резервное копирование',
                            'Только шифрование данных'
                        ],
                        correct: 1,
                        explanation: 'Модели целостности: Биба — мандатная модель с уровнями целостности (Very High → Very Low), правила обратные Белла-Лападуле; Кларк-Вильсон — процедурная модель для бизнес-процессов, использует правильно сформированные транзакции (well-formed transactions) и разделение обязанностей (separation of duties).'
                    },
                    {
                        id: 'q11',
                        question: 'Что включает защита от несанкционированного доступа (НСД)?',
                        options: [
                            'Только замок на двери',
                            'Идентификация и аутентификация (пароли, биометрия, 2FA), управление доступом (дискреционное/мандатное/ролевое), криптографическая защита (шифрование, ЭП, хеширование), аудит и мониторинг',
                            'Только антивирус',
                            'Только бэкап'
                        ],
                        correct: 1,
                        explanation: 'Защита от НСД включает: идентификация (кто вы) и аутентификация (доказательство — пароль, биометрия, аппаратный ключ, 2FA); управление доступом (дискреционное HRU, мандатное Белла-Лападулы, ролевое RBAC); криптография (шифрование, электронная подпись, хеширование); аудит и мониторинг (логирование, анализ активности).'
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
                    
                    
                    <div class="test-footer" id="test-footer">
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
        return true; // Блокировка глав убрана
    }
}

// Создаём глобальный экземпляр
const testModal = new TestModal();


# Выполненные задачи

## 1. Статистика на всю ширину ✅
- **index.html**: Панель статистики теперь на всю ширину (убрана обёртка `.info-panels`)
- **main.css**: Добавлен `.stats-grid.stats-4` для 4 карточек
- **app.js**: Обновление включает счётчик активных атак

## 2. Интервал атак ✅
- **dataHandler.js**: Интервал изменён с 15 сек → **20 секунд**

## 3. Размер панели карты ✅
- **main.css**: `.map-container` имеет `min-height: 1100px`
- **main.css**: `#world-map` имеет высоту `1000px`

## 4. Учебник - уроки загружаются! ✅

### Проблема:
Ранее в `article.html` были только 2 встроенные статьи, а 29 файлов `.md` не использовались.

### Решение:
Создана новая версия `article.html` с поддержкой:
- ✅ Загрузки markdown файлов из папки `articles/`
- ✅ Библиотеки `marked.js` для конвертации markdown в HTML
- ✅ Кэширования статей в localStorage (7 дней)
- ✅ Навигации между уроками (предыдущий/следующий)
- ✅ Отслеживания прогресса прохождения уроков

### Доступные уроки (31 штука):

**Глава 1: Основы безопасности (10)**
1. what-is-ddos
2. what-is-phishing
3. how-vpn-works
4. how-passwords-work
5. malware-guide
6. social-engineering
7. social-media-safety
8. wifi-security
9. email-security
10. updates-importance

**Глава 2: Продвинутая защита (10)**
11. encryption-basics
12. mobile-security
13. two-factor-auth
14. phishing-attacks-deep-dive
15. crypto-security
16. iot-security
17. gaming-security
18. child-safety
19. backup-guide
20. online-anonymity

**Глава 3: Теория ИБ (11)**
21. tib-intro
22. tib-info-object
23. tib-threats
24. tib-vulnerabilities
25. tib-intruder-model
26. tib-threat-modeling
27. tib-security-policies
28. tib-discretionary
29. tib-mandatory
30. tib-integrity
31. tib-nsd

### Теперь при клике на урок в learn.html:
- Открывается `article.html?id=название_урока`
- Загружается соответствующий markdown файл
- Можно переходить к следующим урокам
- Прогресс сохраняется в localStorage


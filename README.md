# 🛡️ CyberThreat Explorer / Исследователь Киберугроз

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.1.0-green.svg)](CHANGELOG.md)
[![Русский](https://img.shields.io/badge/язык-Русский-orange.svg)](README.ru.md)

> **EN**: Interactive cybersecurity education platform with world cyberattack map visualization for beginners.
> 
> **RU**: Интерактивная образовательная платформа по кибербезопасности с визуализацией кибератак на карте мира для начинающих.

![CyberThreat Explorer](https://via.placeholder.com/1200x600/0f172a/3b82f6?text=CyberThreat+Explorer)

---

## 📋 Project Description / Описание проекта

**EN**: CyberThreat Explorer visualizes cyberattacks on an interactive world map and explains them in simple terms. Educational project using D3.js.

**RU**: CyberThreat Explorer визуализирует кибератаки на интерактивной карте мира и объясняет их простым языком. Образовательный проект на D3.js.

### 🎯 Target Audience / Целевая аудитория
- Beginners in cybersecurity
- Students
- Parents (child safety online)
- Non-IT professionals
- Начинающие
- Студенты
- Родители
- Специалисты непрофильных областей

---

## ✨ Features / Основные функции

### 🌍 Interactive Attack Map / Интерактивная карта атак
| Feature / Функция | Description / Описание |
|-------------------|-----------------------|
| Real-time visualization | D3.js world map with attack arrows |
| Click for details | Attack info + protection tips |
| Zoom/Pan | Mouse wheel + drag |
| Filters | By type/country/sector |
| Визуализация | Карта мира с D3.js |
| Детали | По клику |
| Масштаб | Колесико/кнопки |

### 📚 Glossary / Глоссарий
- **77+ terms** (updated from about.html)
- Searchable
- 60+ терминов

### 🎓 Learning Materials / Учебные материалы
- **60+ articles** in `articles/` (TIB, pentesting, malware, phishing, etc.)
- Quizzes/tests (2+)
- 60+ статей

### 📊 Statistics / Статистика
- Live counters (attacks/sec)
- Top sources/targets

---

## 📱 Pages / Страницы

| Page / Страница | File / Файл | Description / Описание |
|-----------------|-------------|-----------------------|
| Home (News) | `index.html` | News + stats from SecurityLab.ru |
| Attack Map | `cyberattackmap.html` | Interactive D3.js map |
| About | `about.html` | Project info |
| Glossary | `glossary.html` | Terms dictionary |
| Learn | `learn.html` | Lessons + tests |
| Article | `article.html` | MD article viewer |
| Главная | `index.html` | Новости + статистика |
| Карта | `cyberattackmap.html` | Интерактивная карта |

---

## 🛠 Tech Stack / Технологии

```
HTML5 • CSS3 • JavaScript ES6+
D3.js v7 • TopoJSON
Font Awesome 6 • Roboto (Google Fonts)
```

**Full structure / Полная структура**:
```
.
├── index.html              # Главная (новости)
├── cyberattackmap.html     # Карта атак
├── about.html              # О проекте
├── glossary.html           # Глоссарий
├── learn.html              # Учебник
├── article.html            # Шаблон статьи
├── README.md               # Документация (обновлено)
├── TODO.md                 # Прогресс задач
├── articles/ (60+)         # Статьи: tib-*.md, advanced-*.md, etc.
├── assets/
│   ├── css/ (main.css, map-custom.css, news.css...)
│   ├── js/ (mapRenderer_fixed.js, uiManager.js, app.js...)
│   ├── data/ (glossary.json, world-map.json)
│   └── img/
└── sitemap.xml, robots.txt
```

---

## 🚀 Quick Start / Быстрый запуск (Windows)

```cmd
# Открыть главную страницу
start index.html

# Или через Live Server (VSCode extension)
# Нажать Go Live
```

**Python server** (if needed):
```cmd
cd "c:/Users/Admin/Desktop/нормальня версия сайта"
python -m http.server 8000
start http://localhost:8000
```

**No dependencies / Без зависимостей** - pure frontend.

---

## 🎨 Attack Types / Типы атак

| Type / Тип | Color / Цвет | Description / Описание |
|------------|--------------|-----------------------|
| DDoS | 🔴 Red | Denial of Service |
| Phishing | 🟠 Orange | Social engineering |
| Malware | 🟣 Purple | Viruses/trojans |
| DDoS | 🔴 Красный | Отказ в обслуживании |
| Фишинг | 🟠 Оранжевый | Соц. инженерия |

---

## 📚 Topics / Темы (60+ articles)

- TIB (Триада ИИК): Confidentiality, Integrity, Availability
- Pentesting, OSINT, Phishing, Ransomware
- Cloud/IoT/ICS Security
- ТИБ, пентестинг, фишинг, ransomware

---

## 📱 Responsive / Адаптивность

Works on Desktop/Tablet/Mobile (tested).

---

## 🔒 SEO

- Meta tags, Open Graph, Schema.org
- sitemap.xml, robots.txt

---

## 📄 License

MIT License.

---

## 🤝 Contributing / Вклад

1. Add articles to `articles/`
2. Report issues
3. Translate/enhance

**Roadmap / Дорожная карта** (from about.html):
- [x] Interactive map + glossary (77 terms)
- [x] 60+ articles + 2 tests
- [ ] Full course/tests expansion
- [ ] New features (secret)

---

## 🙏 Thanks / Благодарности

D3.js, Font Awesome, SecurityLab.ru (news source).

**© 2026 CyberThreat Explorer** 🛡️

*Updated: Accurate stats/structure for current version.*


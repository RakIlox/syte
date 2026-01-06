# Разведка и сбор информации

## Важность разведки

Разведка (Reconnaissance) — это первый и один из наиболее важных этапов пентестинга. По различным оценкам, 60-80% успешных атак начинаются со сбора информации. Хорошо проведённая разведка позволяет:
- Понять структуру и технологии целевой системы
- Выявить потенциальные точки входа
- Сэкономить время на последующих этапах
- Повысить шансы на успешное проникновение

Разведка делится на два типа: пассивную (без прямого контакта с целью) и активную (с прямым взаимодействием).

## Пассивная разведка

### Поиск информации о домене

**Инструменты и команды:**

```bash
# Whois — информация о владельце домена
whois example.com

# Dig — DNS запросы
dig example.com ANY
dig MX example.com
dig NS example.com
dig TXT example.com

# dnsrecon — комплексный DNS анализ
dnsrecon -d example.com
dnsrecon -d example.com -t brt
```

**Что искать:**
- Имена серверов (NS записи)
- Почтовые серверы (MX записи)
- IP адреса
- Записи SPF, DMARC
- Информация о регистраторе и владельце

**Пример вывода whois:**
```
Domain Name: example.com
Registrar: REGISTRAR-NAME
Registrant Email: admin@example.com
Admin Name: Ivan Ivanov
Tech Name: Petr Petrov
Name Server: ns1.example.com
Name Server: ns2.example.com
Creation Date: 2010-01-01
Expiration Date: 2026-01-01
```

### Поиск поддоменов

Поддомены часто содержат тестовые, устаревшие или менее защищённые системы.

**Инструменты:**

```bash
# Sublist3r — поиск поддоменов
sublist3r -d example.com

# Amass — продвинутый поиск поддоменов
amass enum -d example.com

#assetfinder
assetfinder example.com

# crt.sh — поиск по сертификатам
curl -s "https://crt.sh/?q=example.com" | grep -oP '[\w\.-]+\.example\.com' | sort -u
```

**Варианты поиска поддоменов:**
- Google Dorks: `site:*.example.com`
- DNS zone transfer (если разрешён)
- Поиск в социальных сетях
- Анализ GitHub репозиториев

### Поиск технологий

**WhatWeb:**
```bash
whatweb example.com
whatweb -v example.com
```

**Wappalyzer** — расширение для браузера

**BuiltWith** — онлайн сервис

**Что определять:**
- Web сервер (Apache, Nginx, IIS)
- Язык программирования (PHP, Python, Node.js)
- CMS (WordPress, Joomla, Drupal)
- Фреймворки
- CDN
- Аналитические системы

### Поиск по IP адресам

**Shodan:**
```bash
# Поиск устройств
search example.com

# Конкретный IP
host 192.168.1.1

# Поиск уязвимых систем
search "default password"
```

**Censys:**
```bash
# Поиск сертификатов
censys certs example.com

# Поиск хостов
censys hosts example.com
```

### Сбор email и сотрудников

```bash
# theHarvester
theHarvester -d example.com -b all

# LinkedIn для социальной инженерии
# Hunter.io
# Clearbit Connect
```

### Анализ социальных сетей

**Что искать:**
- Техническая информация от сотрудников
- Используемые технологии
- Слайды с конференций
- Вакансии (указывают технологический стек)

## Активная разведка

### Сканирование портов

**Nmap — основной инструмент:**

```bash
# Базовое сканирование
nmap example.com

# С определением сервисов
nmap -sV example.com

# С определением ОС
nmap -O example.com

# Полное сканирование
nmap -sS -sV -O -p- example.com

# Скрытое сканирование (SYN scan)
nmap -sS example.com

# Скрипты Nmap
nmap --script=vuln example.com
nmap --script=http-title example.com

# Вывод в файл
nmap -oN scan.txt example.com
nmap -oX scan.xml example.com
```

**Типы сканирования:**

| Тип | Ключ | Описание |
|-----|------|----------|
| SYN Scan | -sS | Быстрый, скрытный |
| TCP Connect | -sT | Полное TCP соединение |
| UDP Scan | -sU | Сканирование UDP портов |
| ACK Scan | -sA | Определение firewall |
| Window Scan | -sW | Определение фильтров |

**Пример вывода Nmap:**
```
Nmap scan report for example.com
PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 8.2p1
80/tcp   open  http        Apache httpd 2.4.41
443/tcp  open  ssl/https   Apache httpd 2.4.41
3306/tcp open  mysql       MySQL 5.7.32
```

### Определение технологий веб-приложения

```bash
# HTTP methods
curl -X OPTIONS -v http://example.com

# Robots.txt
curl http://example.com/robots.txt

# Заголовки сервера
curl -I http://example.com

# Сканер веб-технологий
whatweb -v example.com

# Wappalyzer CLI
wappalyzer -v http://example.com
```

### Сбор метаданных файлов

```bash
# exiftool для изображений
exiftool photo.jpg

# strings для бинарных файлов
strings program.exe | grep http

# pdfinfo для PDF
pdfinfo document.pdf
```

### Traceroute

```bash
traceroute example.com
mtr example.com  # интерактивный traceroute
```

## OSINT фреймворки

### Maltego

Комплексная платформа для визуализации связей между объектами.

**Возможности:**
- Трансформации для сбора данных
- Визуализация связей
- Интеграция с множеством источников

### theHarvester

```bash
# Сбор email с разных источников
theHarvester -d company.com -b all -f result.html

# Только с определённых источников
theHarvester -d company.com -b linkedin -s 200
```

### Recon-ng

Модульный фреймворк для веб-разведки.

```bash
# Запуск
recon-ng

# Добавление домена
workspaces add test_company
db insert domains company.com

# Поиск поддоменов
modules load discovery/hosts/brute_hosts
run

# Поиск email
modules load reconnaissance/contacts/gather/http/email_enum
run
```

## Практические техники

### Google Dorks для разведки

```
site:example.com          — страницы на сайте
site:example.com filetype:xls  — Excel файлы
site:example.com filetype:pdf  — PDF документы
site:example.com intitle:admin — страницы с "admin" в заголовке
site:example.com inurl:login   — страницы логина
site:example.com "password"    — файлы с паролями
site:example.com "confidential" — конфиденциальные документы
cache:example.com        — сохранённая копия
```

### GitHub Dorks

```
example.com api_key
example.com password
example.com secret
example.com credentials
filename:.env
```

### Wayback Machine

Архив веб-страниц для поиска:
- Старых версий сайта
- Удалённых страниц с чувствительной информацией
- Изменений в структуре

```bash
# waybackurls
cat domains.txt | waybackurls > archived.txt
```

## Организация собранной информации

Создайте структурированную документацию:

```
recon/
├── scope.txt          # Определение границ
├── domain-info/       # Информация о доменах
│   ├── whois.txt
│   ├── dns.txt
│   └── subdomains.txt
├── technology/        # Технологии
│   ├── web-technologies.txt
│   └── server-info.txt
├── people/            # Сотрудники
│   └── emails.txt
├── network/           # Сетевая информация
│   ├── ports.txt
│   └── services.txt
└── vulnerabilities/   # Потенциальные уязвимости
    └── notes.txt
```

## Выводы

Качественная разведка — залог успешного пентестинга. Используйте комбинацию пассивных и активных методов, документируйте все находки и постоянно расширяйте арсенал инструментов. Помните о правовых границах — даже активная разведка должна быть согласована с клиентом.

---

**Следующий урок:** Сканирование и энумерация — углублённый анализ сетевых сервисов и систем.


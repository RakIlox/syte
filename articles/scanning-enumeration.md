# Сканирование и энумерация

## Введение

Сканирование и энумерация — это этап, на котором пентестер активно взаимодействует с целевыми системами для получения детальной информации о сервисах, версиях программного обеспечения, конфигурации и потенциальных уязвимостях. Этот этап следует сразу после разведки и является критически важным для успешного пентестинга.

## Сканирование портов

### Основы сканирования портов

Порты — это виртуальные точки соединения, через которые сетевые сервисы принимают и отправляют данные. Всего существует 65535 портов, разделённых на группы:
- **0-1023** — системные порты (HTTP, HTTPS, SSH, FTP)
- **1024-49151** — зарегистрированные порты
- **49152-65535** — динамические/приватные порты

### Nmap в деталях

**Синтаксис Nmap:**
```bash
nmap [опции] [цели]
```

**Основные опции:**

| Опция | Описание |
|-------|----------|
| `-sS` | SYN scan (скрытный) |
| `-sT` | TCP connect scan |
| `-sU` | UDP scan |
| `-sV` | Определение версий сервисов |
| `-O` | Определение операционной системы |
| `-p` | Указание портов |
| `-A` | Все вместе (OS, version, script, traceroute) |
| `-T` | Скорость сканирования (0-5) |
| `--script` | Запуск NSE скриптов |

**Примеры сканирования:**

```bash
# Сканирование топ-100 портов
nmap --top-ports 100 example.com

# Сканирование конкретных портов
nmap -p 80,443,8080 example.com

# Сканирование диапазона портов
nmap -p 1-1000 example.com

# Сканирование всех портов
nmap -p- example.com

# С определением версий и ОС
nmap -sV -O -A example.com

# Быстрое сканирование
nmap -T4 -F example.com

# Скрытное сканирование (SYN flood может быть замечен)
nmap -sS -T2 example.com
```

**Уровни скорости (-T):**
- **T0** — параноидальный (очень медленный)
- **T1** — скрытный
- **T2** — вежливый
- **T3** — нормальный (по умолчанию)
- **T4** — агрессивный
- **T5** — безумный

### Определение версий сервисов

При определении версий Nmap отправляет специальные запросы и анализирует ответы:

```bash
nmap -sV example.com
```

**Пример вывода:**
```
PORT     STATE SERVICE     VERSION
22/tcp   open  ssh         OpenSSH 8.2p1 Ubuntu 4ubuntu0.1
80/tcp   open  http        Apache httpd 2.4.41 ((Ubuntu))
443/tcp  open  ssl/https   Apache httpd 2.4.41
3306/tcp open  mysql       MySQL 5.7.32-0ubuntu0.18.04.1
```

**Важность определения версий:**
- Выявление устаревших версий с известными уязвимостями
- Поиск CVE для конкретных версий
- Выбор правильных эксплойтов

### Определение операционной системы

```bash
nmap -O example.com
```

Nmap анализирует особенности TCP/IP стека для определения ОС.

**Пример вывода:**
```
Device type: general purpose
Running: Linux 4.X|5.X
OS CPE: cpe:/o:linux:linux_kernel:4
OS details: Linux 4.15 - 5.6
```

### Скрипты Nmap (NSE)

Nmap Scripting Engine позволяет автоматизировать множество задач:

```bash
# Скрипты для определения уязвимостей
nmap --script=vuln example.com

# Скрипты для сбора информации
nmap --script=http-title example.com
nmap --script=http-headers example.com
nmap --script=http-enum example.com

# Скрипты для проверки аутентификации
nmap --script=auth example.com

# Скрипты для конкретных сервисов
nmap --script=ssh-brute example.com
nmap --script=ftp-anon example.com
nmap --script=http-sql-injection example.com
```

**Полезные категории скриптов:**
- `vuln` — проверка уязвимостей
- `exploit` — попытки эксплуатации
- `auth` — аутентификация
- `default` — стандартный набор
- `discovery` — обнаружение информации
- `brute` — подбор паролей

## Энумерация сервисов

### HTTP/HTTPS

**Определение веб-сервера и технологий:**

```bash
# Заголовки ответа
curl -I http://example.com

# Методы HTTP
curl -X OPTIONS -v http://example.com

# TRACE (может быть опасен)
curl -X TRACE http://example.com

# Сканирование директорий (dirb)
dirb http://example.com/
dirb http://example.com/ /usr/share/wordlists/dirb/common.txt

# Gobuster
gobuster dir -u http://example.com -w /usr/share/wordlists/dirb/common.txt
gobuster dir -u http://example.com -w /usr/share/wordlists/dirbuster(directory-list-2.3-medium.txt

# Файлы и директории
gobuster dir -u http://example.com -x php,html,txt -w wordlist.txt
```

**Что искать на веб-сервере:**
- Админ-панели (/admin, /wp-admin, /phpmyadmin)
- Файлы конфигурации (.env, config.php, web.config)
- Бэкапы (*.bak, *.backup, *.sql)
- Скрытые файлы (.git, .DS_Store, .htaccess)
- Уязвимые компоненты

**Сканеры веб-уязвимостей:**
```bash
# Nikto
nikto -h http://example.com

# OWASP ZAP (GUI)
# Burp Suite (GUI)

# Nuclei (автоматическое сканирование)
nuclei -u http://example.com -t cves/
```

### SSH

```bash
# Информация о версии
ssh -V example.com

# Попытка анонимного входа
ssh anonymous@example.com

# Подбор пользователей (если разрешено)
hydra -l root -P passwords.txt ssh://example.com
hydra -L users.txt -P passwords.txt ssh://example.com

# Nmap скрипты
nmap --script=ssh-brute example.com
nmap --script=ssh2-enum-algos example.com
```

### FTP

```bash
# Анонимный доступ
ftp example.com
# user: anonymous
# password: any@email.com

# Nmap скрипты
nmap --script=ftp-anon example.com
nmap --script=ftp-brute example.com

# Определение версии
nc -v example.com 21
```

### SMB (Windows)

```bash
# Enum4linux
enum4linux -a example.com

# Nbtscan
nbtscan example.com

# Nmap скрипты
nmap --script=smb-enum-shares example.com
nmap --script=smb-enum-users example.com
nmap --script=smb-vuln-* example.com

# rpcclient
rpcclient -U "" example.com
```

### MySQL/MariaDB

```bash
# Подключение
mysql -h example.com -u root

# Nmap скрипты
nmap --script=mysql-enum example.com
nmap --script=mysql-brute example.com
nmap --script=mysql-info example.com

# Подбор паролей
hydra -l root -P passwords.txt mysql://example.com
```

### SNMP

```bash
# SNMP-check
snmp-check example.com

# Snmpwalk
snmpwalk -v2c -c public example.com

# Onesixtyone
onesixtyone -c /usr/share/wordlists/seclists/Discovery/SNMP/common-snmp-community-strings.txt example.com

# Nmap скрипты
nmap --script=snmp-brute example.com
nmap --script=snmp-info example.com
```

### DNS

```bash
# Zone transfer
dig axfr example.com @ns1.example.com

# dnsrecon
dnsrecon -d example.com -t axfr

# Fierce
fierce -domain example.com

# Nmap скрипты
nmap --script=dns-zone-transfer example.com
nmap --script=dns-brute example.com
```

## Специализированные инструменты

### Masscan

Быстрое сканирование портов для больших диапазонов:

```bash
# Быстрое сканирование
masscan 0.0.0.0/0 -p0-65535 --rate=100000

# Сканирование подсети
masscan 192.168.1.0/24 -p80,443 --rate=10000
```

### RustScan

Быстрая альтернатива Nmap, написанная на Rust:

```bash
rustscan -a example.com -- -sV
```

### Unicornscan

Асинхронный сканер для специализированных задач:

```bash
unicornscan example.com:a
```

## Анализ результатов

### Создание матрицы сервисов

| IP | Порт | Сервис | Версия | ОС | Уязвимости |
|----|------|--------|--------|-----|------------|
| 192.168.1.10 | 22 | SSH | OpenSSH 8.2p1 | Linux | - |
| 192.168.1.10 | 80 | HTTP | Apache 2.4.41 | Linux | CVE-2021-xxx |
| 192.168.1.10 | 443 | HTTPS | Apache 2.4.41 | Linux | - |
| 192.168.1.10 | 3306 | MySQL | 5.7.32 | Linux | weak password |

### Поиск CVE для найденных версий

```bash
# searchsploit (Exploit-DB)
searchsploit openssh 8.2
searchsploit apache 2.4.41

# cve search
cve 2021-41773

# NVD (National Vulnerability Database)
# https://nvd.nist.gov
```

### Приоритизация целей

1. **Критические** — публичные эксплойты, RCE
2. **Высокие** — LPE, SQLi, XSS с высоким Impact
3. **Средние** — информационные утечки, CSRF
4. **Низкие** — информационные уведомления

## Практический пример

**Сценарий:** Сканирование целевой сети

```bash
# 1. Быстрое сканирование для определения живых хостов
nmap -sn 192.168.1.0/24

# 2. Сканирование портов на найденных хостах
nmap -sS -sV -O 192.168.1.10,15,20

# 3. Поиск веб-серверов
gobuster dir -u http://192.168.1.10 -w /usr/share/wordlists/dirb/common.txt

# 4. Поиск уязвимостей
nmap --script=vuln 192.168.1.10

# 5. Сохранение результатов
nmap -sS -sV -O 192.168.1.10 -oN scan_results.txt
```

## Выводы

Сканирование и энумерация требуют глубокого понимания сетевых протоколов и сервисов. Используйте правильные инструменты для каждой задачи, документируйте все находки и систематизируйте результаты. Помните о влиянии вашего сканирования на целевую сеть — некоторые методы могут быть обнаружены или заблокированы.

---

**Следующий урок:** Оценка уязвимостей — как находить и классифицировать уязвимости в системах.


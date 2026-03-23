# Форензика оперативной памяти

## Введение

Форензика оперативной памяти (memory forensics) — это анализ дампов памяти для обнаружения артефактов вредоносной активности, которые невозможно найти на диске.

## Почему память важна

- Вредоносное ПО может не оставлять следов на диске
- Содержит расшифрованные данные
- Хранит пароли в открытом виде
- Показывает скрытые процессы

## Инструменты

### Volatility Framework

```bash
# Определение профиля
volatility -f memory.dmp imageinfo

# Список процессов
volatility -f memory.dmp pslist

# Дерево процессов
volatility -f memory.dml pstree

# Скрытые процессы
volatility -f memory.dmp psxview

# Сетевые соединения
volatility -f memory.dmp netscan

# DLL процессов
volatility -f memory.dmp ldrmodules

# Реестр
volatility -f memory.dmp hivelist
volatility -f memory.dmp printkey -K "Microsoft\\Windows\\CurrentVersion\\Run"
```

### Расширенный анализ

```bash
# Снимки экрана
volatility -f memory.dmp screenshot -D screenshots/

# Комманданая строка
volatility -f memory.dmp cmdscan

# Bash history
volatility -f memory.dmp bash

# Список LDR (обнаружение инъекций)
volatility -f memory.dmp malfind -D malfind_out/

# Скрытые процессы (DKOM атаки)
volatility -f memory.dmp hollowfind

# Образы дисков
volatility -f memory.dmp filescan
volatility -f memory.dmp dumpfiles -n -r \\.exe
```

## Анализ процессов

### Поиск подозрительных процессов

```python
# Признаки вредоносного процесса
suspicious_indicators = [
    "explorer.exe",      # Часто подменяют
    "svchost.exe",       # Много вариаций
    "lsass.exe",         # Цель Mimikatz
    "powershell.exe",    # Скриптовые атаки
    "cmd.exe",           # Командная строка
    "rundll32.exe",      # Загрузка DLL
    "regsvr32.exe",      #Squiblydoo
]
```

### Анализ инъекций в память

```bash
# Malfind - поиск подозрительных участков памяти
volatility -f memory.dmp malfind -D output/

# Проверка на хук-инъекции
volatility -f memory.dmp inlinehooks
volatility -f memory.dmp importscan
volatility -f memory.dmp apihooks
```

## Анализ сети

### Сетевые соединения в памяти

```bash
# Активные соединения
volatility -f memory.dmp netscan
volatility -f memory.dmp connections
volatility -f memory.dmp connscan

# Истории соединений
volatility -f memory.dmp sockscan
volatility -f memory.dmp udpscan
```

### Извлечение URL и доменов

```bash
# Строки, связанные с сетью
strings memory.dmp | grep -E "(http|https)://"
strings memory.dmp | grep -E "[a-zA-Z0-9]+\.[a-zA-Z]{2,}"

# Кэш DNS
volatility -f memory.dmp dnsparse
```

## Анализ реестра

### Ключи автозагрузки

```bash
volatility -f memory.dmp hivelist
volatility -f memory.dmp printkey -K "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run"
volatility -f memory.dmp printkey -K "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
volatility -f memory.dmp printkey -K "HKLM\\SYSTEM\\CurrentControlSet\\Services"
```

### Извлечение паролей

```bash
# Хеши SAM
volatility -f memory.dmp hashdump

# LSA Secrets
volatility -f memory.dmp lsadump

# Кэш браузеров (через плагины)
volatility -f memory.dmp browserhistory
```

## Артефакты вредоносного ПО

### Mimikatz

```bash
# Поиск артефактов Mimikatz
volatility -f memory.dmp mimikatz
volatility -f memory.dmp lsadump
volatility -f memory.dmp privilege
```

### Скрытые процессы (Rootkit)

```bash
# Сравнение списков
volatility -f memory.dmp pslist
volatility -f memory.dmp psscan
volatility -f memory.dmp thrdproc

# Различия указывают на скрытые процессы
volatility -f memory.dmp psxview
```

## Практический кейс: анализ заражения

### Шаг 1: Сбор информации

```bash
volatility -f infected.dmp imageinfo
volatility -f infected.dmp kdbgscan
```

### Шаг 2: Анализ процессов

```bash
# Основной список
volatility -f infected.dmp pstree > pstree.txt

# Скрытые процессы
volatility -f infected.dmp psscan > psscan.txt

# Сравнение
diff pstree.txt psscan.txt
```

### Шаг 3: Сетевая активность

```bash
volatility -f infected.dmp netscan > network.txt
grep "ESTABLISHED" network.txt
```

### Шаг 4: Анализ памяти

```bash
volatility -f infected.dmp malfind -D malfind/
strings malfind/*.dmp | grep -E "(pass|pwd|login|auth)"
```

## Создание timeline

```bash
# Mactime - временная шкала событий
volatility -f memory.dmp mactime -b timeline.txt > mactime_output.txt
```

## Сохранение результатов

```bash
# Экспорт всех подозрительных процессов
volatility -f memory.dmp procdump -D procs/

# Экспорт DLL
volatility -f memory.dmp dlldump -D dlls/

# Полный дамп памяти
volatility -f memory.dmp raw2dmp -o output.dmp
```

## Лучшие практики

1. **Сначала создайте копию** дампа памяти
2. **Документируйте** все команды
3. **Сохраняйте оригинальный** дамп нетронутым
4. **Используйте хеши** для проверки целостности
5. **Работайте в изолированной** среде


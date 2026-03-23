# Incident Response: реагирование на инциденты

## Введение

Incident Response (IR) — это структурированный подход к управлению и реагированию на инциденты информационной безопасности с минимизацией ущерба и восстановлением нормальной работы.

## Фазы реагирования

### 1. Подготовка (Preparation)

```markdown
## Чек-лист подготовки

### Организационные меры
- [ ] Создание IR команды
- [ ] Определение ролей и ответственности
- [ ] Установление каналов связи
- [ ] Создание контактной базы
- [ ] Согласование с юридическим отделом

### Техническая подготовка
- [ ] Настройка EDR/XDR решений
- [ ] Конфигурация SIEM
- [ ] Подготовка forensic toolkit
- [ ] Настройка sandbox среды
- [ ] Создание war room
```

### 2. Идентификация (Identification)

```bash
# Мониторинг событий
# Splunk
index=security sourcetype=WinEventLog:Security 
| stats count by EventCode, src_ip, user

# Elastic
GET /security/_search
{
  "query": {
    "match": {"event.category": "authentication"}
  }
}

# Оповещения
# Sigma rule
title: Suspicious PowerShell Download
status: experimental
logsource:
  product: windows
  service: powershell
detection:
  selection:
    ScriptBlockImage: '*System.IO.Compression*'
    CommandLine|contains:
      - 'DownloadString'
      - 'DownloadFile'
  condition: selection
```

### 3. Сдерживание (Containment)

#### Краткосрочное сдерживание

```bash
# Сетевой уровень
# Block IP on firewall
iptables -A INPUT -s 185.234.xxx.xxx -j DROP

# Windows Firewall
netsh advfirewall firewall add rule name="Block C2" ^
    dir=in action=block remoteip=185.234.xxx.xxx

# Отключение учетной записи
net user malicious_user /active:no

# Остановка процесса
taskkill /F /PID 1234
```

#### Долгосрочное сдерживание

```markdown
## Изоляция хоста

1. Отключение от сети (preserve port)
2. Создание forensic image
3. Блокировка C2 доменов на DNS
4. Удаление вредоносных scheduled tasks
5. Очистка реестра автозагрузки
```

### 4. Эрадикация (Eradication)

```bash
# Поиск и удаление вредоносного ПО
# ClamAV
clamscan -r /path/to/scan --remove=yes

# Windows Defender
Start-MpScan -ScanPath C:\ -ScanType FullScan

# Поиск следов
Get-ChildItem -Path C:\Users\*\AppData\Roaming -Recurse -Filter "*.exe"
Get-ScheduledTask | Where-Object {$_.Actions.Execute -like "*powershell*"}
```

### 5. Восстановление (Recovery)

```markdown
## Процедура восстановления

1. Валидация очистки
   - Проверка сканерами
   - Мониторинг аномалий
   - Анализ логов

2. Восстановление из бэкапа
   - Проверка целостности
   - Восстановление критических систем
   - Постепенный ввод в эксплуатацию

3. Валидация восстановления
   - Функциональное тестирование
   - Проверка интеграций
   - Мониторинг 72 часа
```

### 6. Уроки (Lessons Learned)

```markdown
## Post-Incident Review

### Что произошло?
- Время обнаружения: 14:30
- Время реакции: 15 минут
- Время устранения: 4 часа
- Источник: Фишинговое письмо

### Что сработало хорошо?
- Быстрое обнаружение EDR
- Эффективная изоляция

### Что нужно улучшить?
- Обновление anti-phishing обучения
- Расширение email filtering
- Улучшение процедуры эскалации
```

## Playbooks

### Playbook: Ransomware Attack

```yaml
# incident_playbook_ransomware.yaml
name: Ransomware Response
trigger: EDR alert or user report

steps:
  - step: Isolation
    action: 
      - Isolate endpoint from network
      - Block C2 domains on DNS
      - Notify IR team
      
  - step: Assessment
    action:
      - Identify ransomware variant
      - Check encryption scope
      - Determine entry point
      
  - step: Containment
    action:
      - Block lateral movement paths
      - Disable compromised accounts
      - Preserve forensic evidence
      
  - step: Recovery
    action:
      - Restore from clean backup
      - Validate backup integrity
      - Monitor for reinfection
```

### Playbook: Data Breach

```yaml
name: Data Breach Response
trigger: DLP alert or external notification

steps:
  - step: Triage
    action:
      - Assess data sensitivity
      - Determine scope
      - Check if personal data
      
  - step: Containment
    action:
      - Block exfiltration paths
      - Revoke access tokens
      - Reset credentials
      
  - step: Notification
    action:
      - Legal review
      - Regulatory notification
      - Customer notification
      
  - step: Remediation
    action:
      - Fix vulnerability
      - Update access controls
      - Enhanced monitoring
```

## Документирование инцидентов

```markdown
# Incident Report Template

## Summary
- **Incident ID:** INC-2024-0015
- **Severity:** High
- **Status:** Closed
- **Discovery Date:** 2024-01-15
- **Resolution Date:** 2024-01-16

## Timeline (UTC)
| Time | Event |
|------|-------|
| 14:30 | Alert triggered |
| 14:35 | IR team notified |
| 14:45 | Host isolated |
| 15:00 | Initial assessment |
| 18:30 | Containment complete |

## Technical Details
### Attack Vector
Phishing email with malicious attachment

### Impact
- 3 user accounts compromised
- No data exfiltration confirmed
- 2 systems encrypted

## Response Metrics
- MTTD: 5 minutes
- MTTR: 4 hours
- Scope: Contained to initial vector
```

## Метрики IR

| Метрика | Описание | Бенчмарк |
|---------|----------|----------|
| MTTD | Mean Time To Detect | < 24 часа |
| MTTA | Mean Time To Acknowledge | < 15 минут |
| MTTR | Mean Time To Respond | < 4 часов |
| MTTC | Mean Time To Contain | < 1 часа |
| MTTResolve | Mean Time To Resolve | < 24 часов |


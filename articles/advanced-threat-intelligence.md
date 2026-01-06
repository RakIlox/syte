# Threat Intelligence: сбор и анализ данных об угрозах

## Введение

Threat Intelligence (разведка угроз) — это сбор, анализ и применение информации о киберугрозах для защиты организации.

## Типы разведки угроз

### Стратегическая (Strategic)

**Аудитория:** Руководство, совет директоров

**Содержание:**
- Тренды киберпреступности
- Отчёты о группах APT
- Геополитические риски
- Финансовые последствия атак

**Источники:**
- Gartner, Forrester
- Annual reports
- Industry associations

### Тактическая (Tactical)

**Аудитория:** CISO, менеджеры ИБ

**Содержание:**
- TTPs (Tactics, Techniques, Procedures)
- Инфраструктура атакующих
- Сводки об угрозах
- IOC базы

**Источники:**
- MITRE ATT&CK
- STIX/TAXII feeds
- ISACs (Information Sharing and Analysis Centers)

### Операционная (Operational)

**Аудитория:** SOC, IR команды

**Содержание:**
- Индикаторы компрометации (IOC)
- IoC (Indicators of Compromise)
- Hashes, IPs, Domains
- YARA правила

**Источники:**
- VirusTotal
- AlienVault OTX
- MISP platforms
- Commercial feeds (Recorded Future, Mandiant)

### Техническая (Technical)

**Аудитория:** Аналитики, инженеры

**Содержание:**
- Конкретные IoC
- Сэмплы вредоносного ПО
- Network artifacts
- PCAP дампы

## Форматы обмена данными

### STIX (Structured Threat Information Expression)

```json
{
  "type": "bundle",
  "objects": [
    {
      "type": "indicator",
      "id": "indicator--d4f7f8g9-h0i1-j2k3-l4m5-n6o7p8q9r0s1",
      "created": "2024-01-15T10:30:00.000Z",
      "modified": "2024-01-15T10:30:00.000Z",
      "name": "APT29 C2 Domain",
      "pattern": "[domain-name:value = 'update.microsoft-security[.]com']",
      "valid_from": "2024-01-15T10:30:00.000Z",
      "labels": ["malicious-activity"]
    }
  ]
}
```

### TAXII (Trusted Automated eXchange of Intelligence Information)

```python
from taxii2client import Server

# Подключение к TAXII серверу
server = Server('https://taxii.example.com')
print(server.title)

# Получение доступных коллекций
for collection in server.collections:
    print(f"{collection.id}: {collection.title}")
```

### OpenIOC

```xml
<Indicator iid="FileHash-MD5">
    <Context document="FileItem" condition="is">FileItem/MD5sum</Context>
    <Value>5d41402abc4b2a76b9719d911017c592</Value>
</Indicator>
```

## MITRE ATT&CK Framework

### Навигация по матрице

```bash
# Примеры техник
# Persistence
T1547.001 - Boot or Logon Autostart Execution
T1547.009 - Accessibility Features
T1053 - Scheduled Task/Job

# Privilege Escalation
T1068 - Exploitation for Privilege Escalation
T1548 - Abuse Elevation Control Mechanism

# Defense Evasion
T1070 - Indicator Removal
T1027 - Obfuscated Files or Information
T1211 - Exploitation for Defense Evasion

# Credential Access
T1003 - OS Credential Dumping
T1555 - Credentials from Password Stores
T1110 - Brute Force
```

### Создание mapping

```python
# Mapping техник к правилам обнаружения
detection_rules = {
    "T1053": {
        "sigma": "rules/windows/process_creation/win_schtask_creation.yml",
        "splunk": 'index=winevent EventCode=4688 CommandLine="*schtasks*"',
        "kql": 'DeviceProcessEvents | where InitiatingProcessFileName endswith "schtasks.exe"'
    },
    "T1003": {
        "sigma": "rules/windows/builtin/win_lsass_dump.yml",
        "splunk": 'index=winevent EventCode=4654 HandleName="*lsass*"',
        "kql": 'DeviceProcessEvents | where ProcessCommandLine contains "lsass"'
    }
}
```

## Работа с IoC

### Сбор IoC из открытых источников

```python
import requests
import json

class ThreatIntelCollector:
    def __init__(self):
        self.sources = {
            'otx': 'https://otx.alienvault.com/api/v1/indicators',
            'vt': 'https://www.virustotal.com/v3/files',
            'misp': 'https://misp.example.com'
        }
    
    def get_vt_report(self, hash_value):
        url = f"{self.sources['vt']}/{hash_value}"
        headers = {'x-apikey': 'YOUR_API_KEY'}
        return requests.get(url, headers=headers).json()
    
    def get_otx_pulses(self, ioc_type, value):
        url = f"{self.sources['otx']}/{ioc_type}/{value}/pulses"
        return requests.get(url).json()
```

### YARA правила

```yara
rule APT_Group_Custom_Malware {
    meta:
        author = "Threat Intel Team"
        description = "Detects custom malware used by APT group"
        severity = "critical"
        mitre_attack = "T1059 - Command and Scripting Interpreter"
    
    strings:
        $s1 = "powershell.exe -nop -w hidden -c" nocase
        $s2 = "TVqQAAMAAAAEAAAA//8AALg" base64
        $s3 = {4D 5A 90 00 03 00 00 00}
        $domain = /update-[a-z]{4,10}\.com/
    
    condition:
        uint16(0) == 0x5A4D and
        ($s1 or $s2) and
        $domain
}

rule Ransomware_BlackCat {
    meta:
        author = "Security Team"
        description = "BlackCat/ALPHV ransomware detection"
        
    strings:
        $magic = { 42 4C 41 43 4B 43 41 54 }
        $note = "RECOVER-README.txt" nocase
        $encryption = { 00 00 00 00 00 00 00 00 [0-1000] 00 00 00 00 }
        
    condition:
        $magic at 0 or ($note and $encryption)
}
```

## Создание песочницы разведки

### Архитектура

```yaml
# docker-compose.yml для Threat Intel Platform
version: '3.8'
services:
  misp:
    image: misp/misp
    ports:
      - "80:80"
    environment:
      - MISP_ADMIN_EMAIL=admin@example.com
      - MISP_ADMIN_PASSWORD=securepassword
      
  maltiverse:
    image: maltiverse/maltiverse
    ports:
      - "5000:5000"
      
  thehive:
    image: thehiveproject/thehive
    ports:
      - "9000:9000"
      
  cortex:
    image: thehiveproject/cortex
    ports:
      - "9001:9001"
```

### Интеграция с SIEM

```python
# Отправка IoC в Splunk
import requests

def push_to_splunk(ioc_data):
    url = "https://splunk.example.com:8088/services/collector/event"
    headers = {"Authorization": "Splunk YOUR_TOKEN"}
    
    event = {
        "sourcetype": "threat_intel",
        "event": {
            "type": ioc_data['type'],
            "value": ioc_data['value'],
            "source": ioc_data['source'],
            "severity": ioc_data['severity'],
            "timestamp": ioc_data['timestamp']
        }
    }
    
    requests.post(url, json=event, headers=headers)
```

## Метрики эффективности

| Метрика | Описание | Целевое значение |
|---------|----------|------------------|
| MTTD | Mean Time To Detect | < 24 часа |
| MTTR | Mean Time To Respond | < 4 часов |
| Coverage | Покрытие ATT&CK | > 70% |
| False Positive | Ложные срабатывания | < 5% |

## Работа с APT группами

### Профилирование группы

```python
apt_profiles = {
    "APT29": {
        "aliases": ["Cozy Bear", "Nobelium", "YTTRIUM"],
        "country": "Russia",
        "target_sectors": ["Government", "Think Tanks", "Diplomacy"],
        "ttps": [
            "T1071.001 - Application Layer Protocol: Web Protocols",
            "T1003.001 - LSASS Memory",
            "T1027 - Obfuscated Files or Information",
            "T1566.001 - Spearphishing Attachment"
        ],
        "tools": [
            "Mimikatz",
            "Cobalt Strike",
            "Custom backdoors"
        ],
        "infrastructure": [
            "Exfiltration: HTTPS",
            "C2: Domain fronting"
        ]
    }
}
```


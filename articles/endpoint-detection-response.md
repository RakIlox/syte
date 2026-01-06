# Endpoint Detection and Response (EDR)

## Введение в EDR

EDR — это технология для обнаружения и расследования подозрительной активности на конечных точках (компьютерах, серверах).

## Архитектура EDR

```markdown
## Компоненты EDR

1. **Agent** — агент на каждой конечной точке
2. **Backend** — облачная или локальная платформа
3. **Console** — интерфейс для аналитиков
4. **Automation** — автоматизация реагирования

## Функции EDR

- Сбор телеметрии (процессы, файлы, сеть, реестр)
- Поведенческий анализ
- Обнаружение угроз в реальном времени
- Расследование инцидентов
- Удалённое реагирование
```

## Расследование с EDR

```python
# Пример работы с EDR API
class EDRInvestigation:
    def __init__(self, edr_api):
        self.api = edr_api
        
    def get_process_tree(self, hostname):
        """Получить дерево процессов"""
        return self.api.get(f"/endpoints/{hostname}/processes")
    
    def get_network_connections(self, hostname):
        """Сетевые соединения"""
        return self.api.get(f"/endpoints/{hostname}/network")
    
    def isolate_endpoint(self, hostname):
        """Изоляция хоста"""
        return self.api.post(f"/endpoints/{hostname}/isolate")
    
    def hunt_ioc(self, ioc_type, value):
        """Охота по IoC"""
        return self.api.post("/hunt", {
            "type": ioc_type,
            "value": value
        })
```

## Правила обнаружения

```yaml
# Пример детекта для EDR
- name: Credential Dumping via LSASS
  description: Detect LSASS access for credential dumping
  severity: critical
  
  conditions:
    - event_type: process_access
      target_image: "lsass.exe"
      access_mask: "0x1010"  # PROCESS_ALL_ACCESS
      
    - event_type: process_creation
      command_line|contains:
        - "mimikatz"
        - "procdump"
        - "lsass.exe -ma"
        
  response:
    - alert: high
    - auto_isolate: true
    - collect_forensics: true
```

## MITRE ATT&CK Mapping

```python
ATTACK_TECHNIQUES = {
    "T1003.001": {
        "name": "LSASS Memory",
        "edr_detection": [
            "ProcessAccess to LSASS",
            "Handle duplication to LSASS",
            "Mimikatz activity"
        ]
    },
    "T1055": {
        "name": "Process Injection",
        "edr_detection": [
            "Remote thread creation",
            "APC injection",
            "SetThreadContext"
        ]
    }
}
```

## Интеграция с SIEM

```python
# Отправка EDR событий в SIEM
def forward_edr_alert(alert):
    siem_event = {
        "source": "EDR",
        "severity": alert.severity,
        "hostname": alert.hostname,
        "process_name": alert.process.name,
        "command_line": alert.process.command_line,
        "technique_id": alert.mitre_technique,
        "timestamp": alert.timestamp.isoformat()
    }
    send_to_splunk(siem_event)
```

## Best Practices

1. Включить все модули EDR
2. Настроить auto-response для критических детектов
3. Регулярно охотиться по TI
4. Интегрировать с SOAR
5. Проводить purple team exercises


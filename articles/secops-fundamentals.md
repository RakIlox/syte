# Security Operations (SecOps)

## Введение в SecOps

Security Operations (SecOps) — это комплексный подход к обеспечению безопасности, объединяющий технологии, процессы и людей для защиты организации от киберугроз.

## Компоненты SecOps

### Security Operations Center (SOC)

**Структура SOC:**

| Уровень | Функция | Задачи |
|---------|---------|--------|
| L1 | Мониторинг | Первичная фильтрация алертов |
| L2 | Анализ | Детальное расследование |
| L3 | Реагирование | Расследование инцидентов |
| L4 | Улучшение | Оптимизация процессов |

**Метрики SOC:**
- MTTD (Mean Time To Detect) — время обнаружения
- MTTR (Mean Time To Respond) — время реагирования
- MTTC (Mean Time To Contain) — время сдерживания
- Количество обработанных алертов
- Процент ложных срабатываний

## Архитектура мониторинга

```yaml
# SIEM Architecture (ELK Stack)
logstash.conf:
  input {
    beats { port => 5044 }
    tcp { port => 5000 }
  }
  
  filter {
    if [type] == "firewall" {
      grok { match => { "message" => "%{IP:src_ip} -> %{IP:dst_ip}" } }
    }
    if [event][code] == 4625 {
      mutate { add_field => { "alert_type" => "failed_login" } }
    }
  }
  
  output {
    elasticsearch {
      hosts => ["localhost:9200"]
      index => "security-logs-%{+YYYY.MM.dd}"
    }
  }
```

## Alert Management

```python
class AlertTriage:
    def calculate_severity(self):
        severity_map = {
            'critical': ['ransomware', 'data_exfiltration'],
            'high': ['unauthorized_access', 'malware'],
            'medium': ['policy_violation', 'suspicious_activity'],
            'low': ['minor_policy_violation']
        }
        for severity, keywords in severity_map.items():
            if any(kw in self.alert.description.lower() for kw in keywords):
                return severity
        return 'info'
```

## Threat Intelligence Integration

TI интеграция позволяет обогащать алерты данными об известных угрозах, определять кампании и группировки атакующих.

## Playbook: Alert to Incident

**Шаг 1: Валидация**
- Проверить, не ложный ли это срабатывание
- Подтвердить, что событие реальное
- Определить затронутые системы

**Шаг 2: Классификация**
| Приоритет | Описание |
|-----------|----------|
| P1 | Критический — активная атака |
| P2 | Высокий — попытка атаки |
| P3 | Средний — подозрительная активность |
| P4 | Низкий — требует проверки |

## Лучшие практики

1. Автоматизация рутинных задач
2. Регулярный тренинг команды
3. Red/Blue/Purple Team упражнения
4. Metrics-driven улучшения
5. Интеграция с Threat Intelligence


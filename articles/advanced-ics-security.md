# Industrial Control Systems (ICS) Security

## Введение

Безопасность промышленных систем управления (ICS/SCADA) критически важна для защиты критической инфраструктуры: электростанций, водоснабжения, нефтегазовой отрасли и производства.

## Архитектура ICS

### Компоненты системы

```markdown
## Уровни Purdue Model

| Уровень | Название | Примеры |
|---------|----------|---------|
| 5 | Enterprise Network | ERP, почта, интернет |
| 4 | Site Business Planning | MES, планирование |
| 3 | Site Operations | Инженерные станции |
| 2 | Area Supervisory Control | Historian, HMI |
| 1 | Basic Control | PLC, RTU, DCS |
| 0 | Process | Датчики, приводы |

## Сети ICS
- **Fieldbus:** Modbus, Profibus, Foundation Fieldbus
- **Industrial Ethernet:** PROFINET, EtherNet/IP, EtherCAT
- **Protocols:** OPC UA, DNP3, IEC 61850
```

### Сравнение IT vs OT

| Аспект | IT | OT |
|--------|----|-----|
| Приоритет | Confidentiality | Availability, Integrity |
| Время работы | Перезагрузки | 24/7 без остановки |
| Жизненный цикл | 3-5 лет | 15-20 лет |
| Патчи | Частые | Редкие, тестируемые |
| ОС | Windows, Linux | Специализированные |
| Аутентификация | AD, SSO | Локальная |

## Уязвимости ICS

### Типичные уязвимости

```markdown
## Категории уязвимостей

### 1. Слабая аутентификация
- Default credentials (admin:admin)
- Отсутствие шифрования
- HTTP вместо HTTPS

### 2. Отсутствие сегментации
- Flat networks
- DMZ между уровнями
- Нет firewall rules

### 3. Устаревшие протоколы
- Modbus без аутентификации
- Cleartext коммуникация
- Отсутствие integrity checks

### 4. Remote Access
- VPN без MFA
- Устаревший software
- Неотслеживаемые подключения
```

### Известные атаки

```markdown
## Исторические инциденты

### Stuxnet (2010)
- **Цель:** Ядерные центрифуги Ирана
- **Метод:** PLC programming manipulation
- **Ущерб:** Физическое разрушение 20% центрифуг

### Ukraine Power Grid Attack (2015, 2016)
- **Цель:** Электросеть Украины
- **Метод:** Firmware replacement, SCADA manipulation
- **Ущерб:** Отключение электричества на 6 часов

### TRITON/TRISIS (2017)
- **Цель:** Нефтеперерабатывающий завод в Саудовской Аравии
- **Метод:** Targeting Safety Instrumented Systems (SIS)
- **Ущерб:** Потенциальный взрыв

### Colonial Pipeline (2021)
- **Цель:** Оператор топливных трубопроводов
- **Метод:** Ransomware
- **Ущерб:** Остановка на 6 дней
```

## Assessment Methodologies

### ICS Assessment Framework

```python
# ICS Pentest Checklist
class ICSPentest:
    def __init__(self, scope):
        self.scope = scope  # Список IP адресов/диапазонов
    
    def passive_recon(self):
        """Пассивная разведка"""
        tasks = [
            "Shodan search for PLCs",
            "Search for exposed ICS protocols",
            "Censys for industrial devices",
            "ICS-CERT advisories review",
            "Google dorking for HMI systems"
        ]
        return tasks
    
    def active_discovery(self):
        """Активное обнаружение"""
        nmap_scans = [
            # Обнаружение PLC
            "nmap -p 102 --script s7-info.nse 192.168.1.0/24",
            
            # Modbus
            "nmap -p 502 --script modbus-discover 192.168.1.0/24",
            
            # EtherNet/IP
            "nmap -p 44818 --script enip-enumerate 192.168.1.0/24",
            
            # OPC UA
            "nmap -p 4840 --script opcua-enumerate 192.168.1.0/24",
            
            # Общее сканирование
            "nmap -p- --script=ICS 192.168.1.0/24"
        ]
        return nmap_scans
    
    def protocol_analysis(self):
        """Анализ протоколов"""
        tools = [
            ("Modbus", "mbtget, modscan, plcscan"),
            ("Siemens S7", "s7scan, plcscan, snap7"),
            ("DNP3", "dnp3scan, pymodbus"),
            ("IEC 61850", "mms-client, libiec61850"),
            ("OPC UA", "opcua-browser, python-opcua")
        ]
        return tools
```

### Эксплуатация протоколов

```python
# Modbus клиент для тестирования
from pymodbus.client.sync import ModbusTcpClient

def modbus_test(target_ip, port=502):
    client = ModbusTcpClient(target_ip, port)
    
    # Чтение coils
    client.connect()
    rr = client.read_coils(0, 10)
    print(f"Coils: {rr.bits}")
    
    # Чтение holding registers
    rr = client.read_holding_registers(0, 10)
    print(f"Registers: {rr.registers}")
    
    # Проверка на запись
    # ВНИМАНИЕ: Только на тестовой среде!
    # client.write_coils(0, [True]*10)
    
    client.close()

# Siemens S7 коммуникация
from snap7 import client

def s7_connect(target_ip, rack=0, slot=1):
    c = client.Client()
    c.connect(target_ip, 0, rack, slot)
    
    # Чтение PLC info
    info = c.get_cpu_info()
    print(f"Module: {info.ModuleName}")
    print(f"Serial: {info.SerialNumber}")
    
    # Чтение данных из DB
    data = c.db_read(1, 0, 100)
    print(f"DB1 data: {data}")
    
    c.disconnect()
```

## Defense Strategies

### Сегментация сети

```yaml
# Архитектура DMZ для ICS
network:
  vlans:
    - id: 10
      name: "IT_Network"
      subnet: "10.0.10.0/24"
      
    - id: 20
      name: "ICS_DMZ"
      subnet: "10.0.20.0/24"
      
    - id: 30
      name: "ICS_Control"
      subnet: "10.0.30.0/24"
      
    - id: 40
      name: "ICS_Process"
      subnet: "10.0.40.0/24"
      
  firewalls:
    - rules:
      # IT -> DMZ (только необходимые порты)
      - allow: src=10.0.10.0/24, dst=10.0.20.0/24, port=443
      
      # DMZ -> Control (单向, однонаправленно)
      - allow: src=10.0.20.0/24, dst=10.0.30.0/24, port=102
      
      # Запрет всего остального
      - deny: any
```

### Uniidirectional Security Gateways

```markdown
## Однонаправленные шлюзы (Data Diodes)

### Принцип работы
- Аппаратный передатчик (светодиод)
- Аппаратный приёмник (фотодиод)
- Только один путь передачи данных

### Применение
```
[ICS Network] ---> [Transmitter] ---> [Fiber Optic Cable] ---> [Receiver] ---> [DMZ/IT Network]
```

### Преимущества
- Физическая невозможность обратного канала
- Защита от внешних атак
- Соответствие NERC CIP, NIST SP 800-82
```

### Monitoring and Detection

```bash
# ICS-aware IDS/IPS
# Suricata с правилами для ICS

# Modbus правило
alert modbus any any -> any any (msg:"ICS-Modbus Write Single Coil"; 
    modbus.func_code:5; sid:2000001; rev:1;)

alert modbus any any -> any any (msg:"ICS-Modbus Write Multiple Coils"; 
    modbus.func_code:15; sid:2000002; rev:1;)

# Siemens S7
alert s7comm any any -> any any (msg:"ICS-S7 Stop PLC"; 
    s7comm.param2:0x29; sid:2000003; rev:1;)

# Обнаружение сканирования
alert tcp any any -> any any (msg:"ICS-Protocol Scan"; 
    flags:S; threshold:type both, track by_src, count 10, seconds 60; 
    sid:2000004;)
```

## Incident Response для ICS

```markdown
## ICS Incident Response Playbook

### Phase 1: Assessment
1. Определить затронутые системы
2. Оценить влияние на физический процесс
3. Связаться с операционным персоналом

### Phase 2: Containment
1. Изолировать сегмент сети (не отключать!)
2. Активировать резервные системы
3. Переключиться на ручное управление при необходимости

### Phase 3: Eradication
1. Удалить вредоносное ПО
2. Восстановить конфигурации PLC
3. Обновить firmware при необходимости

### Phase 4: Recovery
1. Постепенный ввод в эксплуатацию
2. Мониторинг аномалий
3. Валидация нормальной работы

### Phase 5: Lessons Learned
1. Анализ причин
2. Обновление сегментации
3. Улучшение мониторинга
```

## Standards and Frameworks

| Стандарт | Описание |
|----------|----------|
| NIST SP 800-82 | Guide to Industrial Control Systems Security |
| IEC 62443 | Industrial Automation and Control Systems Security |
| NERC CIP | Critical Infrastructure Protection (энергетика США) |
| CISA ICS Security | Cybersecurity and Infrastructure Security Agency |
| MITRE ATT&CK для ICS | Tactics and Techniques для ICS |

## Best Practices

```markdown
## Рекомендации по безопасности ICS

### Организационные
- [ ] Выделенная команда ИБ для ICS
- [ ] Регулярные учения
- [ ] Связь между ИТ и ОТ (operations technology)
- [ ] Инвентаризация всех устройств

### Технические
- [ ] Сегментация сети (Purdue Model)
- [ ] Однонаправленные шлюзы для критических систем
- [ ] Мониторинг аномалий в реальном времени
- [ ] Резервные копии конфигураций PLC
- [ ] Аппаратные backup/restore

### Операционные
- [ ] patch management с тестированием
- [ ] Change management для всех изменений
- [ ] Аудит доступа к ICS сетям
- [ ] Мониторинг физического доступа
```


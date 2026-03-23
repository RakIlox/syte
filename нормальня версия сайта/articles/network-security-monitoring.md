# Сетевой мониторинг безопасности

## Введение

Сетевой мониторинг безопасности (NSM) — это сбор, анализ и интерпретация сетевого трафика для обнаружения и расследования инцидентов безопасности.

## Методы сбора данных

### Passive Monitoring

```bash
# Настройка Zeek (Bro)
# /opt/zeek/share/zeek/site/local.zeek

redef Log::default_rotation_interval = 1h;
redef Log::default_log_dir = "/var/log/zeek";

@load base/protocols/http
@load base/protocols/dns
@load base/protocols/ssl
@load base/protocols/ssh

# Кастомные скрипты
event http_request(c: connection, method: string, original_URI: string, unescaped_URI: string, version: string) {
    if (/\.exe$/ in original_URI) {
        Log::write(HTTP_EXE, [$ts=network_time(), $conn=c, $uri=original_URI]);
    }
}
```

### Active Monitoring

```bash
# Nmap для активного обнаружения
nmap -sV -sC -O -oA nmap_scan 192.168.1.0/24

# Masscan для быстрого сканирования
masscan 192.168.1.0/24 -p80,443,22 --rate=10000

# Zeek для анализа PCAP
zeek -r capture.pcap Log::all_paths
```

## Анализ трафика

### Detecting C2 Communication

```python
# Detection using Zeek logs
def detect_c2_behavior():
    """Обнаружение C2 коммуникаций"""
    
    dns_patterns = [
        r'[a-z]{8,}\.xyz',
        r'[a-z]{6,}\.top',
        r'\d{1,3}\.\d{1,3}\.xyz',
    ]
    
    http_patterns = [
        r'POST /[a-z]{6,}',
        r'User-Agent: (python-requests|curl)',
        r'Content-Type: application/octet-stream',
    ]
    
    beacon_intervals = [
        (30, 60),      # Короткие интервалы
        (300, 600),    # Средние интервалы
    ]
```

### YARA Rules для сетевого трафика

```yara
rule C2_Beacon_Detection {
    meta:
        description = "Detects C2 beaconing patterns"
        severity = "high"
    
    strings:
        $dns_query = /[a-z]{8,}\.(xyz|top|cc|tk|ml|ga|cf)/
        $user_agent1 = "python-requests/2."
        $user_agent2 = "curl/7."
        $post_data = { 00 00 00 [1-10] 00 00 }
        
    condition:
        $dns_query and ($user_agent1 or $user_agent2)
}
```

## SIEM Integration

```python
# Normalization для SIEM
def normalize_network_log(log):
    return {
        'timestamp': log['ts'],
        'src_ip': log['id.orig_h'],
        'dst_ip': log['id.resp_h'],
        'src_port': log['id.orig_p'],
        'dst_port': log['id.resp_p'],
        'protocol': log.get('proto', 'tcp'),
        'bytes_in': log.get('orig_bytes', 0),
        'bytes_out': log.get('resp_bytes', 0),
        'event_type': log.get('event_type', 'unknown')
    }
```

## Network-baseline

```python
class NetworkBaseline:
    def __init__(self):
        self.hourly_patterns = {}
        self.weekly_patterns = {}
        
    def build_baseline(self, data):
        """Построение baseline сети"""
        # Средний трафик по часам
        for hour in range(24):
            self.hourly_patterns[hour] = self.calc_avg(
                filter_by_hour(data, hour)
            )
            
        # Пиковые часы: 9-11, 14-16
        # Ночное время: 1-5 (минимум)
        
    def detect_anomaly(self, current_traffic):
        """Обнаружение аномалий"""
        hour = datetime.now().hour
        baseline = self.hourly_patterns[hour]
        
        if current_traffic > baseline * 2:
            return {'type': 'traffic_spike', 'severity': 'medium'}
```

## Лучшие практики

1. Полный захват трафика (PCAP)
2. Индексация для быстрого поиска
3. Корреляция с хостовыми логами
4. Сравнение с baseline
5. Интеграция с TI


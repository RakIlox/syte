# Реверс-инжиниринг вредоносного ПО

## Введение

Реверс-инжиниринг (обратная инженерия) — это процесс анализа программного обеспечения для понимания его функциональности без доступа к исходному коду. В сфере кибербезопасности это критически важный навык для анализа вредоносного ПО.

## Инструменты анализа

### Статический анализ

**Дизассемблеры:**
- IDA Pro — промышленный стандарт
- Ghidra — бесплатная альтернатива от NSA
- Radare2 — open-source фреймворк

**Утилиты:**
- strings — поиск текстовых строк
- peid/packerid — определение упаковщика
- detect-it-easy — определение типа файла

### Динамический анализ

**Песочницы:**
- Cuckoo Sandbox
- Any.Run
- Hybrid Analysis

**Отладчики:**
- x64dbg / x32dbg
- WinDbg
- GDB (Linux)

## Техники анализа

### 1. Определение упаковщика

Вредоносное ПО часто упаковано для обхода детектов:

```assembly
; Признаки упаковщика:
; - Мало строк в секции .text
; - Загрузка kernel32.dll в начале
; - Переходы через call/pop
```

### 2. Распаковка вручную

```python
# Признаки упаковки UPX
import pefile

pe = pefile.PE('sample.exe')
for section in pe.sections:
    if section.Name.strip(b'\x00') == b'UPX0':
        print("Обнаружена упаковка UPX")
```

### 3. Анализ API-вызовов

```python
import pefile

pe = pefile.PE('malware.exe')
for entry in pe.DIRECTORY_ENTRY_IMPORT:
    print(f"DLL: {entry.dll}")
    for imp in entry.imports:
        if imp.name:
            print(f"  - {imp.name}")
```

## Антиотладочные техники

### Примеры защит

```c
// IsDebuggerPresent
if (IsDebuggerPresent()) {
    ExitProcess(0);
}

// CheckRemoteDebuggerPresent
BOOL isDebugged;
CheckRemoteDebuggerPresent(GetCurrentProcess(), &isDebugged);
if (isDebugged) {
    TerminateProcess(GetCurrentProcess(), 0);
}

// NtQueryInformationProcess
typedef NTSTATUS (NTAPI *NtQueryInformationProcess_t)(
    HANDLE, PROCESS_INFORMATION_CLASS, PVOID, ULONG, PULONG);

NtQueryInformationProcess_t NtQueryInformationProcess = 
    (NtQueryInformationProcess_t)GetProcAddress(
        GetModuleHandleA("ntdll.dll"), "NtQueryInformationProcess");

HANDLE hProcess = GetCurrentProcess();
PROCESS_BASIC_INFORMATION pbi;
NtQueryInformationProcess(hProcess, ProcessBasicInformation, 
    &pbi, sizeof(pbi), NULL);
if (pbi.PebBaseAddress->BeingDebugged) {
    ExitProcess(0);
}
```

## Практический пример

### Анализ Ransomware

1. **Первичный анализ:**
   - Определение формата файла
   - Поиск строк (URL, IP, расшифрования)
   - Проверка на упаковку

2. **Динамический анализ:**
   - Запуск в песочнице
   - Перехват сетевых запросов
   - Мониторинг файловых операций

3. **Глубокий анализ:**
   - Дизассемблирование
   - Трассировка API-вызовов
   - Поиск ключей шифрования

## Индикаторы компрометации (IOC)

| Тип | Пример |
|-----|--------|
| SHA256 | a3f2b8c4d5e6... |
| C2 сервер | 185.234.xxx.xxx |
| Путь | C:\Users\Admin\AppData\Roaming\malware.exe |
| Registry | HKCU\Software\Microsoft\Windows\Run |
| Mutex | Global\\{A1B2C3D4-E5F6-7890} |

## Меры защиты

- Используйте виртуальные машины для анализа
- Изолируйте среду анализа
- Логируйте все действия
- Не запускайте образцы на хост-системе


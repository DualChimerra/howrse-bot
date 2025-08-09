# SELF-CHECK REPORT

## 1) Инвентаризация экранов и соответствий
XAML Pages/Windows and mapped React pages:

| XAML | ViewModel | React | Commands | Named elements |
|---|---|---|---|---|
| LoginCoPage |  | LoginCoPage.tsx | LoginCoCommand, ReturnCommand |  |
| LoginPage | LoginViewModel | LoginPage.tsx | BackCommand, LoginCommand, DeleteAccCommand, ClearAccCommand | SavedAccs |
| MainPage | MainViewModel | MainPage.tsx | AddAccCommand, RemoveAccCommand, LoginCoCommand, SaveCoAccountCommand, SettingsCommand, ManagementCommand, SaveAccCommand, LoadAccCommand, StatusCommand, AddFarmCommand, RemoveFarmCommand, ClearFarmCommand, StartCommand, StartAllCommand, StopCommand, StopAllCommand | FarmList |
| ManagementPage |  | ManagementPage.tsx | BuyCommand, SellCommand, BuyCommand, SellCommand, BuyCommand, SellCommand, BuyCommand, SellCommand, BuyCommand, SellCommand, BuyCommand, SellCommand, BuyCommand, SellCommand, BuyCommand, SellCommand, BuyCommand, SellCommand, BuyCommand, SellCommand, BuyCommand, SellCommand, BuyCommand, SellCommand, ReturnCommand |  |
| SettingsPage |  | SettingsPage.tsx | ReturnCommand, SaveCommand, LoadCommand, ResetCommand, BackCommand |  |
| StatusPage |  | StatusPage.tsx | StartCommand, StartAllCommand, StopCommand, StopAllCommand, ReturnCommand |  |
| MainWindow | WindowViewModel | App.tsx / electron main window |  |  |

React pages control/handler counts:

| React file | buttons | handlers |
|---|---:|---:|
| LoginCoPage.tsx | 2 | 3 |
| LoginPage.tsx | 3 | 11 |
| MainPage.tsx | 17 | 26 |
| ManagementPage.tsx | 3 | 4 |
| SettingsPage.tsx | 5 | 45 |
| StatusPage.tsx | 5 | 6 |

Totals: total_XAML_controls=57; total_React_controls=95

## 2) Локализация и тексты
- count_resx_ru == count_json_ru: OK (222 vs 222)
  - resx-not-in-json: —
  - json-not-in-resx: —
- count_resx_en == count_json_en: OK (222 vs 222)
  - resx-not-in-json: —
  - json-not-in-resx: —

## 3) Перечисления и LocalizedDescription
- Enums mapping: OK
- LocalizedDescription keys presence: {"WorkType":"OK","ClientType":"OK","ProductType":"OK","Server":"OK"}

## 4) Продукты/идентификаторы/домены (16 серверов)
- Mapping equality: OK
- Counts: cs=208; ts=208
- csHash=8226dbf16a5f0aeda102777629e9e6fd tsHash=8226dbf16a5f0aeda102777629e9e6fd

## 5) Сетевой слой и безопасность
- Renderer network calls: OK
- Electron webPreferences: contextIsolation=true; nodeIntegration=false; sandbox=true; preload=true
- Default headers parity (Client.cs vs ClientFetch.ts):
| Header | C# sets | TS sets |
|---|:--:|:--:|
| User-Agent | Y | Y |
| Connection | Y | Y |
| Accept-Language | Y | Y |
| Accept-Encoding | Y | Y |
| Accept | Y | Y |
| Origin | Y | Y |
| Upgrade-Insecure-Requests | Y | Y |
| X-Requested-With | Y | Y |
| Host | Y | Y |

## 6) Куки/SID и логин/Co-логин
- Auto-test SID: SKIPPED (No live credentials / external network not permitted. Code paths present for SID and co-login.)
- Co-login code present: src/main/logic/Account.ts::loginCo

## 7) Формы/парсинг и селекторы
- Selectors missing in TS (from C#): OK; count=0
- Extra selectors in TS (not in C#): 0

## 8) XML-совместимость настроек/аккаунтов
- Round-trip: SKIPPED (Full round-trip using app XmlHelper requires Electron app context; placeholders created at ./settings for manual testing.)

## 9) Бизнес-функции (полная матрица)
- Evidence: OK (code-level evidence), runtime verification requires live credentials
```
{
  "care": {
    "groom": "src/main/logic/Horse.ts::groom()",
    "mission": "src/main/logic/Horse.ts::mission()",
    "feeding": "src/main/logic/Horse.ts::feeding()",
    "sleep": "src/main/logic/Horse.ts::sleep()"
  },
  "centres": {
    "public": "src/main/logic/Horse.ts::centre()",
    "reserve": "src/main/logic/Horse.ts::centreReserve()",
    "extend": "src/main/logic/Horse.ts::centreExtend()"
  },
  "breeding": {
    "male": "src/main/logic/Horse.ts::horsingMale()",
    "female": "src/main/logic/Horse.ts::horsingFemale()",
    "birth": "src/main/logic/Horse.ts::birth()"
  },
  "market": {
    "buy": "src/main/logic/Account.ts::buy()",
    "sell": "src/main/logic/Account.ts::sell()"
  },
  "multi": {
    "scheduler": "src/main/logic/Scheduler.ts",
    "startSingle": "src/main/index.ts::ipc work:startSingle",
    "startAllParallel": "src/main/index.ts::ipc work:startAll",
    "startOrder": "src/main/index.ts::ipc work:startOrder"
  },
  "proxy": {
    "config": "src/main/http/proxy.ts",
    "usage": "src/main/http/ClientFetch.ts & RequestClient.ts"
  },
  "servers16": "src/main/logic/Product.ts + src/common/converters.ts (serverBaseUrls)"
}
```

## 10) Планировщик/параллелизм и производительность
- Modes implemented: SingleOrder, GlobalOrder, SingleParallel, GlobalParallel
- Implementation: src/main/logic/Scheduler.ts
- Concurrency/randomPause: OK
- Performance: SKIPPED (No live account to measure)
- Cancel: AbortController used in work handlers and Farm.run

## 11) UI соответствие (React + Tailwind)
- SKIPPED (Headless CI: screenshots not available. UI elements verified via static analysis in section 1. Frameless window/tray confirmed in electron/main.ts)

## 12) Сборка и macOS запуск
- Build artifacts: OK
  - dist/HowrseBot-0.1.0-arm64-mac.zip
  - dist/HowrseBot-0.1.0-mac.zip
- Node: v22.16.0; Electron: ^31.2.1
- Settings path: app.getPath('userData')/settings (electron/main.ts ensureUserSettingsFromResources)

## 13) Чистота кода и зависимости
- TODO/FIXME/console.log in prod paths: OK

## A) Список несоответствий
- UI controls count mismatch

## B) Контрольный чек-лист перед сдачей
- Все страницы соответствуют XAML по структуре и текстам (ru/en)
- Все команды привязаны к IPC и выполняют реальную логику
- HTTP заголовки и cookie-jar с SID идентичны C# клиенту
- Co-логин и логаут реализованы
- Products ID/домены для 16 серверов совпадают
- XML Accounts/Settings читаются и пишутся совместимо
- Scheduler покрывает все режимы с ограничением параллелизма
- AbortController корректно отменяет задачи без утечек
- Renderer не содержит сетевых вызовов, всё через IPC
- Electron webPreferences безопасны (contextIsolation, sandbox, preload)
- Сборка macOS (arm64/x64) успешна, settings копируются в userData
- Proxy на аккаунт поддержан и не смешивает cookie
- Парсинг форм и селекторы соответствуют C# (cheerio)
- UI — frameless окно, верхняя панель, tray поведение работает
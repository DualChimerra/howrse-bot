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
| LoginCoPage.tsx | 2 | 6 |
| LoginPage.tsx | 3 | 12 |
| MainPage.tsx | 17 | 44 |
| ManagementPage.tsx | 3 | 7 |
| SettingsPage.tsx | 5 | 9 |
| StatusPage.tsx | 5 | 13 |

Totals: total_XAML_controls=59; total_React_controls=126

## 2) Локализация и тексты
- count_resx_ru == count_json_ru: FAIL (222 vs 124)
  - resx-not-in-json: logo2, MainStoppedWorkMessage, MainWorkErrorMessage, MaleNames, ManagmentBuyErrorMessage, ManagmentPageApple, ManagmentPageBuyBtn, ManagmentPageCarrot, ManagmentPageEqu, ManagmentPageFlax, ManagmentPageHay, ManagmentPageLeather, ManagmentPageOat, ManagmentPageReturnBtn, ManagmentPageSand, ManagmentPageSellBtn, ManagmentPageShit, ManagmentPageSteel, ManagmentSellErrorMessage, ModeGlobalOrder, ModeGlobalParallel, ModeSingleOrder, ModeSingleParallel, None, Oat, OR, ReportErrorMessage, ReportMessage, ReportPageContactsText, ReportPageMessageText, ReportPageReturnBtn, ReportPageSendBtn, Sand, ServerArabic, ServerAustralia, ServerBulgaria, ServerCanada, ServerEngland, ServerFranceGaia, ServerFranceOuranos, ServerGermany, ServerInternational, ServerNorway, ServerPoland, ServerRomain, ServerRussia, ServerSpain, ServerSweden, ServerUSA, SettingsPageAcceptBtn, SettingsPageAffixText, SettingsPageAllText, SettingsPageBabiesChk, SettingsPageBabiesText, SettingsPageBuyBelowText, SettingsPageBuySellText, SettingsPageBuyWheatChk, SettingsPageCarrotChk, SettingsPageCenterText, SettingsPageCleanBloodChk, SettingsPageContinueChk, SettingsPageContinueToAllChk, SettingsPageFarmerText, SettingsPageFarmText, SettingsPageFemaleNameText, SettingsPageGoText, SettingsPageGPBelowText, SettingsPageHayQuanText, SettingsPageHorsingFemaleText, SettingsPageHorsingFemaleText2, SettingsPageHorsingMaleText, SettingsPageHPLimitText, SettingsPageLoadBtn, SettingsPageLoadSleepChk, SettingsPageMaleNameText, SettingsPageMissionChk, SettingsPageMissionOldChk, SettingsPageOatQuanText, SettingsPageOldHorseChk, SettingsPagePriceText, SettingsPageRandomNamesChk, SettingsPageRefreshBtn, SettingsPageReserveText, SettingsPageReturnBtn, SettingsPageSaveBtn, SettingsPageSelfChk, SettingsPageSelfMaleChk, SettingsPageSellMainText, SettingsPageSellShitChk, SettingsPageSellSubText, SettingsPageStartWithText, SettingsPageStrokeChk, SettingsPageTeamChk, SettingsPageToTeamChk, SettingsPageTurnOnCoChk, SettingsPageTurnOnFemaleChk, SettingsPageTurnOnMaleChk, SettingsPageWithHayChk, SettingsPageWithOatChk, Shit, SortAge, SortDate, SortName, SortPG, SortRace, SortSkills, StartAllErrorMessage1, StartAllErrorMessage2, StartAllErrorMessage3
  - json-not-in-resx: MainStartAllErrorMessage1, MainStartAllErrorMessage2, MainStartAllErrorMessage3, MainPageFarmsList, MainPageReloadFarmsBtn, MainPageAddAllFarmsBtn, MainPageQueueList, MainPageClearQueueBtn, MainPageAllFarms, MainPageRemoveBtn, ManagmentPageOR
- count_resx_en == count_json_en: FAIL (222 vs 229)
  - resx-not-in-json: logo2
  - json-not-in-resx: MainPageFarmsList, MainPageReloadFarmsBtn, MainPageAddAllFarmsBtn, MainPageQueueList, MainPageClearQueueBtn, MainPageAllFarms, MainPageRemoveBtn, ManagmentPageOR

## 3) Перечисления и LocalizedDescription
- Enums mapping: FAIL
  - WorkType: cs=[[LocalizedDescription("ModeSingleOrder", typeof(Resources))]
        SingleOrder, [LocalizedDescription("ModeGlobalOrder", typeof(Resources))]
        GlobalOrder, [LocalizedDescription("ModeSingleParallel", typeof(Resources))]
        SingleParallel, [LocalizedDescription("ModeGlobalParallel", typeof(Resources))]
        GlobalParallel] vs ts=[SingleOrder, GlobalOrder, SingleParallel, GlobalParallel]
  - Server: cs=[[LocalizedDescription("ServerAustralia", typeof(Resources))]
        Australia, [LocalizedDescription("ServerEngland", typeof(Resources))]
        England, [LocalizedDescription("ServerArabic", typeof(Resources))]
        Arabic, [LocalizedDescription("ServerBulgaria", typeof(Resources))]
        Bulgaria, [LocalizedDescription("ServerInternational", typeof(Resources))]
        International, [LocalizedDescription("ServerSpain", typeof(Resources))]
        Spain, [LocalizedDescription("ServerCanada", typeof(Resources))]
        Canada, [LocalizedDescription("ServerGermany", typeof(Resources))]
        Germany, [LocalizedDescription("ServerNorway", typeof(Resources))]
        Norway, [LocalizedDescription("ServerPoland", typeof(Resources))]
        Poland, [LocalizedDescription("ServerRussia", typeof(Resources))]
        Russia, [LocalizedDescription("ServerRomain", typeof(Resources))]
        Romain, [LocalizedDescription("ServerUSA", typeof(Resources))]
        USA, [LocalizedDescription("ServerFranceOuranos", typeof(Resources))]
        FranceOuranos, [LocalizedDescription("ServerFranceGaia", typeof(Resources))]
        FranceGaia, [LocalizedDescription("ServerSweden", typeof(Resources))]
        Sweden] vs ts=[Australia, England, Arabic, Bulgaria, International, Spain, Canada, Germany, Norway, Poland, Russia, Romain, USA, FranceOuranos, FranceGaia, Sweden]
  - ClientType: cs=[[LocalizedDescription("ClientNew", typeof(Resources))]
        New, [LocalizedDescription("ClientOld", typeof(Resources))]
        Old] vs ts=[New, Old]
  - ProductType: cs=[[LocalizedDescription("None", typeof(Resources))]
        None, [LocalizedDescription("Hay", typeof(Resources))]
        Hay, [LocalizedDescription("Oat", typeof(Resources))]
        Oat, [LocalizedDescription("Wheat", typeof(Resources))]
        Wheat, [LocalizedDescription("Shit", typeof(Resources))]
        Shit, [LocalizedDescription("Leather", typeof(Resources))]
        Leather, [LocalizedDescription("Apples", typeof(Resources))]
        Apples, [LocalizedDescription("Carrot", typeof(Resources))]
        Carrot, [LocalizedDescription("Wood", typeof(Resources))]
        Wood, [LocalizedDescription("Steel", typeof(Resources))]
        Steel, [LocalizedDescription("Sand", typeof(Resources))]
        Sand, [LocalizedDescription("Straw", typeof(Resources))]
        Straw, [LocalizedDescription("Flax", typeof(Resources))]
        Flax, [LocalizedDescription("OR", typeof(Resources))]
        OR] vs ts=[None, Hay, Oat, Wheat, Shit, Leather, Apples, Carrot, Wood, Steel, Sand, Straw, Flax, OR]
- LocalizedDescription keys presence: {"WorkType":"MISSING","ClientType":"MISSING","ProductType":"MISSING","Server":"OK"}

## 4) Продукты/идентификаторы/домены (16 серверов)
- Mapping equality: OK
- Counts: cs=208; ts=208
- csHash=8226dbf16a5f0aeda102777629e9e6fd tsHash=8226dbf16a5f0aeda102777629e9e6fd

## 5) Сетевой слой и безопасность
- Renderer network calls: OK
- Electron webPreferences: contextIsolation=true; nodeIntegration=true; sandbox=true; preload=true
- Default headers parity (Client.cs vs ClientFetch.ts):
| Header | C# sets | TS sets |
|---|:--:|:--:|
| User-Agent | N | Y |
| Connection | Y | Y |
| Accept-Language | N | Y |
| Accept-Encoding | N | Y |
| Accept | Y | Y |
| Origin | Y | Y |
| Upgrade-Insecure-Requests | Y | Y |
| X-Requested-With | Y | Y |
| Host | Y | N |

## 6) Куки/SID и логин/Co-логин
- Auto-test SID: SKIPPED (No live credentials / external network not permitted. Code paths present for SID and co-login.)
- Co-login code present: src/main/logic/Account.ts::loginCo

## 7) Формы/парсинг и селекторы
- Selectors missing in TS (from C#): FAIL; count=3
  #region, #endregion, #pragma
- Extra selectors in TS (not in C#): 7

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
- RU i18n counts mismatch
- EN i18n counts mismatch
- Enum members mismatch
- Selectors missing in TS vs C#

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
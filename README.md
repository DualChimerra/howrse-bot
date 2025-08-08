# howrse-bot
Требуется сразу создать полностью рабочее настольное приложение под macOS на Electron + React + TS + TailwindCSS, перенеся 1:1 ВСЮ функциональность, тексты, кнопки и разделы из исходника. Никаких заглушек/демо/моков. Работает с реальными данными и файлами исходного проекта. Исходную папку BotQually/ не изменять.

ВХОДНЫЕ ДАННЫЕ (структура исходника в /BotQually)
- Pages: LoginPage.xaml(.cs), LoginCoPage.xaml(.cs), SettingsPage.xaml(.cs), ManagementPage.xaml(.cs), MainPage.xaml(.cs), StatusPage.xaml(.cs)
- Windows: MainWindow.xaml(.cs)
- ViewModels: MainViewModel.cs, LoginViewModel.cs, LoginCoViewModel.cs, SettingsViewModel.cs, ManagementViewModel.cs, WindowViewModel.cs, Base/RelayCommand.cs, Base/RelayParamCommand.cs, Base/BaseViewModel.cs
- Models: Account.cs, GlobalSettings.cs, Settings.cs, Horse.cs, Farm.cs, Product.cs, BaseModel.cs, Parser.cs
- Classes: Client.cs, RequestClient.cs, IClient.cs, Enums.cs, MainHelper.cs, XmlHelper.cs, EnumDescriptionTypeConverter.cs, LocalizedDescriptionAttribute.cs, ExpressionHelpers.cs, Extensions.cs
- ValueConverters: AccTypeToContentConverter.cs, AccTypeToStringConverter.cs, BooleanToVisibilityConverter.cs, BoolToTickConverter.cs, BaseValueConverter.cs, EnumValues.cs, EnumValueToDecriptionConverter.cs
- Properties: Resources.resx, Resources.en.resx, Settings.settings, AssemblyInfo.cs, Resources.Designer.cs
- Resources: ruFlag.png, usaFlag.png, logo2.ico, startlogo.png, Arrow.png
- Прочее: App.xaml(.cs), NLog.config, FodyWeavers.*, App.config, BotQually.csproj

ЖЁСТКИЕ ТРЕБОВАНИЯ
1) Перенести всё 1:1: страницы, элементы UI, тексты/локализацию, команды, сетевую и бизнес-логику, работу с файлами, 16 игровых серверов, прокси, последовательный/параллельный запуск, 30+ настроек с сохранением на аккаунт, вход/со-вход (Co). Не добавлять/убирать функционал.
2) Исходную папку BotQually/ НЕ трогать. Новый код размещать вне неё.
3) Сетевые запросы, куки, файлы — только в main-процессе Electron; renderer обращается через IPC (preload + contextBridge). Никаких сетевых вызовов из renderer.
4) UI — современный flat на TailwindCSS, но структура, состав элементов и тексты в точности как в XAML.
5) Форматы данных, эндпоинты, параметры POST/GET, идентификаторы товаров, схема XML — строго как в исходнике.
6) Производительность: поддержать режимы и параллелизм так, чтобы не хуже ориентира ~1000 лошадей/30 мин (как в ТЗ).

ЦЕЛЕВАЯ СТРУКТУРА НОВОГО ПРОЕКТА (вне BotQually/)
- /electron
  - main.ts           // окно (frameless), меню/Tray, IPC, прокси, cookie-jar, файловые пути
  - preload.ts        // безопасный мост API для renderer
- /src/renderer
  - index.html
  - main.tsx, App.tsx
  - /pages            // 1:1 соответствия XAML-страницам: MainPage.tsx, SettingsPage.tsx, LoginPage.tsx, LoginCoPage.tsx, ManagementPage.tsx, StatusPage.tsx
  - /components       // переиспользуемые элементы (кнопки, поля, списки)
  - /i18n             // ru.json, en.json (конвертация из Resources.resx и Resources.en.resx)
- /src/common
  - enums.ts          // перенос Enums.cs (значения, имена без изменений)
  - types.ts          // интерфейсы моделей (Account, Settings, GlobalSettings, Horse, Farm, Product и т.д.)
  - converters.ts     // перенос конвертеров (BoolToTick, BooleanToVisibility и т.п.) как функции/селекторы
  - version.ts        // аналог MainHelper.GetProgramVersion()
- /src/main/http
  - IClient.ts
  - ClientFetch.ts    // эквивалент Client.cs (node-fetch@3 + fetch-cookie + tough-cookie)
  - RequestClient.ts  // эквивалент RequestClient.cs (ретраи/ошибки/AbortController)
  - cookies.ts        // работа с cookie-jar (persist), извлечение SID=sessionprod
  - proxy.ts          // настройка https-proxy-agent (и SOCKS если есть в исходнике)
- /src/main/logic
  - Parser.ts         // перенос Parser.cs на cheerio (и JSON→HTML вытяжка как в C#)
  - Horse.ts          // вся логика действий (формы, селекторы, POST, пагинация)
  - Account.ts        // логин/Co-логин, операции, последовательность действий
  - Product.ts        // полный словарь ID товаров/эндпоинтов для 16 серверов (из Product.cs)
  - Scheduler.ts      // режимы WorkType: Single/Global + Order/Parallel (лимит параллелизма)
- /src/main/storage
  - XmlHelper.ts      // строго совместимый XML I/O (fast-xml-parser), пути и схема 1:1
  - paths.ts          // пути к ./settings/Accounts.xml и ./settings/Settings.xml
- tailwind.config.js, postcss.config.js, package.json, tsconfig.json, vite.config.ts (или electron-vite)

ЗАВИСИМОСТИ (минимум)
- electron, electron-builder
- react, react-router, typescript, vite (или electron-vite)
- tailwindcss, postcss, autoprefixer
- node-fetch@3, fetch-cookie, tough-cookie, https-proxy-agent
- cheerio
- fast-xml-parser (или xml2js при полной совместимости)
- p-limit (или свой пул)

СЕТЕВОЙ СЛОЙ (ТОЧНЫЙ ПОРТ)
- Заголовки и поведение из Classes/Client.cs без изменений (User-Agent, X-Requested-With, Accept*, Origin, Connection/Keep-Alive, Upgrade-Insecure-Requests и т.д.).
- CookieJar персистентный; автообновление SID из cookie sessionprod на baseAddress.
- RequestClient.ts — та же стратегия ретраев/исключений/отмены (AbortController ~ CancellationToken).
- Прокси на уровне аккаунта, не смешивать куки между прокси.
- Эндпоинты, параметры POST/GET, форматы тел — ровно как в C#.

ПАРСИНГ/ДЕЙСТВИЯ (ТОЧНЫЙ ПОРТ)
- Parser.ts повторяет Parser.cs (cheerio.load, извлечение HTML из JSON-ответов по ключу).
- Horse.ts: парс форм (эквивалент ParseForm), проверка disabled, сбор скрытых полей, случайные значения как в C#, POST на нужные пути (/elevage/chevaux/...); пагинация (.pageNumbering a[data-page]).
- Все селекторы/формы/шаги — без изменений.

МОДЕЛИ/НАСТРОЙКИ/ЛОКАЛИЗАЦИЯ
- XmlHelper.ts: файлы ./settings/Accounts.xml и ./settings/Settings.xml — схема, имена узлов/атрибутов и значения по умолчанию строго как в C#. Совместимость загрузки/сохранения.
- Конвертация Properties/Resources.resx и Resources.en.resx → /src/renderer/i18n/ru.json и en.json; ключи/строки 1:1.
- enums.ts: перенос всех enum из Classes/Enums.cs, тексты LocalizedDescription брать из i18n (аналог EnumDescriptionTypeConverter/LocalizedDescriptionAttribute).
- Ресурсы (флаги/иконки) перенести и использовать как в XAML.

UI (React + Tailwind, 1:1 с XAML)
- Каждая XAML-страница → соответствующая React-страница; все элементы (кнопки, списки, чекбоксы, комбобоксы, инпуты, статусы, прогресс, счётчики) присутствуют и подписаны теми же строками (ru/en).
- Привязки/команды ViewModel → обработчики/состояния и вызовы IPC к main.
- Окно frameless; верхняя панель (кнопки, иконки), меню, переключение страниц — как в MainWindow.xaml.
- Tray по GlobalSettings (сворачивание в трей, старт/стоп, открыть/выход) работает на macOS.

БИЗНЕС-ФУНКЦИИ (ПЕРЕНЕСТИ ПОЛНОСТЬЮ)
- Базовый уход: чистка, миссия, кормление, сон.
- Запись в КСК: общественный/резервированный.
- Случки: предложения жеребцами (public) и принятие случек кобылами.
- Рождение жеребят: присвоение имени, завод, аффикс.
- Магазин/рынок: докупка фуража/овса, продажа пшеницы при нехватке экю.
- Мульти-аккаунты: последовательный и параллельный режимы, глобальные режимы WorkType (из Enums.cs).
- 16 игровых серверов: домены и ID товаров строго из Models/Product.cs.
- Скорость/устойчивость: учитывать ParallelHorse, RandomPause и прочие настройки.

ПАРАЛЛЕЛИЗМ
- Scheduler.ts реализует SingleOrder/GlobalOrder (последовательно) и SingleParallel/GlobalParallel (параллельно) c ограничением (p-limit/свой пул).
- Отмена задач через AbortController; корректные переходы состояния в UI.

СБОРКА/ЗАПУСК (macOS)
- npm scripts: dev (vite + electron с автоперезапуском), build (vite build + electron-builder для macOS arm64/x64), start (прод).
- Путь ./settings/ рядом с приложением; если недоступно в проде — использовать app.getPath('userData')/settings с автокопированием и полной совместимостью XML.

КРИТЕРИИ ГОТОВНОСТИ (ПРОВЕРКА)
- Все страницы/кнопки/поля из XAML существуют и работают; тексты совпадают (ru/en).
- Все команды ViewModel перенесены и вызывают реальную логику (нет no-op).
- HTTP/POST/GET и парсинг выполняются на реальных данных; SID=sessionprod извлекается и поддерживается.
- Прокси на аккаунт работает; параллельные режимы соответствуют WorkType.
- XML файлы читаются/пишутся в том же формате.
- Идентификаторы товаров и домены — идентичны Product.cs.
- Приложение собирается и запускается на macOS «из коробки», выполняет полный сценарий ухода/случек/покупок/рождения, показывает статусы/прогресс и умеет сворачиваться в Tray.

ВЫПОЛНИ ПОШАГОВО
1) Проанализируй BotQually/ и выпиши все используемые страницы/команды/энумы/ресурсы/эндпоинты/ID продуктов.
2) Создай структуру проекта (см. выше), сконвертируй .resx → i18n JSON, перенеси enums/конвертеры/типы.
3) Реализуй сетевой слой и XML I/O строго по Client.cs/RequestClient.cs/XmlHelper.cs.
4) Перенеси Parser.cs и логику Horse/Account; реализуй Scheduler и режимы WorkType.
5) Сверстай страницы в React+Tailwind 1:1 XAML и свяжи с IPC.
6) Собери под macOS и проверь чек-лист готовности. Никаких заглушек — всё должно работать сразу.

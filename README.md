# Dealive Mobile

Мобильное приложение для курьеров сервиса **Dealive** — платформы доставки. Приложение позволяет
курьерам просматривать доступные заказы, принимать их, отслеживать маршрут и управлять своим
профилем.

---

## Технологии

| Технология                                                           | Версия        | Назначение                |
| -------------------------------------------------------------------- | ------------- | ------------------------- |
| [React Native](https://reactnative.dev/)                             | 0.81.5        | Основной фреймворк        |
| [Expo](https://expo.dev/)                                            | ~54           | Платформа и инструменты   |
| [Expo Router](https://expo.github.io/router/)                        | ~6            | Файловая маршрутизация    |
| [Redux Toolkit](https://redux-toolkit.js.org/)                       | ^2.2          | Управление состоянием     |
| [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)         | встроен в RTK | Запросы к API             |
| [redux-persist](https://github.com/rt2zz/redux-persist)              | ^6            | Персистентность состояния |
| [Axios](https://axios-http.com/)                                     | ^1.7          | HTTP-клиент               |
| [React Hook Form](https://react-hook-form.com/)                      | ^7.53         | Управление формами        |
| [expo-location](https://docs.expo.dev/versions/latest/sdk/location/) | ~19           | Геолокация                |
| TypeScript                                                           | ^5.1          | Типизация                 |

---

## Структура проекта

```
src/
├── app/                        # Экраны (файловая маршрутизация Expo Router)
│   ├── _layout.tsx             # Корневой layout
│   ├── (auth)/                 # Экраны авторизации (логин, регистрация)
│   ├── (tabs)/                 # Основные вкладки (заказы, маршрут, настройки, поддержка)
│   ├── (special)/              # Специальные экраны (онбординг, оффлайн, ожидание одобрения)
│   ├── orders/                 # Экраны заказов
│   └── settings/               # Экраны настроек
│
├── components/
│   ├── contexts/               # React-контексты (Redux, Location)
│   ├── features/               # Фичи (OrderPreview)
│   ├── guards/                 # Гарды (AuthGuard, ConnectionGuard)
│   ├── screens/                # Компоненты экранов
│   ├── shared/                 # Переиспользуемые компоненты
│   ├── sheets/                 # Bottom sheets
│   ├── skeletons/              # Skeleton-загрузчики
│   └── ui/                     # UI-компоненты (Button, Input, etc.)
│
├── domain/
│   └── orders/                 # Доменная логика заказов (API, селекторы, типы)
│
├── hooks/                      # Кастомные хуки
├── services/                   # Сервисы (auth, route, chat, profile)
├── store/                      # Redux store и слайсы
├── constants/                  # Константы (цвета, шрифты, иконки)
├── helpers/                    # Вспомогательные функции
├── utils/                      # Утилиты
└── axios/                      # Настройка Axios (interceptors)
```

---

## Требования

- **Node.js** >= 18
- **npm** >= 9
- **Expo CLI** или **EAS CLI**
- Для iOS: macOS + Xcode
- Для Android: Android Studio + Android SDK

---

## Установка

```bash
# Клонировать репозиторий
git clone <repo-url>
cd dealive-mobile

# Установить зависимости
npm install
```

---

## Запуск в режиме разработки

```bash
# Запустить Metro bundler (сканировать QR через Expo Go)
npm run start

# Запустить на iOS симуляторе
npm run ios

# Запустить на Android эмуляторе
npm run android
```

---

## Проверка типов и линтинг

```bash
# Проверка TypeScript без компиляции
npm run typecheck

# Линтинг
npm run lint
```

---

## Сборка через EAS Build (Expo Application Services)

Проект использует [EAS Build](https://docs.expo.dev/build/introduction/) для облачной компиляции.

### Установка EAS CLI

```bash
npm install -g eas-cli
eas login
```

### Профили сборки

В проекте настроены три профиля в [`eas.json`](eas.json):

| Профиль       | Назначение                  | Дистрибуция             |
| ------------- | --------------------------- | ----------------------- |
| `development` | Dev-клиент для разработки   | Internal                |
| `preview`     | Тестовая сборка для команды | Internal                |
| `production`  | Релизная сборка             | App Store / Google Play |

### Команды сборки

```bash
# Preview-сборка (для тестирования)
eas build --profile preview --platform ios
eas build --profile preview --platform android
eas build --profile preview --platform all

# Production-сборка (для магазинов)
eas build --profile production --platform ios
eas build --profile production --platform android
eas build --profile production --platform all

# Development-сборка (dev client)
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Публикация в магазины

```bash
# Отправить в App Store / Google Play
eas submit --profile production --platform ios
eas submit --profile production --platform android
```

### OTA-обновления (без пересборки)

```bash
eas update --branch production --message "Описание обновления"
```

---

## Переменные окружения

API-сервер задаётся в [`app.json`](app.json):

```json
"extra": {
  "SERVER_URL": "https://api.dealive.ru"
}
```

---

## Архитектура

- **Маршрутизация** — файловая, через Expo Router (`src/app/`)
- **Состояние** — Redux Toolkit + RTK Query для API-запросов, redux-persist для сохранения маршрута
- **Геолокация** — обновляется каждую секунду, диспатчится в Redux только при смещении > 50 м
- **Авторизация** — JWT-токены, хранятся в `expo-secure-store`
- **Темизация** — поддержка светлой и тёмной темы через `useColorScheme`
- **Локализация** — поддержка русского и английского языков через `i18n-js`

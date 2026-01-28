# E-Shop - Prosty Sklep Internetowy

Projekt prostego sklepu internetowego stworzony na zaliczenie przedmiotu WDAI.

## Spis treści

- [Technologie](#technologie)
- [Architektura](#architektura)
- [Struktura projektu](#struktura-projektu)
- [Mikroserwisy Backend](#mikroserwisy-backend)
- [Funkcjonalności](#funkcjonalności)
- [Instalacja i uruchomienie](#instalacja-i-uruchomienie)
- [API Endpoints](#api-endpoints)
- [Autorzy](#autorzy)

---

## Technologie

### Frontend
| Technologia | Wersja | Opis |
|-------------|--------|------|
| React | 19.2.0 | Biblioteka UI |
| TypeScript | 5.9.3 | Typowanie statyczne |
| Vite | 7.2.4 | Build tool |
| Material UI | 7.3.7 | Komponenty UI |
| React Router | 7.12.0 | Routing |
| Lucide React | 0.563.0 | Ikony |
| Axios | - | HTTP Client |

### Backend
| Technologia | Opis |
|-------------|------|
| Node.js + Express | Serwer HTTP |
| Sequelize | ORM |
| SQLite | Baza danych |
| JWT (jsonwebtoken) | Autentykacja |
| bcrypt | Hashowanie haseł |

---

## Architektura

Projekt wykorzystuje architekturę **mikroserwisową** z trzema niezależnymi serwisami:

```
┌─────────────────┐     ┌─────────────────┐
│    Frontend     │────▶│   Service 1     │ :3001
│  React + Vite   │     │   (Produkty)    │
│     :5173       │     └─────────────────┘
│                 │     ┌─────────────────┐
│                 │────▶│   Service 2     │ :3002
│                 │     │  (Zamówienia)   │
│                 │     └─────────────────┘
│                 │     ┌─────────────────┐
│                 │────▶│   Service 3     │ :3003
│                 │     │  (Użytkownicy)  │
└─────────────────┘     └─────────────────┘
```

Każdy serwis posiada własną bazę SQLite i komunikuje się z frontendem przez REST API.

---

## Struktura projektu

```
Projekt_WDAI_2026/
├── backend/
│   ├── service1/              # Mikroserwis produktów
│   │   ├── app.js
│   │   ├── common/
│   │   │   ├── database.js
│   │   │   ├── models/Item.js
│   │   │   └── middlewares/IsAuthenticated.js
│   │   └── storage/data.db
│   │
│   ├── service2/              # Mikroserwis zamówień + opinii
│   │   ├── app.js
│   │   ├── common/
│   │   │   ├── database.js
│   │   │   ├── models/Orders.js
│   │   │   └── middlewares/IsAuthenticated.js
│   │   └── storage/data.db
│   │
│   └── service3/              # Mikroserwis użytkowników (auth)
│       ├── app.js
│       ├── common/
│       │   ├── database.js
│       │   └── models/User.js
│       └── storage/data.db
│
├── src/
│   ├── components/
│   │   ├── layout/            # Layout z nawigacją + ProtectedRoute
│   │   ├── homepage/          # Strona główna
│   │   ├── products/          # Produkty, filtry, szczegóły, opinie
│   │   ├── cart/              # Koszyk + Checkout
│   │   ├── account/           # Konto + Historia zamówień (User/Admin)
│   │   ├── login/             # Logowanie
│   │   ├── register/          # Rejestracja
│   │   └── common/            # Wspólne komponenty (QuantitySelector)
│   ├── context/               # React Context (AuthContext, CartContext)
│   ├── theme/                 # Motyw MUI (dark theme)
│   ├── types/                 # Interfejsy TypeScript
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
└── README.md
```

---

## Mikroserwisy Backend

### Service 1 - Produkty (Port 3001)
Zarządza katalogiem produktów.

| Endpoint | Metoda | Opis | Auth |
|----------|--------|------|------|
| `/api/items` | GET | Lista wszystkich produktów | ❌ |
| `/api/items/:id` | GET | Szczegóły produktu | ❌ |
| `/api/items` | POST | Dodaj produkt | ✅ |
| `/api/items/:id` | DELETE | Usuń produkt | ✅ |

**Model Item:** `id, title, price, description, category, image, stock`

---

### Service 2 - Zamówienia + Opinie (Port 3002)
Zarządza zamówieniami użytkowników oraz systemem opinii.

| Endpoint | Metoda | Opis | Auth |
|----------|--------|------|------|
| `/api/orders` | GET | Wszystkie zamówienia | ✅ Admin |
| `/api/orders/:userId` | GET | Zamówienia użytkownika | ✅ |
| `/api/orders` | POST | Złóż zamówienie | ✅ |
| `/api/orders/:id` | PATCH | Aktualizuj zamówienie | ✅ |
| `/api/orders/:id` | DELETE | Usuń zamówienie | ✅ |
| `/api/orders/:id/review` | POST | Dodaj opinię (1-5 gwiazdek) | ✅ |
| `/api/orders/:id/review/reset` | PATCH | Usuń opinię | ✅ Admin |
| `/api/items/:id/reviews` | GET | Opinie produktu + średnia | ❌ |

**Model Order:** `id, userId, itemId, quantity, reviewStars, reviewContent, createdAt`

---

### Service 3 - Użytkownicy (Port 3003)
Zarządza autentykacją i użytkownikami.

| Endpoint | Metoda | Opis | Auth |
|----------|--------|------|------|
| `/api/register` | POST | Rejestracja | ❌ |
| `/api/login` | POST | Logowanie (zwraca JWT) | ❌ |
| `/api/users/:id/email` | GET | Pobierz email użytkownika | ❌ |

**Model User:** `id, email, password (bcrypt hash), isAdmin (boolean)`

---

## Funkcjonalności

- [x] **Lista produktów** - pobieranie z API, responsywna siatka
- [x] **Wyszukiwarka produktów** - wyszukiwanie po nazwie
- [x] **Filtrowanie kategorii** - dropdown z dynamiczną listą
- [x] **Filtrowanie po cenie** - suwak z zakresem cenowym
- [x] **Strona szczegółów produktu** - opis, zdjęcie, cena, dostępność
- [x] **Wybór ilości produktu** - QuantitySelector (+/-)
- [x] **Koszyk** - dodawanie, usuwanie, zmiana ilości
- [x] **Przeliczanie koszyka** - automatyczna suma
- [x] **Checkout** - finalizacja zamówienia z adresem
- [x] **Rejestracja** - walidacja email + hasła (regex)
- [x] **Logowanie** - autentykacja JWT
- [x] **Strona konta** - wyświetlanie email, roli
- [x] **Historia zamówień** - lista zamówień użytkownika
- [x] **Opinie z gwiazdkami** - ocena 1-5 + komentarz
- [x] **Wyświetlanie opinii** - na stronie produktu ze średnią

- [x] **Zachowanie sesji** - localStorage (token + user + cart)
- [x] **Route Guards** - ProtectedRoute przekierowuje na /login
- [x] **Walidacja formularzy** - regex dla email i hasła
- [x] **Dark Theme** - ciemny motyw MUI

- [x] **Panel Admina** - widok wszystkich zamówień
- [x] **Usuwanie opinii** - admin może usunąć dowolną opinię
- [x] **Role użytkowników** - User vs Admin (isAdmin)
- [x] **Backend + Baza danych** - SQLite + Sequelize
- [x] **JWT Auth** - tokeny w nagłówku Authorization
- [x] **Material UI** - pełna biblioteka komponentów

---

## Instalacja i uruchomienie

### Wymagania
- Node.js >= 18
- npm >= 9

### Frontend
```bash
cd Projekt_WDAI_2026
npm install
npm run dev
```
Aplikacja dostępna pod: `http://localhost:5173`

### Backend (każdy serwis osobno)
```bash
# Terminal 1 - Service 1 (Produkty)
cd backend/service1
npm install
node app.js
# Serwer na porcie 3001

# Terminal 2 - Service 2 (Zamówienia)
cd backend/service2
npm install
node app.js
# Serwer na porcie 3002

# Terminal 3 - Service 3 (Użytkownicy)
cd backend/service3
npm install
node app.js
# Serwer na porcie 3003
```

### Konta testowe
Po uruchomieniu backendu można zarejestrować nowe konto lub użyć istniejących (jeśli baza została zainicjalizowana).

---

## Autentykacja

System wykorzystuje JWT (JSON Web Token):

1. **Rejestracja** (`/api/register`) - hasło hashowane bcrypt
2. **Logowanie** (`/api/login`) - zwraca token JWT + dane użytkownika
3. **Autoryzacja** - token wysyłany w nagłówku `Authorization: Bearer <token>`
4. **Middleware** - `IsAuthenticated.js` weryfikuje token i role

---

## Autorzy

| Imię i Nazwisko | Rola |
|-----------------|------|
| Kacper Hawro | Frontend - UI, produkty, wyszukiwanie |
| Antoni Statek | Frontend - koszyk, zamówienia, state |
| Mateusz Luciński | Backend - mikroserwisy, auth, baza danych |

---

## Licencja

Projekt edukacyjny - WDAI 2026

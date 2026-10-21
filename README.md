# QUIBROPETS 2.0

Versión **0.1.0** del remaster de la web QuibroPets.

## Estructura

```
QuibroRemastered/
├── quibro-remastered/   # Frontend Next.js
└── backend/             # API Laravel + Sanctum
```

## Requisitos

- Node.js 20+
- PHP 8.2+
- Composer
- MySQL

## Frontend

```bash
cd quibro-remastered
cp .env.example .env.local   # si existe; o crea NEXT_PUBLIC_API_URL
npm install
npm run dev
```

API por defecto: `http://127.0.0.1:8000/api`

## Backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

Configura `DB_*` en `backend/.env` apuntando a la base `newquibro`.

## Documentación de variantes

Ver `quibro-remastered/public/dataprocess/VARIANTES_PRODUCTOS.md` para el modelo de agrupación talla/color.

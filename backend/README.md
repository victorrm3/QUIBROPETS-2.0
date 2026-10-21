# QuibroPets API (Laravel)

Backend API para el frontend Next.js de QuibroPets.

## Base de datos

Usa MySQL local:

- **Database:** `newquibro`
- **Tabla de login:** `usuarios`

Configura credenciales en `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=newquibro
DB_USERNAME=root
DB_PASSWORD=tu_password
```

Luego ejecuta la migración de tokens Sanctum:

```bash
php artisan migrate
```

## Arrancar

```bash
cd backend
php artisan serve
```

API en: `http://127.0.0.1:8000`

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/health` | No | Estado de la API |
| POST | `/api/register` | No | Registro |
| POST | `/api/login` | No | Login (`user_email` + `password`) |
| GET | `/api/me` | Bearer | Usuario actual |
| POST | `/api/logout` | Bearer | Cerrar sesión |

## Notas

- El modelo `User` apunta a `usuarios` (`user_name`, `user_email`, etc.).
- CORS permite `FRONTEND_URL` (por defecto `http://localhost:3000`).

# Simple Blog

## 📄 Description

This is a simple blog manager. User must login to create post. Blogs wan be viewed by anyone 

## Run backend 

Node version min 22.20.0

### In Docker

To run the backend, run this command in terminal assuming that docker is already installed

```
cd backend
docker compose up -d
```

### On dev mode

Need node version 20 installed
Copy/paste .env.exmaple → .env

```
cd backend
npm i
npm run dev
```


this commande with run the api on `http://localhost:3333`

## Run Frontend

```
cd frontend
npm i
npm run dev
```
## API endpoint

To view all API endpont read the document in ```backend/doc/API.md```

## Testing

### Postman

You can use the exported postman collection "Collection Simple Blog.postman_collection.json" and "Env Simple Blog.postman_environment.json"

### Unit test

Node need to be pre installed, run the following commande

```
npm test
```

## 📁 Project Structure


### Backend
```
📁 backend (AdonisJS API)
├── 📁 Configuration Files
│   ├── .dockerignore
│   ├── .editorconfig
│   ├── .env.example
│   ├── .env.production
│   ├── .gitignore
│   ├── adonisrc.ts              (AdonisJS configuration)
│   ├── docker-compose.yml       (Docker compose setup)
│   ├── docker-entrypoint.sh     (Container startup script)
│   ├── Dockerfile               (Docker image definition)
│   ├── eslint.config.js         (ESLint configuration)
│   ├── package.json            (Dependencies & scripts)
│   ├── tsconfig.json           (TypeScript configuration)
│   └── WARP.md                 (Project documentation)
│
├── 📁 app/                     (Main application code)
│   ├── controllers/            (HTTP request handlers)
│   │   ├── auth_controller.ts    (Authentication endpoints)
│   │   └── blog_controller.ts    (Blog CRUD endpoints)
│   │
│   ├── exceptions/             (Error handling)
│   │   └── handler.ts
│   │
│   ├── middleware/             (HTTP middleware)
│   │   ├── auth_middleware.ts
│   │   ├── container_bindings_middleware.ts
│   │   └── force_json_response_middleware.ts
│   │
│   ├── models/                 (Database models)
│   │   ├── post.ts             (Blog post model)
│   │   └── user.ts             (User model with auth)
│   │
│   └── validators/             (Request validation)
│       ├── auth.ts             (Auth validation rules)
│       └── blog.ts             (Blog validation rules)
│
├── 📁 bin/                     (Executable scripts)
│   ├── console.ts              (Console application)
│   ├── server.ts               (HTTP server)
│   └── test.ts                 (Test runner)
│
├── 📁 config/                  (Application configuration)
│   ├── app.ts                  (App settings)
│   ├── auth.ts                 (Authentication config)
│   ├── bodyparser.ts           (Body parser config)
│   ├── cors.ts                 (CORS settings)
│   ├── database.ts             (Database connection)
│   ├── hash.ts                 (Password hashing)
│   └── logger.ts               (Logging configuration)
│
├── 📁 database/               (Database related files)
│   └── migrations/            (Database schema migrations)
│       ├── 1759399209406_create_users_table.ts
│       ├── 1759399209420_create_access_tokens_table.ts
│       └── 1759417816489_create_create_posts_table.ts
│
├── 📁 start/                  (Application startup files)
│   ├── env.ts                 (Environment variables schema)
│   ├── kernel.ts              (HTTP kernel setup)
│   └── routes.ts              (API routes definition)
│
├── 📁 tests/                  (Test suites)
│   ├── bootstrap.ts           (Test configuration)
│   ├── functional/            (API integration tests)
│   │   └── auth.spec.ts       (Authentication tests)
│   └── unit/                  (Unit tests)
│       ├── blog_validators.spec.ts
│       └── validators.spec.ts
│
├── 📁 tmp/                    (SQLite database storage)
│   └── app.sqlite3            (SQLite database file)
│
└── 📁 logs/                   (Application logs)
```

### Frontend

```
📁 frontend
├── 📄 Configuration Files
│   ├── .env                     (Environment variables)
│   ├── index.html               (Main HTML template)
│   ├── package.json             (Dependencies & scripts)
│   ├── vite.config.js           (Vite configuration)
│   └── eslint.config.js         (ESLint configuration)
│
├── 📁 public/                   (Static assets)
│   ├── favicon.ico
│   ├── logo.svg
│   └── manifest.json
│
├── 📁 scripts/                  (Build scripts)
│
└── 📁 src/                      (Source code)
    ├── main.jsx                 (Application entry point)
    │
    ├── 📁 assets/               (Static resources)
    │   └── styles/
    │       └── index.css        (Global styles)
    │
    ├── 📁 components/           (Reusable components)
    │   ├── Layout/              (Main layout wrapper)
    │   │   └── index.jsx
    │   ├── Navbar/              (Navigation bar)
    │   │   └── index.jsx
    │   ├── NotFound/            (404 error page)
    │   ├── PageLoader/          (Loading spinner)
    │   └── Redirection/         (Auth redirect handler)
    │
    ├── 📁 pages/                (Page components)
    │   ├── App.jsx              (Root app component)
    │   ├── Blogs/               (Blog listing page)
    │   │   └── index.jsx
    │   ├── Post/                (Individual post page)
    │   └── User/                (User auth pages)
    │       └── Register/
    │
    ├── 📁 services/             (API & business logic)
    │   ├── api.js               (Axios HTTP client)
    │   ├── authService.js       (Authentication service)
    │   ├── config.js            (Environment config)
    │   └── provider.jsx         (Auth context provider)
    │
    ├── 📁 hooks/                (Custom React hooks)
    │
    ├── 📁 helper/               (Utility functions)
    │
    └── 📁 routeWay/             (Routing configuration)
        └── index.jsx            (Route definitions)
```

## Tech Stack:

### Backend
•  Framework: AdonisJS v6 (Node.js)
•  Language: TypeScript
•  Database: SQLite with Lucid ORM  
•  Authentication: JWT access tokens
•  Validation: VineJS
•  Testing: Japa test runner
•  Containerization: Docker + Docker Compose

### Frontend
•  Framework: React 19.1.1 (with Vite)
•  Language: JavaScript (ES6+)
•  UI Library: Material-UI Joy + MUI Material
•  Styling: Emotion (CSS-in-JS) + Inter font
•  Routing: React Router DOM v6
•  HTTP Client: Axios with JWT interceptors
•  Build Tool: Vite (fast development server)
•  Notifications: React Toastify
•  Development: ESLint for code quality
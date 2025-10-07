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

### Backend (AdonisJS API)
```
📁 backend/
├── 📁 app/           (Controllers, models, middleware, validators)
├── 📁 bin/           (Server & console scripts)
├── 📁 config/        (App, database, auth configuration)
├── 📁 database/      (Migrations)
├── 📁 doc/           (API documentation)
├── 📁 logs/          (Application logs)
├── 📁 start/         (Routes & kernel setup)
├── 📁 tests/         (Unit & functional tests)
├── 📁 tmp/           (SQLite database)
└── 📄 package.json   (Dependencies & scripts)
```

### Frontend (React + Vite)
```
📁 frontend/
├── 📁 public/        (Static assets)
├── 📁 scripts/       (Build scripts)
├── 📁 src/
│   ├── 📁 assets/    (Styles & images)
│   ├── 📁 components/ (Reusable UI components)
│   ├── 📁 helper/    (Utility functions)
│   ├── 📁 hooks/     (Custom React hooks)
│   ├── 📁 pages/     (Page components)
│   ├── 📁 routeWay/  (Routing configuration)
│   ├── 📁 services/  (API & auth services)
│   └── 📄 main.jsx   (Entry point)
├── 📄 index.html     (Main HTML template)
└── 📄 package.json   (Dependencies & scripts)
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
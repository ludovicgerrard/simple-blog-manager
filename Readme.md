# Simple Blog

## Description

This is a simple blog manager. User must login to create post. Blogs wan be viewed by anyone 

## Tech used

### backend : adonisjs , lucid + sqlite, docker
### frontend : reactjs , mui, react-router-dom

## 📁 **File Structure**

```
root/
├── backend/
└── frontend/
```

## Run backend 

### In Docker

To run the backend, run this command in terminal assuming that docker is already installed

```
cd backend
docker compose up -d
```

### On dev mode

Need node version 20 installed

```
cd backend
npm i
npm start
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


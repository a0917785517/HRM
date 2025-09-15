# HRM Frontend (React + Vite + Tailwind)

Minimal demo UI for the HRM project.

## Prerequisites
- Node.js 18+ (includes npm)
- (Optional) Docker

## Setup
```bash
npm i
npm run dev
```
The dev server proxies `/api` to `http://localhost:8000` (see `vite.config.ts`).

## Build
```bash
npm run build
npm run preview
```

## Docker
```bash
docker build -t hrm-frontend .
docker run -p 5173:80 hrm-frontend
```

## Features
- Employees table (list)
- Create / Edit / Delete
- Excel bulk upload
- Clean minimal design (Tailwind)

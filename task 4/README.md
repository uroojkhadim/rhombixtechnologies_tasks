# Dynamic Blogging Website (InkFlow)

A full-stack blogging platform with Angular 21 frontend, Node.js/Express REST API, MongoDB, JWT authentication, and an admin dashboard.

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| Frontend | Angular 21, SCSS, Quill (ngx-quill), Reactive Forms |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB |
| Auth | JWT, bcrypt, role-based access (admin/user) |

## Features

### Public / User
- Home with latest, featured, and trending posts
- Blog listing with category/tag filters and pagination
- SEO-friendly blog URLs (`/blog/:slug`)
- Search by keyword
- Comments (pending approval for users)
- Likes, view counter, reading time, related posts, share buttons
- User signup/login and profile (with avatar upload)
- Dark mode

### Admin
- Dashboard analytics (blogs, users, comments)
- Blog CRUD with Quill rich text editor and cover image upload
- Category & tag management
- User block/delete
- Comment approve/delete moderation

## Project Structure

```
task 4/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── utils/
├── frontend/
│   └── src/app/
│       ├── core/        # services, guards, interceptors
│       ├── layouts/     # main + admin layouts
│       ├── pages/       # user & admin pages
│       └── shared/      # reusable components
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (or update `MONGODB_URI`)

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env   # if .env does not exist
npm install
npm run seed           # creates demo data
npm run dev
```

API runs at **http://localhost:5000**

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

App runs at **http://localhost:4200**

## Demo Accounts

| Role  | Email           | Password  |
|-------|-----------------|-----------|
| Admin | admin@blog.com  | admin123  |
| User  | user@blog.com   | user123   |

- Admin panel: **http://localhost:4200/admin/login**
- Or login as admin from the main site and use the **Admin** nav link.

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/blogs` | List blogs (query: page, search, category, tag) |
| GET | `/api/blogs/slug/:slug` | Blog detail |
| POST | `/api/blogs/:id/like` | Toggle like (auth) |
| GET/POST/PUT/DELETE | `/api/categories` | Categories CRUD (admin write) |
| GET/POST/PUT/DELETE | `/api/tags` | Tags CRUD (admin write) |
| POST | `/api/comments` | Add comment (auth) |
| GET | `/api/users/stats` | Dashboard stats (admin) |

## Environment Variables

**backend/.env**

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/dynamic_blog
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:4200
```

## Production Notes

- Change `JWT_SECRET` and use HTTPS
- Serve Angular build behind nginx/CDN
- Store uploads on S3 or similar for production
- Set `environment.production.ts` with your API URL

## License

MIT — built for Rhombix Technologies task assignment.

# 🚀 DevHub Backend — RESTful Blog API

This is the backend of the **DevHub Blog Application**, built with **Node.js**, **Express**, and **MongoDB**. It powers all user authentication, profile management, and post-related functionalities, including secure role-based access and image support via Firebase.

---

## 🌐 Live API

**Base URL:**  
`https://blog-app-backend-77mk.onrender.com`

---

## 📘 API Documentation

You can test and explore all endpoints with Postman:

🔗 **[Postman API Docs](https://documenter.getpostman.com/view/41735525/2sB2ca5ed5)**


## 📦 Features

- 🔐 **JWT Authentication** (Login / Register)
- 🧠 **Google OAuth** via Firebase
- 🧑‍💼 **Role-based Access** (Admin-only post creation)
- 📬 **RESTful APIs** for managing users and blog posts
- 📸 **Profile picture upload** (Firebase URL supported)
- 🔍 **Search** by blog title, content, or category
- 🛡️ **Protected Routes** using middleware
- ⚙️ **CORS & Cookie Management**
- ✅ **Validation & Error Handling**

---

## 🛠️ Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** (Authentication)
- **bcryptjs** (Password hashing)
- **Firebase Auth** (Google OAuth)
- **CORS**, **dotenv**, **cookie-parser**

---

## 📮 API Routes Overview

| Method | Endpoint                          | Description                          | Protected |
|--------|-----------------------------------|--------------------------------------|-----------|
| POST   | `/api/auth/register-user`         | Register new user                    | ❌        |
| POST   | `/api/auth/signin-user`           | Sign in with email/password          | ❌        |
| POST   | `/api/auth/googleauth`            | Sign in with Google                  | ❌        |
| PUT    | `/api/user/update/:id`            | Update user profile                  | ✅        |
| DELETE | `/api/user/delete/:id`            | Delete user account                  | ✅        |
| POST   | `/api/post/createpost`            | Create new post (Admin only)         | ✅        |
| GET    | `/api/post/getallposts?search=`   | Fetch all posts or search by keyword | ✅        |
| GET    | `/api/post/getpost/:id`           | Fetch single post by ID              | ✅        |


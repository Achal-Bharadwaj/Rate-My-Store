# Rate-My-Store

**Rate-My-Store** is a full-stack web application that allows users to submit ratings (1 to 5 stars) for stores registered on the platform. It features role-based access for three types of users: **Normal Users**, **Store Owners**, and **System Administrators**, each with distinct functionalities. The application is built using modern web technologies and follows best practices for both frontend and backend development.

---

## 🚀 Project Summary

Rate-My-Store provides a platform where users can:

- **Rate stores** – Normal Users can submit or modify ratings.
- **Manage stores** – Store Owners can view ratings for their stores and manage details.
- **Administer the platform** – Admins can manage users/stores and view statistics.

It solves the problem of managing store ratings and user access by centralizing control through clearly defined roles.

---

## ✨ Features

- **User Authentication** – Secure login/signup with JWT-based role access.
- **Role-Based Dashboards**  
  - Normal Users: View/rate stores, update password  
  - Store Owners: Manage own stores, view ratings  
  - Admins: Manage all users/stores, see platform stats
- **Store Management** – CRUD support for admins and owners
- **Rating System** – 1–5 stars with optional comments
- **Search, Filter, Sort** – Dynamic lists for users and stores
- **Form Validations** – Strong validation using Yup

---

## 🛠 Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL

### Frontend
- React.js + React Router
- Formik + Yup
- Axios
- Bootstrap

### Auth
- JSON Web Tokens (JWT)

### Other
- dotenv

---

## 📁 Project Structure
```
client/
├── node_modules/
├── public/
│   ├── index.html
├── src/
│   ├── apis/
│   │   ├── StoreFinder.js
│   │   ├── AuthFinder.js
│   │   ├── UserFinder.js
│   │   ├── StatsFinder.js
│   ├── components/
│   │   ├── AddStore.jsx
│   │   ├── AddRating.jsx
│   │   ├── Header.jsx
│   │   ├── StoreList.jsx
│   │   ├── Ratings.jsx
│   │   ├── StarRating.jsx
│   │   ├── UpdateStore.jsx
│   │   ├── Signup.jsx
│   │   ├── Login.jsx
│   │   ├── PasswordUpdate.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── OwnerDashboard.jsx
│   │   ├── UserList.jsx
│   │   ├── AddUser.jsx
│   ├── context/
│   │   ├── StoresContext.js
│   │   ├── AuthContext.js
│   ├── routes/
│   │   ├── Home.jsx
│   │   ├── StoreDetailsPage.jsx
│   │   ├── UpdatePage.jsx
│   │   ├── SignupPage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── PasswordUpdatePage.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── AdminDashboardPage.jsx
│   │   ├── OwnerDashboardPage.jsx
│   ├── App.jsx
│   ├── index.js
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
```
---

## 🔐 Sample Login Credentials

| Role           | Email               | Password    |
|----------------|---------------------|-------------|
| Normal User    | user1@example.com   | User123!@   |
| Store Owner    | owner1@example.com  | Owner123!   |
| Admin          | admin1@example.com  | Admin123!   |

> Sample users are pre-inserted into the database.

---

## 👩‍💻 How It Works

### Normal User
- **Signup** → `/signup`
- **Login** → `/login`
- **View & Rate Stores** → homepage `/`
- **Update Password** → `/users/password`
- **Logout**

### Store Owner
- **Login** → `/login`
- **Dashboard** → `/owner/dashboard`
- **Add/Edit/Delete Stores**
- **View Ratings**
- **Update Password**
- **Logout**

### Admin
- **Login** → `/login`
- **Dashboard** → `/admin/dashboard`
- **Add/Edit/Delete Users & Stores**
- **View Platform Stats**
- **Update Password**
- **Logout**

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v14+
- PostgreSQL v12+
- Git
  
### Clone the Repo
1. Clone the repository:
   ```bash
   git clone https://github.com/Achal-Bharadwaj/Rate-My-Store.git
   cd Rate-My-Store

2. Start the backend:
   ```bash
    cd server
    npm install
    npm start
3. Start the frontend:
   ```bash
    cd client
    npm install
    npm start

### Create .env file
1. client/.env
   ```bash
   REACT_APP_API_URL=http://localhost:5000/api/v1
2. server/.env
   ```bash
   PGUSER=postgres
   PGHOST=localhost
   PGDATABASE=database_name
   PGPASSWORD=your_password
   PGPORT=5433
   JWT_SECRET=your_secret_key
   PORT=5000

### Setup Database
```bash
CREATE DATABASE rate_my_store;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user', 'owner'))
);

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  address VARCHAR(400) NOT NULL,
  owner_id INTEGER REFERENCES users(id),
  average_rating FLOAT
);

CREATE TABLE ratings (
  id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES stores(id),
  user_id INTEGER REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Database Seeding 
```bash
INSERT INTO users (name, email, password, address, role) VALUES
('Admin One Long Name Example', 'admin1@example.com', 'Admin123!', '123 Admin St, City', 'admin'),
('Admin Two Long Name Example', 'admin2@example.com', 'Secure456@', '456 Admin Rd, Town', 'admin'),
('Admin Three Long Name Example', 'admin3@example.com', 'Pass789#', '789 Admin Ave, Village', 'admin'),
('Owner One Long Name Example', 'owner1@example.com', 'Owner123!', '101 Owner St, City', 'owner'),
('Owner Two Long Name Example', 'owner2@example.com', 'Store456@', '202 Owner Rd, Town', 'owner'),
('Owner Three Long Name Example', 'owner3@example.com', 'Retail789#', '303 Owner Ave, Village', 'owner'),
('User One Long Name Example', 'user1@example.com', 'User123!@', '101 User St, City', 'user'),
('User Two Long Name Example', 'user2@example.com', 'Secure456$%', '202 User Rd, Town', 'user'),
('User Three Long Name Example', 'user3@example.com', 'Pass789#^', '303 User Ave, Village', 'user');

INSERT INTO stores (name, email, address, owner_id, average_rating) VALUES
('Coffee Haven Long Name Example', 'coffee@haven.com', '101 Brew St, City', 4, NULL),
('Book Nook Long Name Example', 'book@nook.com', '202 Read Rd, Town', 4, NULL),
('Tech Shop Long Name Example', 'tech@shop.com', '303 Tech Rd, Village', 5, NULL),
('Bakery Bliss Long Name Example', 'bakery@bliss.com', '404 Sweet St, City', 5, NULL),
('Gadget Zone Long Name Example', 'gadget@zone.com', '505 Circuit Ave, Town', 6, NULL),
('Flower Mart Long Name Example', 'flower@mart.com', '606 Bloom Rd, Village', 6, NULL);
```

## Conclusion
Rate-My-Store is a robust, role-driven store rating app built on modern web technologies. Whether you're a user wanting to leave feedback, a store owner managing your ratings, or an admin overseeing the ecosystem — this platform is for you.

🚀 Developed by Achal S Bharadwaj
🔗 GitHub: https://github.com/Achal-Bharadwaj\

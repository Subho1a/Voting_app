# 🗳️ Voting App

A secure, role-based online voting application built with Node.js, Express, and MongoDB. It supports user authentication, candidate management (admin only), and secure voting (one vote per user).

## 🔧 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (hosted on MongoDB Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **Hosting**: Render
- **Other Tools**: dotenv, bcrypt, mongoose

---

## 📁 Project Structure
```
Voting_app/
├── model/
│ ├── user_model.js
│ └── candidate_model.js
├── route/
│ ├── user_route.js
│ └── candidate_route.js
├── jwt.js
├── db.js
├── server.js
└── .env
```


---

## 🔐 Authentication Flow

- Users sign up using `aadharCardNo` and a password.
- Passwords are securely hashed with bcrypt.
- JWT tokens are issued upon successful login.
- Middleware verifies token for protected routes.

---

## 🚀 API Endpoints

### 🧑‍💼 Auth & User Routes (`/users`)

| Method | Endpoint              | Description                   |
|--------|-----------------------|-------------------------------|
| POST   | `/signup`             | Register new user             |
| POST   | `/login`              | Login and receive JWT token   |
| GET    | `/profile`            | View logged-in user's profile |
| PUT    | `/profile/password`   | Update password               |
| GET    | `/dashboard`          | View all users (admin/test)   |

---

### 🗳️ Candidate Routes (`/candidates`)

| Method | Endpoint                | Description                          |
|--------|-------------------------|--------------------------------------|
| POST   | `/`                     | Add candidate (admin only)           |
| PUT    | `/:candidateID`         | Update candidate info (admin only)   |
| DELETE | `/:candidateID`         | Delete candidate (admin only)        |
| POST   | `/vote/:candidateID`    | Vote for candidate (user only)       |
| GET    | `/vote/count`           | Get party-wise vote count summary    |

---

## 🧪 Example User Data (POST `/users/signup`)

```json
{
  "name": "Arindam Jana",
  "age": 22,
  "mobile": 9876543210,
  "email": "arindam@example.com",
  "address": "Kolkata, India",
  "aadharCardNo": 123456781234,
  "password": "SecurePass@123",
  "role": "user"
}
```
---

## 🧪 Example Candidate Data (POST /candidates/)

```json
{
  "name": "Priya Sharma",
  "age": 40,
  "party": "People's Front"
}


# 🏠 RentNest API
> **Find & List Rental Properties with Ease**
RentNest is a backend REST API for a rental property marketplace where landlords can list rental properties, tenants can browse listings, submit rental requests, complete payments via Stripe, and leave reviews. Admins can manage users, properties, categories, and rental requests.
---
## 🚀 Live API
**Base URL**
[https://your-render-url.onrender.com](https://rentnest-nine.vercel.app)
---
## 📄 API Documentation
[https://documenter.getpostman.com/view/your-postman-id](https://documenter.getpostman.com/view/54681201/2sBY4Jy3eW)
---
# ✨ Features
### 🌍 Public
- Browse all properties
- Search & filter properties
- View property details
- View categories
### 👤 Tenant
- Register & Login
- Submit rental requests
- View rental history
- Stripe payment integration
- View payment history
- Leave reviews
### 🏡 Landlord
- Create property listings
- Update property listings
- Delete property listings
- Approve/Reject rental requests
- Manage property availability
### 👑 Admin
- View all users
- Ban/Unban users
- Manage categories
- View all properties
- View all rental requests
---
# 👥 User Roles
| Role | Description |
|------|-------------|
| Tenant | Browse properties, submit rental requests, make payments |
| Landlord | Create and manage rental properties |
| Admin | Manage users, properties, categories and rental requests |
---
# 🛠️ Tech Stack
### Backend
- Node.js
- Express.js
- TypeScript
### Database
- PostgreSQL
- Prisma ORM
### Authentication
- JWT
- BcryptJS
### Payment
- Stripe
### Deployment
- Render
---
# 📂 Project Structure
```bash
src/
│
├── config/
├── middleware/
├── lib/
├── error/
│
├── module/
│   ├── user/
│   ├── property/
│   ├── landlord/
│   ├── rental/
│   ├── payment/
│   ├── review/
│   ├── category/
│   └── admin/
│
├── app.ts
└── server.ts
```
---
# 📌 API Endpoints
## Authentication
| Method | Endpoint |
|----------|-----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| GET | /api/auth/me |
---
## Properties
| Method | Endpoint |
|----------|-----------|
| GET | /api/properties |
| GET | /api/properties/:id |
---
## Categories
| Method | Endpoint |
|----------|-----------|
| GET | /api/categories |
---
## Landlord
| Method | Endpoint |
|----------|-----------|
| POST | /api/landlord/properties |
| PUT | /api/landlord/properties/:id |
| DELETE | /api/landlord/properties/:id |
| GET | /api/landlord/requests |
| PATCH | /api/landlord/requests/:id |
---
## Rentals
| Method | Endpoint |
|----------|-----------|
| POST | /api/rentals |
| GET | /api/rentals |
| GET | /api/rentals/:id |
---
## Payments
| Method | Endpoint |
|----------|-----------|
| POST | /api/payments/create |
| POST | /api/payments/confirm |
| GET | /api/payments |
| GET | /api/payments/:id |
---
## Reviews
| Method | Endpoint |
|----------|-----------|
| POST | /api/reviews |
---
## Admin
| Method | Endpoint |
|----------|-----------|
| GET | /api/admin/users |
| PATCH | /api/admin/users/:id |
| GET | /api/admin/properties |
| GET | /api/admin/rentals |
---
# 👨‍💻 Author
**Ovi Islam Abir**
- GitHub: https://github.com/OviIslmAbir
- Portfolio: [https://my-portfolio62.netlify.app](https://my-portfolio62.netlify.app/)
---
⭐ **If you like this project, consider giving it a star on GitHub!**
store kor

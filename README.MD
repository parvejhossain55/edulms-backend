# OLMS Backend

A production-ready RESTful API backend for an **Online Learning Management System (OLMS)**. Built with Node.js, Express, and MongoDB, it supports course management, user roles/permissions, blog posts, assignments, payments, and more.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Courses](#courses)
  - [Blog](#blog)
  - [Roles & Permissions](#roles--permissions)
  - [Cart & Checkout](#cart--checkout)
  - [Assignments](#assignments)
- [Project Structure](#project-structure)
- [Database Models](#database-models)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Tech Stack

| Layer          | Technology                                                         |
|----------------|--------------------------------------------------------------------|
| Runtime        | Node.js                                                           |
| Framework      | Express.js                                                        |
| Database       | MongoDB (Mongoose ODM)                                            |
| Authentication | JWT (`jsonwebtoken`), `express-jwt`, bcryptjs                     |
| File Upload    | Multer + Cloudinary                                               |
| Email          | SendGrid, Nodemailer (Mailgun transport)                          |
| Payments       | Stripe, SSLCommerz, Braintree                                     |
| Security       | Helmet, CORS, XSS-Clean, express-rate-limit                       |
| Logging        | Morgan                                                            |
| Validation     | Validator.js                                                      |

## Features

- **User Management** — Registration, login (email + social), password reset via OTP, profile management
- **Role-Based Access Control (RBAC)** — Granular permissions for admins, teachers, and students
- **Course Management** — Create, update, publish courses with modules, content, and thumbnails
- **Course Categories & Modules** — Hierarchical course organization
- **Assignments** — Create, submit, and grade assignments
- **Blog System** — Posts, categories, comments, likes, tags, popular/latest posts
- **Cart & Checkout** — Add to cart, coupon support, multi-gateway payment (Stripe, SSLCommerz, Braintree)
- **Live Sessions** — Schedule and manage live class sessions
- **Wishlist** — Save courses for later
- **Teacher Applications** — Teachers can apply; admins review and approve
- **Cloudinary Integration** — Image/file uploads via Cloudinary
- **Rate Limiting** — Global and per-route rate limits to prevent abuse
- **Auto-Seeding** — Roles, permissions, and super admin seeded on first boot

## Architecture

```
Client Request
      │
      ▼
   index.js          ← Express app setup, middleware, route mounting
      │
      ▼
   routes/           ← Route definitions (one file per domain)
      │
      ▼
   middleware/       ← Auth, rate-limiting, file-upload guards
      │
      ▼
   controllers/     ← Request/response handling, input validation
      │
      ▼
   services/        ← Business logic, data access
      │
      ▼
   models/          ← Mongoose schemas & models
```

The application follows a **layered architecture**: routes → controllers → services → models. This separation keeps business logic decoupled from HTTP handling and database access.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16+ (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) v5+ (local or Atlas)
- A [Cloudinary](https://cloudinary.com/) account (for file uploads)
- An email service key (SendGrid or Mailgun)

### Installation

```bash
git clone https://github.com/your-org/edulms-backend.git
cd edulms-backend
npm install
```

### Environment Variables

Copy the example and fill in your values:

```bash
cp .env.example .env
```

See [`.env.example`](.env.example) for all required variables. At minimum you need:

| Variable | Description |
|----------|-------------|
| `DATABASE` | MongoDB connection string |
| `TOKEN_SECRET` | Secret key for JWT signing (use a strong random string) |
| `PORT` | Server port (default: `8000`) |
| `FRONTEND_URL` | Allowed CORS origin for your frontend |
| `SUPER_ADMIN_EMAIL` | Email for the auto-created super admin |
| `SUPER_ADMIN_FIRST_NAME` | Super admin first name |
| `SUPER_ADMIN_LAST_NAME` | Super admin last name |
| `SUPER_ADMIN_MOBILE` | Super admin phone number |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SENDGRID_KEY` | SendGrid API key (for transactional email) |
| `SENDGRID_EMAIL_FROM` | Verified sender email |

Optional payment keys:

| Variable | Description |
|----------|-------------|
| `STORE_ID` | SSLCommerz store ID |
| `STORE_PASSWORD` | SSLCommerz store password |
| `BRAINTREE_MERCHANT_ID` | Braintree merchant ID |
| `BRAINTREE_PUBLIC_KEY` | Braintree public key |
| `BRAINTREE_PRIVATE_KEY` | Braintree private key |

### Running the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server starts on `http://localhost:8000` (or the `PORT` you configured). On first boot it automatically:

1. Seeds project roles (superadmin, admin, teacher, student, etc.)
2. Seeds granular permissions
3. Creates the super admin user if one doesn't exist

## API Reference

All endpoints are prefixed with `/api/v1`.

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Login with email & password | No |
| `POST` | `/auth/social-login` | Login via Google/Facebook | No |
| `GET` | `/auth/:email` | Send OTP to email | No |
| `GET` | `/auth/:email/:otp` | Verify OTP | No |
| `PATCH` | `/auth/:email/:otp` | Reset password with OTP | No |
| `PATCH` | `/auth/setpassword/:token` | Set password via token | No |
| `PATCH` | `/auth/password` | Change password (authenticated) | Yes |
| `GET` | `/auth/auth-check` | Verify auth token | Yes |
| `GET` | `/auth/admin-check` | Verify admin role | Yes |
| `GET` | `/auth/check-permission/:permission` | Check specific permission | Yes |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/users` | Get current user profile | Yes |
| `PATCH` | `/users` | Update profile (with picture) | Yes |

### Courses

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/courses/published` | Get all published courses | No |
| `GET` | `/courses/published/:id` | Get published course by ID | No |
| `GET` | `/courses/:categoryId/category` | Get courses by category | No |
| `GET` | `/courses/:courseId/purchase/:userId` | Check if user purchased course | No |
| `GET` | `/courses/:courseId/my-course` | Get student's enrolled course | Yes |
| `GET` | `/courses/my-course/:pageNo/:perPage` | Get student's enrolled courses (paginated) | Yes |
| `GET` | `/courses` | Get all courses (dropdown) | Yes |
| `GET` | `/courses/:id` | Get single course by ID | Yes |
| `POST` | `/courses` | Create a new course | Yes (teacher+) |
| `PATCH` | `/courses/:courseId` | Update a course | Yes (teacher+) |
| `GET` | `/courses/:pageNo/:perPage/:searchKeyword` | Search courses (paginated) | Yes |
| `GET` | `/dropdown-courses/teacher` | Get courses by teacher | Yes |
| `GET` | `/dropdown-courses/student` | Get student's courses | Yes |

### Blog

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/posts` | Create a blog post | Yes (admin) |
| `GET` | `/posts/:id` | Get post by ID | No |
| `POST` | `/posts/:pageNo/:perPage/:searchKeyword` | Get posts (paginated) | No |
| `GET` | `/posts/:categoryId/:pageNo/:perPage/:searchKeyword` | Get posts by category | No |
| `GET` | `/posts/popular-post` | Get popular posts | No |
| `GET` | `/posts/latest-post` | Get latest posts | No |
| `GET` | `/posts/:postId/related` | Get related posts | No |
| `GET` | `/posts-by-tag/:tag` | Get posts by tag | No |
| `PATCH` | `/posts/:id` | Update a post | Yes (admin) |
| `DELETE` | `/posts/:id` | Delete a post | Yes (admin) |
| `POST` | `/posts/:postId/comments` | Add comment | Yes |
| `PUT` | `/posts/:postId/comments/:commentId` | Update comment | Yes |
| `GET` | `/posts/:postId/like` | Toggle like | Yes |

### Roles & Permissions

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| Various | `/roles/*` | CRUD for roles | Yes (admin) |
| Various | `/employees/*` | Employee management | Yes (admin) |

### Cart & Checkout

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| Various | `/cart/*` | Add/remove/list cart items | Yes |
| Various | `/checkout/*` | Payment processing (Stripe, SSLCommerz, Braintree) | Yes |
| Various | `/coupon/*` | Coupon management | Yes |
| Various | `/wishlists/*` | Wishlist management | Yes |

### Assignments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| Various | `/assignments/*` | Create/manage assignments | Yes |
| Various | `/assignments/submit/*` | Submit assignments | Yes (student) |

### Additional Routes

- **Live Sessions** — `/api/v1/livesessions/*`
- **Teacher Applications** — `/api/v1/teacherapply/*`
- **Course Reviews** — `/api/v1/reviews/*`
- **Course Categories** — `/api/v1/categories/*`
- **Course Modules** — `/api/v1/modules/*`
- **Course Content** — `/api/v1/contents/*`
- **Blog Categories** — `/api/v1/blog-categories/*`

## Project Structure

```
edulms-backend/
├── index.js                     # App entry point, middleware, route mounting
├── package.json
├── vercel.json                  # Vercel deployment config
├── .env.example                 # Environment variable template
├── controllers/                 # Request handlers
│   ├── authController.js
│   ├── userController.js
│   ├── checkoutController.js
│   ├── course/                  # Course-related controllers
│   ├── blog/                    # Blog controllers
│   ├── assignment/              # Assignment controllers
│   └── userManage/              # Admin user management
├── services/                    # Business logic layer
│   ├── authService.js
│   ├── userService.js
│   ├── otpService.js
│   ├── course/
│   ├── blog/
│   ├── assignment/
│   ├── common/
│   └── userManage/
├── models/                      # Mongoose schemas (24 models)
│   ├── User.js
│   ├── Course.js
│   ├── Role.js
│   ├── Permission.js
│   ├── Purchase.js
│   └── ... (20 more)
├── routes/                      # Route definitions (21 modules)
├── middleware/                   # Auth, rate-limiting, file upload
│   ├── authMiddleware.js
│   ├── rateLimitMiddleware.js
│   └── cloudinaryUpload.js
├── helpers/                     # Utility functions
├── emailTemplate/               # Email templates
├── seed/                        # Seed data helpers
├── dbSeed/                      # Roles & permissions seed data
│   ├── projectRoles.js
│   └── projectPermissions.js
└── public/                      # Static assets
```

## Database Models

| Model | Description |
|-------|-------------|
| `User` | User accounts with authentication and profile data |
| `UserProfile` | Extended user profile information |
| `TeacherProfile` | Teacher-specific profile data |
| `Role` | User roles (superadmin, admin, teacher, student) |
| `Permission` | Granular permission definitions |
| `Course` | Course metadata, pricing, and status |
| `CourseCategory` | Course category taxonomy |
| `CourseModule` | Modules within a course |
| `CourseContent` | Individual content items (videos, docs, etc.) |
| `CourseReview` | Student reviews and ratings |
| `Assignment` | Assignment definitions |
| `AssignmentSubmit` | Student assignment submissions |
| `Quiz` | Quiz questions and answers |
| `Post` | Blog posts |
| `PostCategory` | Blog post categories |
| `Cart` | Shopping cart items |
| `Purchase` | Purchase records |
| `Payment` | Payment transaction logs |
| `Coupon` | Discount coupons |
| `Wishlist` | Saved courses |
| `Otp` | One-time passwords for verification |
| `Session` | Live session definitions |
| `TeacherApply` | Teacher application requests |
| `Gem` | Gamification/reward points |

## Security

This API implements multiple layers of security:

- **Helmet** — Sets secure HTTP headers
- **CORS** — Restricted to configured frontend origins
- **XSS-Clean** — Sanitizes user input against cross-site scripting
- **Rate Limiting** — Global (1000 req/2 min) and per-route limits on auth endpoints
- **JWT Authentication** — Stateless token-based auth with `express-jwt`
- **bcryptjs** — Password hashing with salt
- **OTP Verification** — Time-limited one-time passwords for password reset
- **Input Validation** — `validator.js` for email, phone, and string sanitization
- **Error Handling** — Centralized error handler prevents stack trace leakage

### Security Recommendations

For production deployment, consider these additional hardening steps:

1. **Rotate secrets** — Generate a fresh `TOKEN_SECRET` before going live
2. **Add per-route rate limits** on OTP and password reset endpoints
3. **Enable refresh tokens** — Implement short-lived access tokens with refresh flow
4. **Add API documentation** — Generate OpenAPI/Swagger specs from route definitions
5. **Add monitoring** — Integrate Sentry or similar for error tracking

## Deployment

### Vercel (Serverless)

The project includes a `vercel.json` for Vercel deployment:

```bash
vercel deploy
```

### Render / Heroku / Other PaaS

```bash
# Set environment variables in your platform's dashboard
# Then deploy normally
npm start
```

### Docker (Manual)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8000
CMD ["node", "index.js"]
```

```bash
docker build -t edulms-backend .
docker run -p 8000:8000 --env-file .env edulms-backend
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing layered architecture: routes → controllers → services → models
- Place new routes in `routes/` — they are auto-mounted on startup
- Use `authMiddleware.authVerifyMiddleware` and `authMiddleware.checkPermissions()` for protected endpoints
- Validate input in controllers before calling services
- Return consistent JSON response shapes: `{ message, data }` for success, `{ error }` for failures

## License

ISC

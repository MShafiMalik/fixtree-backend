# Fixtree Backend - Complete Project Documentation

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Status:** Production Ready

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Database Schema](#database-schema)
6. [Database ERD](#database-erd-entity-relationship-diagram)
7. [API Documentation](#api-documentation)
8. [Authentication & Authorization](#authentication--authorization)
9. [Real-time Features](#real-time-features)
10. [Modules Documentation](#modules-documentation)
11. [Configuration](#configuration)
12. [Environment Variables](#environment-variables)
13. [Getting Started](#getting-started)
14. [Development Guide](#development-guide)
15. [Testing](#testing)
16. [Deployment](#deployment)
17. [Code Examples](#code-examples)
18. [Best Practices](#best-practices)
19. [Troubleshooting](#troubleshooting)
20. [Contributing](#contributing)
21. [Implementation Roadmap](#implementation-roadmap)

---

## Project Overview

**Fixtree** (formerly QuickPro) is a scalable, production-ready NestJS backend application for a service marketplace platform that connects buyers with local service providers (sellers). The platform enables on-site/physical service bookings, real-time communication, and comprehensive service management.

### Implementation Status

Implementation follows the **stage-based plan** in **`IMPLEMENTATION-STAGES.md`** (44 stages). Stages 1–15 are completed; stages 16–44 are pending or incomplete.

**Legend:**

- ✅ **Implemented** - Feature is currently implemented and functional (Stages 1–15)
- 🚧 **Planned** - Feature is documented in IMPLEMENTATION-STAGES.md and will be implemented in order
- ⚠️ **Incomplete** - Stage exists but logic not yet finalized (e.g. Boost Management, Boost Audit Log)

### Key Features

#### ✅ Core Features (Implemented)

- **Multi-Role Authentication**: Buyer, Seller, Admin, and Super Admin roles with role-based access control
- **Google OAuth Integration**: Social login support for web and mobile platforms
- **Multi-Platform Support**: Web, iOS, and Android applications
- **Session Management**: Device tracking, multi-device login, and session revocation
- **Email & Phone Verification**: OTP-based verification system
- **Real-time Notifications**: Email (SendGrid) and SMS (Twilio) notifications via background jobs
- **File Upload**: Cloudinary integration for image and file storage
- **Background Jobs**: BullMQ for asynchronous task processing
- **Scheduled Tasks**: Cron jobs for maintenance and automation
- **Health Monitoring**: Comprehensive health checks for database, Redis, memory, and disk
- **Soft Delete**: Data retention with soft delete functionality
- **Request Tracking**: Unique request ID for request tracing
- **Comprehensive Logging**: Winston-based logging system

#### 🚧 Planned Features (To Be Implemented)

Planned features are defined as **Stages 16–44** in **`IMPLEMENTATION-STAGES.md`**. Summary:

- **WebSocket Setup**: Infrastructure for real-time features (Stage 16)
- **Admin Module**: Super Admin create admins and view admins (Stage 17)
- **Extend Seller Module**: Seller documents, approve/reject, pause/unpause (Stage 18)
- **Categories Module**: Category CRUD and management (Stage 19)
- **Services Module**: Service listings, availability, social links, images (Stage 20)
- **Booking System**: Core booking features, location, OTP, arrival notifications (Stages 21–23)
- **Reviews Module**: Reviews, replies, ratings, admin moderation (Stage 24)
- **Chat Module**: WebSocket messaging, file sharing, typing indicators (Stage 25)
- **Chat Multimedia Cleanup**: Cron job to delete chat attachments older than 30 days (Stage 26)
- **Buyer Module**: Admin list buyers and buyer statistics (Stage 27)
- **Dispute Management**: Dispute creation and admin resolution (Stage 28)
- **Strike System**: Policy violation tracking and consequences (Stage 29)
- **Audit Logging**: Audit trail for admin actions (Stage 30)
- **Recent Activity Module**: Activity feed and cleanup (Stages 31–32)
- **Cities Module**: City and location services (Stage 33)
- **Message Safety**: Content moderation and violation detection (Stage 34)
- **Plans Module**: Subscription plans (Basic/Plus/Premium) for service limits, country-specific (Stage 35)
- **Plan Subscriptions Module**: Seller plan assignment and plan changes (Stage 36)
- **Boost Management & Audit Log**: Boost visibility features (Stages 37–38, logic incomplete)
- **Performance Analytics**: Seller reliability and dashboard metrics (Stage 39)
- **Support Module**: Support ticket system (Stage 40)
- **System Settings**: Platform configuration (Stage 41)
- **Docker & CI/CD**: Docker setup and pipeline (Stages 42–43)
- **Final Integration & Testing**: End-to-end validation (Stage 44)

### Platform Capabilities

- **Buyers** can discover services, create bookings, manage addresses, and leave reviews
- **Sellers** can create service listings, manage bookings, respond to reviews, and track performance
- **Admins** can moderate content, manage users, handle disputes, and oversee platform operations
- **Super Admins** have full system access and can create admin accounts

---

## Tech Stack

### Core Framework & Language

| Technology     | Version | Purpose              |
| -------------- | ------- | -------------------- |
| **NestJS**     | ^11.x   | Backend framework    |
| **TypeScript** | ^5.7.3  | Programming language |
| **Node.js**    | >= 20.x | Runtime environment  |

### Database & ORM

| Technology     | Version | Purpose                     |
| -------------- | ------- | --------------------------- |
| **PostgreSQL** | ^16.x   | Primary relational database |
| **TypeORM**    | ^0.3.28 | Object-Relational Mapping   |
| **Redis**      | ^7.x    | Caching and session storage |
| **ioredis**    | ^5.9.2  | Redis client                |

### Authentication & Security

| Technology              | Version | Purpose                     |
| ----------------------- | ------- | --------------------------- |
| **Passport**            | ^0.7.0  | Authentication middleware   |
| **Passport JWT**        | ^4.0.1  | JWT authentication strategy |
| **@nestjs/jwt**         | ^11.0.2 | JWT module for NestJS       |
| **bcrypt**              | ^6.0.0  | Password hashing            |
| **Helmet**              | ^8.1.0  | Security headers            |
| **google-auth-library** | ^10.5.0 | Google OAuth verification   |

### Background Jobs & Scheduling

| Technology         | Version | Purpose                       |
| ------------------ | ------- | ----------------------------- |
| **BullMQ**         | ^5.67.3 | Job queue (Redis-based)       |
| **@nestjs/bullmq** | ^11.0.4 | BullMQ integration for NestJS |

### Communication Services

| Technology         | Version | Purpose                    |
| ------------------ | ------- | -------------------------- |
| **@sendgrid/mail** | ^8.1.6  | Email service              |
| **Twilio**         | ^5.12.0 | SMS and phone verification |

### File Storage

| Technology     | Version | Purpose                |
| -------------- | ------- | ---------------------- |
| **Cloudinary** | ^2.9.0  | Image and file storage |
| **Multer**     | ^2.0.2  | File upload handling   |

### API Documentation

| Technology           | Version | Purpose                |
| -------------------- | ------- | ---------------------- |
| **@nestjs/swagger**  | ^11.2.5 | API documentation      |
| **@nestjs/terminus** | ^11.0.0 | Health check endpoints |

### Validation & Transformation

| Technology            | Version | Purpose                         |
| --------------------- | ------- | ------------------------------- |
| **class-validator**   | ^0.14.3 | DTO validation                  |
| **class-transformer** | ^0.5.1  | Object transformation           |
| **Joi**               | ^18.0.2 | Environment variable validation |

### Logging & Utilities

| Technology  | Version | Purpose            |
| ----------- | ------- | ------------------ |
| **Winston** | ^3.19.0 | Logging framework  |
| **Bowser**  | ^2.13.1 | User agent parsing |

### Real-time Communication (Planned)

| Technology                     | Version | Purpose               |
| ------------------------------ | ------- | --------------------- |
| **Socket.io**                  | ^4.8.1  | WebSocket server      |
| **@nestjs/websockets**         | ^11.1.9 | WebSocket integration |
| **@nestjs/platform-socket.io** | ^11.1.9 | Socket.io adapter     |

### Development Tools

| Technology      | Version | Purpose                   |
| --------------- | ------- | ------------------------- |
| **ESLint**      | ^9.18.0 | Code linting              |
| **Prettier**    | ^3.4.2  | Code formatting           |
| **Jest**        | ^30.0.0 | Testing framework         |
| **Husky**       | ^9.1.7  | Git hooks                 |
| **lint-staged** | ^16.2.7 | Staged file linting       |
| **commitlint**  | ^20.3.1 | Commit message validation |

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT APPLICATIONS                       │
│         (Web App / iOS App / Android App)                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY (NestJS)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │   Guards     │  │ Interceptors │  │  Filters & Pipes  │ │
│  │ (JWT/Roles)  │  │  (Logging)   │  │ (Validation)      │ │
│  └──────────────┘  └──────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐
│ REST APIs    │  │ Background   │  │  Health Checks        │
│ (HTTP)       │  │  Jobs (Bull) │  │  (Terminus)           │
└──────────────┘  └──────────────┘  └──────────────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │ AuthService   │  │ UserService │ │ NotificationSvc  │ │
│  │ SessionSvc   │  │ SellerSvc   │ │  CronService       │ │
│  └──────────────┘  └──────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │  PostgreSQL   │  │    Redis     │  │   Cloudinary     │ │
│  │  (TypeORM)    │  │  (BullMQ)    │  │  (File Storage)  │ │
│  └──────────────┘  └──────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

```
Client Request
    │
    ▼
Request ID Middleware (adds unique request ID)
    │
    ▼
CORS & Security Headers (Helmet)
    │
    ▼
Global Validation Pipe (DTO validation)
    │
    ▼
JWT Auth Guard (if not @Public())
    │
    ▼
Roles Guard (if @Roles() specified)
    │
    ▼
Controller (Route Handler)
    │
    ▼
Service (Business Logic)
    │
    ▼
Repository (Database Operations)
    │
    ▼
Response Interceptor (standardize response)
    │
    ▼
Logging Interceptor (log request/response)
    │
    ▼
Client Response
```

### Module Architecture

The application follows a **feature-based modular architecture**:

- Each feature is a self-contained module with:
  - Controller (HTTP endpoints)
  - Service (business logic)
  - Repository (data access layer)
  - Entities (database models)
  - DTOs (data transfer objects)
  - Guards (authorization - if needed)

### Admin vs User Architecture

```
User Controller      Admin Controller
       │                    │
       └──────────┬─────────┘
                  │
            Shared Repository
                  │
               Database
```

- **Controllers** = API exposure and permissions
- **Services** = Business logic (separate for admin/user)
- **Repositories** = Database operations (shared)

---

## Project Structure

```
fixtree-backend/
├── .github/
│   └── workflows/                    # CI/CD workflows
│       ├── ci.yml                    # CI pipeline
│       ├── deploy-staging.yml        # Staging deployment
│       └── deploy-production.yml     # Production deployment
│
├── .husky/                           # Git hooks
│   ├── pre-commit                    # Run lint-staged
│   └── commit-msg                    # Run commitlint
│
├── src/
│   ├── main.ts                       # Application entry point
│   ├── app.module.ts                 # Root module
│   │
│   ├── config/                       # Configuration
│   │   ├── config.module.ts          # Config module (loads all configs)
│   │   ├── env.validation.ts         # Joi schema for env validation
│   │   ├── app.config.ts             # App settings (port, cors)
│   │   ├── database.config.ts        # PostgreSQL settings
│   │   ├── jwt.config.ts             # JWT secrets & expiry
│   │   ├── bullmq.config.ts          # Redis & BullMQ settings
│   │   ├── cloudinary.config.ts      # Cloudinary credentials
│   │   ├── sendgrid.config.ts        # SendGrid settings
│   │   ├── twilio.config.ts          # Twilio SMS settings
│   │   └── google.config.ts          # Google OAuth settings
│   │
│   ├── common/                       # Shared utilities
│   │   ├── constants/
│   │   │   ├── app.constants.ts      # App-wide constants
│   │   │   └── queue.constants.ts    # Queue & cron job names
│   │   │
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts    # @Roles() decorator
│   │   │   ├── current-user.decorator.ts # @CurrentUser() decorator
│   │   │   └── public.decorator.ts   # @Public() skip auth
│   │   │
│   │   ├── dto/
│   │   │   ├── requests/
│   │   │   │   └── pagination.dto.ts # Pagination query params
│   │   │   └── responses/
│   │   │       └── pagination-response.dto.ts # Paginated response
│   │   │
│   │   ├── enums/
│   │   │   ├── role.enum.ts          # BUYER | SELLER | ADMIN | SUPER_ADMIN
│   │   │   ├── platform.enum.ts      # WEB | IOS | ANDROID
│   │   │   └── notifications/
│   │   │       ├── notification-channel.enum.ts
│   │   │       ├── notification-status.enum.ts
│   │   │       └── notification-type.enum.ts
│   │   │
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts     # JWT authentication
│   │   │   └── roles.guard.ts        # Role-based authorization
│   │   │
│   │   ├── interceptors/
│   │   │   ├── response.interceptor.ts # Standardize responses
│   │   │   ├── logging.interceptor.ts  # Request/response logging
│   │   │   └── audit-log.interceptor.ts # Admin action logging
│   │   │
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts # Global exception handler
│   │   │
│   │   ├── middleware/
│   │   │   └── request-id.middleware.ts # Unique request ID
│   │   │
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts    # DTO validation
│   │   │
│   │   ├── types/
│   │   │   ├── jwt-payload.type.ts   # JWT payload interface
│   │   │   └── api-response.type.ts  # API response type
│   │   │
│   │   ├── util/
│   │   │   ├── util.module.ts
│   │   │   ├── util.service.ts       # Hash, date, pagination helpers
│   │   │   └── query-helpers.ts      # Query utility functions
│   │   │
│   │   └── validators/
│   │       └── at-least-one.validator.ts # Custom validators
│   │
│   ├── database/                     # Database configuration
│   │   ├── database.module.ts        # Database module setup
│   │   ├── typeorm.config.ts         # TypeORM configuration
│   │   ├── entities/
│   │   │   └── base.entity.ts        # Base entity (id, timestamps, soft delete)
│   │   ├── migrations/               # Database migrations
│   │   │   ├── 1770104650877-CreateUsersTable.ts
│   │   │   ├── 1770116478759-CreateSessionsTable.ts
│   │   │   ├── 1770200000000-UpdateUserVerificationColumns.ts
│   │   │   ├── 1770382379999-CreateSellerTable.ts
│   │   │   └── 1770641751490-CreateNotificationsTable.ts
│   │   └── seeders/                  # Database seeders
│   │       ├── seeder.module.ts
│   │       ├── seeder.service.ts
│   │       └── data/
│   │           └── super-admin.seed.ts
│   │
│   ├── queues/                       # Background jobs
│   │   ├── bullmq.module.ts          # BullMQ setup
│   │   └── cron/
│   │       ├── cron.module.ts
│   │       ├── cron.service.ts       # Register scheduled jobs
│   │       └── cron.processor.ts     # Process cron jobs
│   │
│   ├── shared/                       # Shared services
│   │   ├── cloudinary/
│   │   │   ├── cloudinary.module.ts
│   │   │   ├── cloudinary.service.ts
│   │   │   └── dto/
│   │   │       └── cloudinary-upload-result.dto.ts
│   │   │
│   │   ├── sendgrid/
│   │   │   ├── sendgrid.module.ts
│   │   │   ├── sendgrid.service.ts
│   │   │   └── dto/
│   │   │       └── send-email.dto.ts
│   │   │
│   │   ├── twilio/
│   │   │   ├── twilio.module.ts
│   │   │   └── twilio.service.ts     # SMS & Phone verification
│   │   │
│   │   ├── upload/
│   │   │   ├── upload.module.ts
│   │   │   ├── upload.service.ts
│   │   │   └── upload.config.ts      # Multer configuration
│   │   │
│   │   ├── logger/
│   │   │   ├── logger.module.ts
│   │   │   └── logger.service.ts      # Winston logger
│   │   │
│   │   └── redis/
│   │       ├── redis.module.ts
│   │       └── redis.constants.ts
│   │
│   └── modules/                      # Feature modules
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts    # Auth endpoints
│       │   ├── auth.service.ts       # Auth business logic
│       │   ├── strategies/
│       │   │   ├── jwt.strategy.ts    # JWT access token strategy
│       │   │   └── jwt-refresh.strategy.ts # JWT refresh token strategy
│       │   ├── sessions/
│       │   │   ├── sessions.module.ts
│       │   │   ├── sessions.controller.ts
│       │   │   ├── sessions.service.ts
│       │   │   ├── sessions.repository.ts
│       │   │   ├── device-parser.service.ts # Parse device info
│       │   │   ├── entities/
│       │   │   │   └── session.entity.ts
│       │   │   └── dto/
│       │   │       └── responses/
│       │   │           └── session-response.dto.ts
│       │   └── dto/
│       │       ├── requests/         # Input DTOs
│       │       │   ├── login.dto.ts
│       │       │   ├── register.dto.ts
│       │       │   ├── google-login.dto.ts
│       │       │   ├── refresh-token.dto.ts
│       │       │   ├── change-password.dto.ts
│       │       │   ├── forgot-password.dto.ts
│       │       │   ├── reset-password.dto.ts
│       │       │   ├── update-profile.dto.ts
│       │       │   ├── verify-email.dto.ts
│       │       │   ├── verify-phone.dto.ts
│       │       │   ├── resend-email-verification.dto.ts
│       │       │   ├── resend-phone-verification.dto.ts
│       │       │   └── device-info.dto.ts
│       │       └── responses/        # Output DTOs
│       │           ├── login-response.dto.ts
│       │           ├── register-response.dto.ts
│       │           ├── message-response.dto.ts
│       │           ├── verify-email-response.dto.ts
│       │           ├── verify-email-user.dto.ts
│       │           └── user-response.dto.ts
│       │
│       ├── users/
│       │   ├── users.module.ts
│       │   ├── users.service.ts
│       │   ├── users.repository.ts
│       │   ├── entities/
│       │   │   └── user.entity.ts
│       │   └── dto/
│       │       ├── create-user.dto.ts
│       │       └── update-user.dto.ts
│       │
│       ├── sellers/
│       │   ├── sellers.module.ts
│       │   ├── sellers.controller.ts
│       │   ├── sellers.service.ts
│       │   ├── sellers.repository.ts
│       │   ├── entities/
│       │   │   └── seller.entity.ts
│       │   └── dto/
│       │       └── requests/
│       │           └── create-seller.dto.ts
│       │
│       ├── notifications/
│       │   ├── notifications.module.ts
│       │   ├── notifications.service.ts
│       │   ├── notifications.repository.ts
│       │   ├── notifications.processor.ts # BullMQ processor
│       │   ├── entities/
│       │   │   └── notification.entity.ts
│       │   └── dto/
│       │       ├── create-notification.dto.ts
│       │       ├── update-notification-status.dto.ts
│       │       ├── send-email.dto.ts
│       │       ├── send-sms.dto.ts
│       │       ├── email-job-data.dto.ts
│       │       └── sms-job-data.dto.ts
│       │
│       ├── health/
│       │   ├── health.module.ts
│       │   ├── health.controller.ts
│       │   └── dto/
│       │       ├── health-check-response.dto.ts
│       │       ├── health-status.dto.ts
│       │       ├── health-info.dto.ts
│       │       ├── health-details.dto.ts
│       │       ├── database-health-response.dto.ts
│       │       ├── database-health-info.dto.ts
│       │       ├── database-health-details.dto.ts
│       │       ├── redis-health-response.dto.ts
│       │       ├── redis-health-info.dto.ts
│       │       └── redis-health-details.dto.ts
│       │
│       └── admin/
│           ├── admin.module.ts
│           ├── auth/
│           │   ├── admin-auth.module.ts
│           │   ├── admin-auth.controller.ts
│           │   └── admin-auth.service.ts
│           └── users/
│               ├── admin-users.module.ts
│               ├── admin-users.controller.ts
│               ├── admin-users.service.ts
│               └── dto/
│                   └── responses/
│                       └── user-response.dto.ts
│
├── test/                            # E2E tests
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
│
├── .env.example                     # Environment variables template
├── .gitignore
├── .prettierrc                      # Prettier configuration
├── .lintstagedrc                    # lint-staged configuration
├── .commitlintrc                    # commitlint configuration
├── eslint.config.mjs                # ESLint configuration
├── nest-cli.json                    # NestJS CLI configuration
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── tsconfig.build.json               # Build TypeScript configuration
├── DOCS.md                          # Original documentation
├── README.md                        # Project readme
└── PROJECT-DOCUMENTATION.md         # This file
```

---

## Database Schema

### Base Entity

All entities extend `BaseEntity` which provides:

```typescript
- id: UUID (Primary Key)
- createdAt: Timestamp
- updatedAt: Timestamp
- deletedAt: Timestamp (Soft Delete)
```

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NULLABLE,
  password VARCHAR(255) NULLABLE,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(30) UNIQUE NULLABLE,
  role ENUM('BUYER', 'SELLER', 'ADMIN', 'SUPER_ADMIN') DEFAULT 'BUYER',
  is_email_verified BOOLEAN DEFAULT false,
  is_phone_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  google_id VARCHAR(255) UNIQUE NULLABLE,
  profile_image TEXT NULLABLE,
  country VARCHAR(100) NULLABLE,
  state VARCHAR(100) NULLABLE,
  city VARCHAR(100) NULLABLE,
  postal_code VARCHAR(20) NULLABLE,
  address VARCHAR(255) NULLABLE,
  accepts_marketing_emails BOOLEAN DEFAULT false,
  email_verification_token VARCHAR(255) NULLABLE,
  email_verification_expires TIMESTAMPTZ NULLABLE,
  email_verification_sent_at TIMESTAMPTZ NULLABLE,
  phone_verification_sent_at TIMESTAMPTZ NULLABLE,
  password_reset_token VARCHAR(255) NULLABLE,
  password_reset_expires TIMESTAMPTZ NULLABLE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULLABLE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
```

**Relationships:**

- One-to-One with `sellers` table
- One-to-Many with `sessions` table
- One-to-Many with `notifications` table

### Sessions Table

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform ENUM('WEB', 'IOS', 'ANDROID') DEFAULT 'WEB',
  device_id VARCHAR(255) NULLABLE,
  device_name VARCHAR(255) NULLABLE,
  app_version VARCHAR(50) NULLABLE,
  os_version VARCHAR(100) NULLABLE,
  user_agent TEXT NULLABLE,
  ip_address VARCHAR(64) NULLABLE,
  last_used_at TIMESTAMPTZ NULLABLE,
  expires_at TIMESTAMPTZ NULLABLE,
  is_revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
```

**Relationships:**

- Many-to-One with `users` table

### Sellers Table

```sql
CREATE TABLE seller (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULLABLE
);

CREATE INDEX idx_seller_user_id ON seller(user_id);
```

**Relationships:**

- One-to-One with `users` table

### Notifications Table

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  channel ENUM('EMAIL', 'SMS', 'PUSH') NOT NULL,
  type ENUM('WELCOME', 'VERIFICATION', 'PASSWORD_RESET', 'BOOKING', 'MESSAGE', 'REVIEW', 'SYSTEM') NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NULLABLE,
  content TEXT NOT NULL,
  status ENUM('PENDING', 'SENT', 'DELIVERED', 'FAILED') DEFAULT 'PENDING',
  error_message TEXT NULLABLE,
  sent_at TIMESTAMPTZ NULLABLE,
  delivered_at TIMESTAMPTZ NULLABLE,
  metadata JSONB NULLABLE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULLABLE
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
```

**Relationships:**

- Many-to-One with `users` table

### Database ERD (Entity Relationship Diagram)

#### Complete Database Entity Relationship Diagram

This ERD shows all database tables and their relationships for the complete Fixtree platform, including both implemented (✅) and planned (🚧) features.

```mermaid
erDiagram
    %% Core User Management (✅ Implemented)
    users ||--o{ sessions : "has many"
    users ||--o| seller : "has one"
    users ||--o{ notifications : "receives"

    %% Marketplace Core (🚧 Planned)
    users ||--o{ services : "creates"
    users ||--o{ bookings : "creates"
    users ||--o{ reviews : "writes"
    users ||--o{ addresses : "has many"

    categories ||--o{ services : "categorizes"
    services ||--o{ bookings : "has bookings"
    services ||--o{ reviews : "has reviews"
    services ||--o{ service_availability : "has schedule"
    services ||--o{ service_social_links : "has links"

    bookings ||--|| reviews : "has one review"
    bookings ||--o{ booking_images : "has images"
    bookings ||--o{ disputes : "can have disputes"

    %% Communication (🚧 Planned)
    users ||--o{ conversations_p1 : "participant1"
    users ||--o{ conversations_p2 : "participant2"
    conversations ||--o{ messages : "contains"
    messages ||--o{ message_safety : "can be flagged"

    %% Boost System (🚧 Planned)
    boost_plans ||--o{ boost_management : "used in"
    boost_plans ||--o{ boost_subscriptions : "subscribed"
    services ||--o{ boost_management : "can be boosted"
    services ||--o{ boost_subscriptions : "can subscribe"
    boost_management ||--o{ boost_audit_log : "has logs"

    %% Support & Disputes (🚧 Planned)
    users ||--o{ support_requests : "creates"
    users ||--o{ disputes_user : "files as user"
    users ||--o{ disputes_seller : "involved as seller"
    users ||--o{ strikes : "receives"

    %% Analytics & Performance (🚧 Planned)
    users ||--o| performance_analytics : "has analytics"

    %% System Management (🚧 Planned)
    users ||--o{ audit_log : "performs actions"
    cities ||--o{ addresses : "located in"

    %% Entity Definitions

    users {
        uuid id PK
        varchar email UK
        varchar password
        varchar name
        varchar phone UK
        enum role
        boolean is_email_verified
        boolean is_phone_verified
        boolean is_active
        varchar google_id UK
        text profile_image
        varchar country
        varchar state
        varchar city
        varchar postal_code
        varchar address
        boolean accepts_marketing_emails
        varchar email_verification_token
        timestamptz email_verification_expires
        timestamptz email_verification_sent_at
        timestamptz phone_verification_sent_at
        varchar password_reset_token
        timestamptz password_reset_expires
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    sessions {
        uuid id PK
        uuid user_id FK
        enum platform
        varchar device_id
        varchar device_name
        varchar app_version
        varchar os_version
        text user_agent
        varchar ip_address
        timestamptz last_used_at
        timestamptz expires_at
        boolean is_revoked
        timestamptz created_at
        timestamptz updated_at
    }

    seller {
        uuid id PK
        uuid user_id FK UK
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    notifications {
        uuid id PK
        uuid user_id FK
        enum channel
        enum type
        varchar recipient
        varchar subject
        text content
        enum status
        text error_message
        timestamptz sent_at
        timestamptz delivered_at
        jsonb metadata
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    categories {
        uuid id PK
        varchar name
        text description
        varchar icon
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    services {
        uuid id PK
        uuid seller_id FK
        uuid category_id FK
        varchar title
        text_array photos
        text short_description
        decimal price_from
        varchar service_area
        decimal latitude
        decimal longitude
        enum status
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    service_availability {
        uuid id PK
        uuid service_id FK
        integer day_of_week
        time start_time
        time end_time
        boolean is_available
        timestamptz created_at
        timestamptz updated_at
    }

    service_social_links {
        uuid id PK
        uuid service_id FK
        varchar platform
        varchar url
        timestamptz created_at
        timestamptz updated_at
    }

    bookings {
        uuid id PK
        uuid service_id FK
        uuid user_id FK
        date booking_date
        varchar start_time
        varchar end_time
        varchar service_address
        varchar city
        varchar country
        varchar address_name
        varchar postal_code
        varchar full_name
        text describe_problem
        text_array upload_photos
        decimal estimated_budget
        decimal latitude
        decimal longitude
        decimal arrival_latitude
        decimal arrival_longitude
        boolean arrival_15_notified
        boolean arrival_30_notified
        boolean arrival_1_notified
        boolean arrival_2_notified
        boolean complete_job
        boolean payment_checked
        varchar otp_code
        integer arrival_rating
        text worker_notes
        enum status
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    booking_images {
        uuid id PK
        uuid booking_id FK
        text image_url
        timestamptz created_at
    }

    reviews {
        uuid id PK
        uuid booking_id FK UK
        uuid reviewer_id FK
        uuid service_id FK
        uuid seller_id FK
        integer rating
        text comment
        boolean is_featured
        text reply
        timestamptz reply_date
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    conversations {
        uuid id PK
        uuid participant1_id FK
        uuid participant2_id FK
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    messages {
        uuid id PK
        uuid conversation_id FK
        uuid sender_id FK
        text message
        text file_url
        varchar file_type
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    message_safety {
        uuid id PK
        uuid message_id FK
        varchar violation_type
        timestamptz detected_at
        varchar action_taken
        uuid admin_id FK
        timestamptz created_at
    }

    addresses {
        uuid id PK
        uuid user_id FK
        uuid city_id FK
        varchar address_name
        text full_address
        varchar city
        varchar state
        varchar country
        varchar postal_code
        decimal latitude
        decimal longitude
        boolean is_default
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    boost_plans {
        uuid id PK
        varchar name
        text description
        integer duration_days
        decimal price
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    boost_management {
        uuid id PK
        uuid service_id FK
        uuid boost_plan_id FK
        timestamptz start_date
        timestamptz end_date
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    boost_subscriptions {
        uuid id PK
        uuid seller_id FK
        uuid boost_plan_id FK
        uuid service_id FK
        timestamptz start_date
        timestamptz end_date
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    boost_audit_log {
        uuid id PK
        uuid boost_id FK
        varchar action
        uuid performed_by FK
        jsonb details
        timestamptz created_at
    }

    support_requests {
        uuid id PK
        uuid user_id FK
        varchar subject
        text message
        enum status
        text admin_response
        uuid admin_id FK
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    disputes {
        uuid id PK
        uuid booking_id FK
        uuid user_id FK
        uuid seller_id FK
        text reason
        enum status
        text admin_notes
        timestamptz resolved_at
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    strikes {
        uuid id PK
        uuid user_id FK
        text reason
        uuid admin_id FK
        timestamptz created_at
        timestamptz updated_at
    }

    performance_analytics {
        uuid id PK
        uuid seller_id FK UK
        decimal reliability_score
        integer total_bookings
        integer completed_bookings
        integer cancelled_bookings
        decimal average_rating
        integer total_reviews
        integer response_time_minutes
        timestamptz created_at
        timestamptz updated_at
    }

    audit_log {
        uuid id PK
        uuid user_id FK
        varchar action
        varchar entity_type
        uuid entity_id
        jsonb details
        varchar ip_address
        text user_agent
        timestamptz created_at
    }

    cities {
        uuid id PK
        varchar name
        varchar country
        varchar state
        decimal latitude
        decimal longitude
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at
    }

    system_settings {
        uuid id PK
        varchar key UK
        text value
        varchar category
        text description
        uuid updated_by FK
        timestamptz created_at
        timestamptz updated_at
    }
```

#### Relationship Summary

##### Core Relationships

1. **Users** (Central Entity)
   - One-to-Many: Sessions, Notifications, Addresses
   - One-to-One: Seller, Performance Analytics
   - One-to-Many: Services (as seller), Bookings (as buyer), Reviews (as reviewer)
   - Many-to-Many: Conversations (via participant1_id and participant2_id)

2. **Services** (Marketplace Core)
   - Many-to-One: Category, Seller (User)
   - One-to-Many: Bookings, Reviews, Service Availability, Service Social Links
   - One-to-Many: Boost Management, Boost Subscriptions

3. **Bookings** (Service Transactions)
   - Many-to-One: Service, User (Buyer)
   - One-to-One: Review
   - One-to-Many: Booking Images, Disputes

4. **Reviews** (Feedback System)
   - Many-to-One: Booking, Service, Seller, Reviewer (User)
   - One-to-One: Booking

5. **Conversations & Messages** (Communication)
   - Conversations: Many-to-Many between Users (via participant1_id/participant2_id)
   - Messages: Many-to-One with Conversations and Sender (User)
   - Messages: One-to-One with Message Safety (for violations)

6. **Boost System** (Marketing)
   - Boost Plans → Boost Management → Services
   - Boost Plans → Boost Subscriptions → Services
   - Boost Management → Boost Audit Log

7. **Support & Disputes** (Customer Service)
   - Support Requests: Many-to-One with User (requester) and Admin (responder)
   - Disputes: Many-to-One with Booking, User (buyer), Seller (User)
   - Strikes: Many-to-One with User (violator) and Admin

8. **System Management**
   - Cities: One-to-Many with Addresses
   - Audit Log: Many-to-One with User (performer)
   - System Settings: Many-to-One with User (updated_by)

#### Entity Groups Overview

The database is organized into logical groups:

```
┌─────────────────────────────────────────────────────────────┐
│                    CORE USER MANAGEMENT                       │
│  ✅ users → sessions (1:N)                                   │
│  ✅ users → seller (1:1)                                     │
│  ✅ users → notifications (1:N)                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    MARKETPLACE CORE                          │
│  🚧 categories → services (1:N)                             │
│  🚧 users → services (1:N, as seller)                        │
│  🚧 services → bookings (1:N)                               │
│  🚧 services → reviews (1:N)                                 │
│  🚧 bookings → reviews (1:1)                                │
│  🚧 users → bookings (1:N, as buyer)                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    COMMUNICATION                             │
│  🚧 users ↔ conversations (N:M via participants)            │
│  🚧 conversations → messages (1:N)                           │
│  🚧 messages → message_safety (1:1, optional)                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BOOST & MARKETING                         │
│  🚧 boost_plans → boost_management (1:N)                     │
│  🚧 boost_plans → boost_subscriptions (1:N)                  │
│  🚧 services → boost_management (1:N)                         │
│  🚧 boost_management → boost_audit_log (1:N)                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPPORT & DISPUTES                        │
│  🚧 users → support_requests (1:N)                           │
│  🚧 bookings → disputes (1:N)                                │
│  🚧 users → disputes (1:N, as buyer/seller)                   │
│  🚧 users → strikes (1:N)                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    ANALYTICS & MANAGEMENT                     │
│  🚧 users → performance_analytics (1:1, sellers only)         │
│  🚧 users → audit_log (1:N, admin actions)                   │
│  🚧 cities → addresses (1:N)                                  │
│  🚧 users → addresses (1:N)                                  │
└─────────────────────────────────────────────────────────────┘
```

#### Critical Relationships to Understand

1. **User → Seller → Services → Bookings → Reviews**
   - A user can become a seller (1:1)
   - A seller creates services (1:N)
   - Buyers create bookings for services (N:1)
   - Each booking can have one review (1:1)

2. **Service Availability & Social Links**
   - Services have availability schedules (1:N)
   - Services can have social media links (1:N)

3. **Boost System Flow**
   - Boost Plans define available boost options
   - Services can be boosted via Boost Management
   - Sellers can subscribe to boost plans for their services

4. **Communication Flow**
   - Users can have multiple conversations (N:M relationship)
   - Each conversation contains multiple messages
   - Messages can be flagged for safety violations

5. **Support & Dispute Resolution**
   - Users can create support requests
   - Bookings can have disputes
   - Admins can issue strikes to users

#### Database Design Principles

1. **Normalization**: Tables are normalized to 3NF to reduce redundancy
2. **Referential Integrity**: Foreign keys with CASCADE deletes maintain data consistency
3. **Soft Deletes**: Most entities support soft deletion for audit trails
4. **Indexing**: Key fields (user_id, service_id, etc.) are indexed for performance
5. **Enums**: Status fields use enums for type safety and validation
6. **Timestamps**: All entities track creation and update times
7. **UUID Primary Keys**: All tables use UUID for distributed system compatibility

### Database Migrations

Migrations are located in `src/database/migrations/`:

#### ✅ Implemented Migrations

1. **1770104650877-CreateUsersTable.ts** - Creates users table
2. **1770116478759-CreateSessionsTable.ts** - Creates sessions table
3. **1770200000000-UpdateUserVerificationColumns.ts** - Adds verification columns
4. **1770382379999-CreateSellerTable.ts** - Creates sellers table
5. **1770641751490-CreateNotificationsTable.ts** - Creates notifications table

#### 🚧 Planned Migrations

6. **CreateCategoriesTable.ts** - Creates categories table
7. **CreateServicesTable.ts** - Creates services, service_availability, service_social_links tables
8. **CreateBookingsTable.ts** - Creates bookings and booking_images tables
9. **CreateReviewsTable.ts** - Creates reviews table
10. **CreateConversationsTable.ts** - Creates conversations table
11. **CreateMessagesTable.ts** - Creates messages table
12. **CreateSupportRequestsTable.ts** - Creates support_requests table
13. **CreateDisputesTable.ts** - Creates disputes table
14. **CreateStrikesTable.ts** - Creates strikes table
15. **CreateAddressesTable.ts** - Creates addresses table
16. **CreateBoostPlansTable.ts** - Creates boost_plans table
17. **CreateBoostManagementTable.ts** - Creates boost_management table
18. **CreateBoostSubscriptionsTable.ts** - Creates boost_subscriptions table
19. **CreateBoostAuditLogTable.ts** - Creates boost_audit_log table
20. **CreatePerformanceAnalyticsTable.ts** - Creates performance_analytics table
21. **CreateMessageSafetyTable.ts** - Creates message_safety table
22. **CreateAuditLogTable.ts** - Creates audit_log table
23. **CreateCitiesTable.ts** - Creates cities table
24. **CreateSystemSettingsTable.ts** - Creates system_settings table

---

## API Documentation

### Base URL

```
Development: http://localhost:3000/api
Production: https://api.fixtree.com/api
```

### Swagger Documentation

```
GET /api/docs
```

Interactive API documentation with authentication support.

### Authentication Endpoints

#### Public Endpoints

| Method | Endpoint                          | Description                                    |
| ------ | --------------------------------- | ---------------------------------------------- |
| POST   | `/auth/register`                  | Register new user (Buyer/Seller)               |
| POST   | `/auth/login`                     | Login user (requires email/phone verification) |
| POST   | `/auth/google`                    | Google OAuth login                             |
| POST   | `/auth/refresh`                   | Refresh access token                           |
| POST   | `/auth/password/forgot`           | Request password reset                         |
| POST   | `/auth/password/reset`            | Reset password with token                      |
| POST   | `/auth/email/verify`              | Verify email address                           |
| POST   | `/auth/email/resend-verification` | Resend email verification                      |
| POST   | `/auth/phone/verify`              | Verify phone OTP                               |
| POST   | `/auth/phone/resend-verification` | Resend phone verification OTP                  |

#### Protected Endpoints

| Method | Endpoint                | Description              | Roles         |
| ------ | ----------------------- | ------------------------ | ------------- |
| POST   | `/auth/logout`          | Logout current device    | BUYER, SELLER |
| POST   | `/auth/password/change` | Change password          | BUYER, SELLER |
| GET    | `/auth/me`              | Get current user profile | BUYER, SELLER |
| PATCH  | `/auth/profile`         | Update profile           | BUYER, SELLER |
| GET    | `/auth/sessions`        | List all sessions        | BUYER, SELLER |
| DELETE | `/auth/sessions/:id`    | Logout specific device   | BUYER, SELLER |
| DELETE | `/auth/sessions`        | Logout all devices       | BUYER, SELLER |
| DELETE | `/auth/sessions/others` | Logout other devices     | BUYER, SELLER |

### User Endpoints

| Method | Endpoint     | Description    | Roles         |
| ------ | ------------ | -------------- | ------------- |
| GET    | `/users/:id` | Get user by ID | BUYER, SELLER |

### Seller Endpoints

| Method | Endpoint           | Description           | Roles         |
| ------ | ------------------ | --------------------- | ------------- |
| POST   | `/sellers`         | Create seller profile | SELLER        |
| GET    | `/sellers/profile` | Get seller profile    | SELLER        |
| PATCH  | `/sellers/profile` | Update seller profile | SELLER        |
| GET    | `/sellers/:id`     | Get seller by ID      | BUYER, SELLER |

### Admin Endpoints

#### Admin Auth

| Method | Endpoint                      | Description              | Roles              |
| ------ | ----------------------------- | ------------------------ | ------------------ |
| POST   | `/admin/auth/login`           | Admin login              | ADMIN, SUPER_ADMIN |
| POST   | `/admin/auth/refresh`         | Refresh admin token      | ADMIN, SUPER_ADMIN |
| POST   | `/admin/auth/logout`          | Admin logout             | ADMIN, SUPER_ADMIN |
| POST   | `/admin/auth/password/change` | Change admin password    | ADMIN, SUPER_ADMIN |
| GET    | `/admin/auth/me`              | Get admin profile        | ADMIN, SUPER_ADMIN |
| PATCH  | `/admin/auth/profile`         | Update admin profile     | ADMIN, SUPER_ADMIN |
| GET    | `/admin/auth/sessions`        | List admin sessions      | ADMIN, SUPER_ADMIN |
| DELETE | `/admin/auth/sessions/:id`    | Logout admin device      | ADMIN, SUPER_ADMIN |
| DELETE | `/admin/auth/sessions`        | Logout all admin devices | ADMIN, SUPER_ADMIN |

#### Admin User Management

| Method | Endpoint           | Description      | Roles              |
| ------ | ------------------ | ---------------- | ------------------ |
| GET    | `/admin/users`     | List all users   | ADMIN, SUPER_ADMIN |
| POST   | `/admin/users`     | Create user      | SUPER_ADMIN        |
| GET    | `/admin/users/:id` | Get user details | ADMIN, SUPER_ADMIN |
| PATCH  | `/admin/users/:id` | Update user      | ADMIN, SUPER_ADMIN |
| DELETE | `/admin/users/:id` | Delete user      | ADMIN, SUPER_ADMIN |

### Health Check Endpoints

| Method | Endpoint        | Description            |
| ------ | --------------- | ---------------------- |
| GET    | `/health`       | Overall health status  |
| GET    | `/health/db`    | Database health status |
| GET    | `/health/redis` | Redis health status    |

---

## 🚧 Planned API Endpoints (To Be Implemented)

The following endpoints are planned as per **`IMPLEMENTATION-STAGES.md`**. Exact paths, roles, and request/response shapes are defined in each stage (e.g. Plans use `/plans` and `/admin/plans`; Plan Subscriptions use `/plan/subscriptions`; Admin create/view admins use `/admin/admins`).

### Category Endpoints

| Method | Endpoint          | Description         | Roles  |
| ------ | ----------------- | ------------------- | ------ |
| GET    | `/categories`     | List all categories | Public |
| GET    | `/categories/:id` | Get category by ID  | Public |
| POST   | `/categories`     | Create category     | ADMIN  |
| PATCH  | `/categories/:id` | Update category     | ADMIN  |
| DELETE | `/categories/:id` | Delete category     | ADMIN  |

### Service Endpoints

| Method | Endpoint                         | Description                  | Roles          |
| ------ | -------------------------------- | ---------------------------- | -------------- |
| GET    | `/services`                      | List services (with filters) | Public         |
| GET    | `/services/:id`                  | Get service by ID            | Public         |
| POST   | `/services`                      | Create service               | SELLER         |
| PATCH  | `/services/:id`                  | Update service               | SELLER (Owner) |
| DELETE | `/services/:id`                  | Delete service               | SELLER (Owner) |
| GET    | `/services/seller/:sellerId`     | Get services by seller       | Public         |
| GET    | `/services/category/:categoryId` | Get services by category     | Public         |

### Booking Endpoints

| Method | Endpoint                      | Description                           | Roles         |
| ------ | ----------------------------- | ------------------------------------- | ------------- |
| GET    | `/bookings`                   | List bookings (filtered by user role) | BUYER, SELLER |
| GET    | `/bookings/:id`               | Get booking by ID                     | BUYER, SELLER |
| POST   | `/bookings`                   | Create booking                        | BUYER         |
| PATCH  | `/bookings/:id`               | Update booking                        | BUYER, SELLER |
| PATCH  | `/bookings/:id/status`        | Update booking status                 | SELLER        |
| POST   | `/bookings/:id/arrive`        | Mark seller arrival                   | SELLER        |
| POST   | `/bookings/:id/complete`      | Complete job                          | SELLER        |
| GET    | `/bookings/available-hours`   | Get available booking hours           | Public        |
| GET    | `/bookings/top-cities`        | Get top cities by bookings            | Public        |
| GET    | `/bookings/top-services`      | Get top services                      | Public        |
| GET    | `/bookings/ranked-sellers`    | Get ranked sellers                    | Public        |
| GET    | `/bookings/dashboard/metrics` | Get dashboard metrics                 | ADMIN         |
| GET    | `/bookings/dashboard/stats`   | Get dashboard statistics              | ADMIN         |

### Review Endpoints

| Method | Endpoint                      | Description               | Roles         |
| ------ | ----------------------------- | ------------------------- | ------------- |
| GET    | `/reviews`                    | List reviews              | Public        |
| GET    | `/reviews/:id`                | Get review by ID          | Public        |
| POST   | `/reviews`                    | Create review             | BUYER         |
| PATCH  | `/reviews/:id`                | Update review             | BUYER (Owner) |
| POST   | `/reviews/:id/reply`          | Reply to review           | SELLER        |
| POST   | `/reviews/:id/feature`        | Feature review            | ADMIN         |
| GET    | `/reviews/service/:serviceId` | Get reviews for a service | Public        |
| GET    | `/reviews/seller/:sellerId`   | Get reviews for a seller  | Public        |

### Chat Endpoints

| Method | Endpoint                           | Description                       | Roles         |
| ------ | ---------------------------------- | --------------------------------- | ------------- |
| GET    | `/chat/conversations`              | Get user conversations            | BUYER, SELLER |
| GET    | `/chat/conversations/:id`          | Get conversation by ID            | BUYER, SELLER |
| POST   | `/chat/conversations`              | Create conversation               | BUYER, SELLER |
| GET    | `/chat/conversations/:id/messages` | Get messages in conversation      | BUYER, SELLER |
| POST   | `/chat/messages`                   | Send message (also via WebSocket) | BUYER, SELLER |

### Customer Endpoints

| Method | Endpoint             | Description           | Roles |
| ------ | -------------------- | --------------------- | ----- |
| GET    | `/customer/profile`  | Get customer profile  | BUYER |
| GET    | `/customer/bookings` | Get customer bookings | BUYER |

### Support Endpoints

| Method | Endpoint       | Description               | Roles                |
| ------ | -------------- | ------------------------- | -------------------- |
| GET    | `/support`     | Get support requests      | BUYER, SELLER, ADMIN |
| POST   | `/support`     | Create support request    | BUYER, SELLER        |
| GET    | `/support/:id` | Get support request by ID | BUYER, SELLER, ADMIN |
| PATCH  | `/support/:id` | Update support request    | ADMIN                |

### Dispute Endpoints

| Method | Endpoint                | Description           | Roles                |
| ------ | ----------------------- | --------------------- | -------------------- |
| GET    | `/disputes`             | List disputes         | ADMIN                |
| POST   | `/disputes`             | Create dispute        | BUYER, SELLER        |
| GET    | `/disputes/:id`         | Get dispute by ID     | BUYER, SELLER, ADMIN |
| PATCH  | `/disputes/:id/status`  | Update dispute status | ADMIN                |
| POST   | `/disputes/:id/notes`   | Add note to dispute   | ADMIN                |
| POST   | `/disputes/:id/resolve` | Resolve dispute       | ADMIN                |

### Address Endpoints

| Method | Endpoint         | Description        | Roles         |
| ------ | ---------------- | ------------------ | ------------- |
| GET    | `/addresses`     | Get user addresses | BUYER, SELLER |
| POST   | `/addresses`     | Create address     | BUYER, SELLER |
| GET    | `/addresses/:id` | Get address by ID  | BUYER, SELLER |
| PATCH  | `/addresses/:id` | Update address     | BUYER, SELLER |
| DELETE | `/addresses/:id` | Delete address     | BUYER, SELLER |

### Boost Management Endpoints

| Method | Endpoint                | Description                  | Roles         |
| ------ | ----------------------- | ---------------------------- | ------------- |
| GET    | `/boost-management`     | Get boost management records | SELLER, ADMIN |
| POST   | `/boost-management`     | Create boost                 | SELLER        |
| GET    | `/boost-management/:id` | Get boost by ID              | SELLER, ADMIN |
| PATCH  | `/boost-management/:id` | Update boost                 | SELLER, ADMIN |

### Boost Plans Endpoints

| Method | Endpoint           | Description          | Roles  |
| ------ | ------------------ | -------------------- | ------ |
| GET    | `/boost-plans`     | List boost plans     | Public |
| POST   | `/boost-plans`     | Create boost plan    | ADMIN  |
| GET    | `/boost-plans/:id` | Get boost plan by ID | Public |
| PATCH  | `/boost-plans/:id` | Update boost plan    | ADMIN  |
| DELETE | `/boost-plans/:id` | Delete boost plan    | ADMIN  |

### Performance Analytics Endpoints

| Method | Endpoint                                    | Description               | Roles         |
| ------ | ------------------------------------------- | ------------------------- | ------------- |
| GET    | `/performance-analytics`                    | Get performance analytics | ADMIN         |
| GET    | `/performance-analytics/seller/:sellerId`   | Get seller performance    | SELLER, ADMIN |
| POST   | `/performance-analytics/seller-reliability` | Create reliability record | ADMIN         |

### System Settings Endpoints

| Method | Endpoint               | Description         | Roles |
| ------ | ---------------------- | ------------------- | ----- |
| GET    | `/system-settings`     | Get system settings | ADMIN |
| POST   | `/system-settings`     | Create setting      | ADMIN |
| GET    | `/system-settings/:id` | Get setting by ID   | ADMIN |
| PATCH  | `/system-settings/:id` | Update setting      | ADMIN |

### Audit Log Endpoints

| Method | Endpoint         | Description         | Roles |
| ------ | ---------------- | ------------------- | ----- |
| GET    | `/audit-log`     | Get audit logs      | ADMIN |
| GET    | `/audit-log/:id` | Get audit log by ID | ADMIN |

### Cities Endpoints

| Method | Endpoint      | Description    | Roles  |
| ------ | ------------- | -------------- | ------ |
| GET    | `/cities`     | List cities    | Public |
| POST   | `/cities`     | Create city    | ADMIN  |
| GET    | `/cities/:id` | Get city by ID | Public |
| PATCH  | `/cities/:id` | Update city    | ADMIN  |
| DELETE | `/cities/:id` | Delete city    | ADMIN  |

### API Response Format

All API responses follow this structure:

```typescript
{
  success: boolean;
  data: T;
  timestamp: string;
  requestId: string;
}
```

**Success Response Example:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "timestamp": "2026-02-10T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Error Response Example:**

```json
{
  "success": false,
  "message": "User not found",
  "statusCode": 404,
  "timestamp": "2026-02-10T12:00:00.000Z",
  "requestId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Authentication & Authorization

### JWT Authentication

The application uses JWT (JSON Web Tokens) for authentication with access and refresh tokens.

#### Token Structure

**Access Token Payload:**

```typescript
{
  sub: string; // User ID
  email: string; // User email
  role: Role; // User role
  type: 'access'; // Token type
  iat: number; // Issued at
  exp: number; // Expires at
}
```

**Refresh Token Payload:**

```typescript
{
  sub: string; // User ID
  sessionId: string; // Session ID
  type: 'refresh'; // Token type
  iat: number; // Issued at
  exp: number; // Expires at
}
```

#### Authentication Flow

1. **Registration/Login:**

   ```
   POST /auth/register or /auth/login
   → Returns: { accessToken, refreshToken, user }
   ```

2. **Using Access Token:**

   ```
   Authorization: Bearer <accessToken>
   ```

3. **Refreshing Token:**
   ```
   POST /auth/refresh
   Body: { refreshToken }
   → Returns: { accessToken, refreshToken }
   ```

### Role-Based Access Control

Roles are enforced using guards:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SELLER)
@Get('my-services')
```

**Available Roles:**

- `BUYER` - Can browse services, create bookings, leave reviews
- `SELLER` - Can create services, manage bookings, respond to reviews
- `ADMIN` - Can manage users, moderate content, handle disputes
- `SUPER_ADMIN` - Full system access, can create admins

### Google OAuth

Google OAuth integration flow:

1. Client sends Google ID token to `/auth/google`
2. Server verifies token with Google using `google-auth-library`
3. Creates/updates user account
4. Returns JWT tokens

**Google Login DTO:**

```typescript
{
  idToken: string;      // Google ID token
  deviceInfo?: {        // Optional device info
    platform: Platform;
    deviceId?: string;
    deviceName?: string;
    appVersion?: string;
    osVersion?: string;
  }
}
```

### Session Management

Sessions are tracked per device/platform:

- Each login creates a new session
- Sessions include device information (platform, device ID, OS version, etc.)
- Users can view all active sessions
- Users can logout from specific devices or all devices
- Sessions expire based on refresh token expiry

---

## Real-time Features

### WebSocket Chat

**Status:** 🚧 Planned

The application will use Socket.io for real-time chat communication.

#### Connection

```javascript
const socket = io('http://localhost:3000/chat', {
  auth: { token: 'your-jwt-token' },
});
```

#### WebSocket Events

**Client → Server:**

- `join_room` - Join a conversation room
  ```javascript
  socket.emit('join_room', { conversationId: 'conv-id' });
  ```
- `leave_room` - Leave a conversation room
  ```javascript
  socket.emit('leave_room', { conversationId: 'conv-id' });
  ```
- `send_message` - Send a message
  ```javascript
  socket.emit('send_message', {
    conversationId: 'conv-id',
    message: 'Hello!',
    fileUrl: null,
    fileType: null,
  });
  ```
- `typing_start` - User started typing
  ```javascript
  socket.emit('typing_start', { conversationId: 'conv-id' });
  ```
- `typing_stop` - User stopped typing
  ```javascript
  socket.emit('typing_stop', { conversationId: 'conv-id' });
  ```

**Server → Client:**

- `connected` - Connection confirmed
  ```javascript
  socket.on('connected', (data) => {
    console.log('Connected:', data);
  });
  ```
- `new_message` - Receive a new message
  ```javascript
  socket.on('new_message', (data) => {
    console.log('New message:', data);
  });
  ```
- `user_typing` - Another user is typing
  ```javascript
  socket.on('user_typing', (data) => {
    console.log('User typing:', data);
  });
  ```

#### Example Usage

```javascript
// Join conversation
socket.emit('join_room', { conversationId: 'conv-id' });

// Send message
socket.emit('send_message', {
  conversationId: 'conv-id',
  message: 'Hello!',
  fileUrl: null,
  fileType: null,
});

// Listen for messages
socket.on('new_message', (data) => {
  console.log('New message:', data);
});

// Typing indicators
socket.emit('typing_start', { conversationId: 'conv-id' });
// ... user stops typing ...
socket.emit('typing_stop', { conversationId: 'conv-id' });
```

#### Dependencies Required

```bash
npm install socket.io @nestjs/websockets @nestjs/platform-socket.io
```

---

## Modules Documentation

### Auth Module

**Location:** `src/modules/auth/`

**Features:**

- User registration (Buyer/Seller)
- Email/Password login
- Google OAuth login
- Email verification (OTP via SendGrid)
- Phone verification (OTP via Twilio)
- Password reset flow
- Password change
- Profile management
- Session management

**Key Services:**

- `AuthService` - Main authentication logic
- `SessionsService` - Session management
- `DeviceParserService` - Parse device information from user agent

**Key Entities:**

- `User` - User entity
- `Session` - Session entity

### Users Module

**Location:** `src/modules/users/`

**Features:**

- User CRUD operations
- User repository for database access

**Key Services:**

- `UsersService` - User business logic
- `UsersRepository` - Database operations

### Sellers Module

**Location:** `src/modules/sellers/`

**Features:**

- Seller profile creation
- Seller profile management
- Seller activation/deactivation

**Key Services:**

- `SellersService` - Seller business logic
- `SellersRepository` - Database operations

**Key Entities:**

- `Seller` - Seller entity (One-to-One with User)

### Notifications Module

**Location:** `src/modules/notifications/`

**Features:**

- Email notifications via SendGrid
- SMS notifications via Twilio
- Background job processing for notifications
- Notification status tracking
- Notification history

**Key Services:**

- `NotificationsService` - Notification business logic
- `NotificationsRepository` - Database operations
- `NotificationsProcessor` - BullMQ processor for async notifications

**Notification Channels:**

- `EMAIL` - Email notifications
- `SMS` - SMS notifications
- `PUSH` - Push notifications (future)

**Notification Types:**

- `WELCOME` - Welcome message
- `VERIFICATION` - Email/Phone verification
- `PASSWORD_RESET` - Password reset
- `BOOKING` - Booking related
- `MESSAGE` - Message notifications
- `REVIEW` - Review notifications
- `SYSTEM` - System notifications

### Health Module

**Location:** `src/modules/health/`

**Features:**

- Overall health check
- Database health check
- Redis health check
- Memory health check
- Disk health check

**Endpoints:**

- `GET /health` - Overall health
- `GET /health/db` - Database health
- `GET /health/redis` - Redis health

### Admin Module

**Location:** `src/modules/admin/`

**Features:**

- Admin authentication
- Admin user management
- Admin session management

**Sub-modules:**

- `admin/auth` - Admin authentication
- `admin/users` - Admin user management

---

## 🚧 Planned Modules (To Be Implemented)

The order, scope, and detailed specifications for planned modules are defined in **`IMPLEMENTATION-STAGES.md`** (Stages 16–44). The sections below summarize selected modules; for full task lists, DTOs, workflows, and dependencies, refer to IMPLEMENTATION-STAGES.md.

### Categories Module

**Status:** 🚧 Planned  
**Location:** `src/modules/categories/`

**Features:**

- Category CRUD operations
- Category management by admins
- Category icons and descriptions
- Category hierarchy support

**Endpoints (Planned):**

```
GET    /categories                     # List all categories
GET    /categories/:id                 # Get category by ID
POST   /categories                     # Create category (Admin)
PATCH  /categories/:id                 # Update category (Admin)
DELETE /categories/:id                 # Delete category (Admin)
```

**Database Schema:**

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NULLABLE,
  icon VARCHAR(255) NULLABLE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULLABLE
);
```

### Services Module

**Status:** 🚧 Planned  
**Location:** `src/modules/services/`

**Features:**

- Service listing creation and management
- Service photos upload
- Service availability management
- Service social links
- Service location tracking (latitude/longitude)
- Service status management (active, inactive, deleted)
- Service category association
- Service pricing (priceFrom)

**Endpoints (Planned):**

```
GET    /services                       # List services (with filters)
GET    /services/:id                   # Get service by ID
POST   /services                       # Create service (Seller)
PATCH  /services/:id                   # Update service (Seller/Owner)
DELETE /services/:id                   # Delete service (Seller/Owner)
GET    /services/seller/:sellerId      # Get services by seller
GET    /services/category/:categoryId  # Get services by category
```

**Database Schema:**

```sql
CREATE TABLE services (
  id UUID PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category_id UUID NULLABLE REFERENCES categories(id),
  photos TEXT[],
  short_description TEXT NOT NULL,
  price_from DECIMAL(10,2) NOT NULL,
  service_area VARCHAR(255) NOT NULL,
  latitude DECIMAL(10,8) NULLABLE,
  longitude DECIMAL(11,8) NULLABLE,
  status ENUM('active', 'inactive', 'deleted') DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULLABLE
);

CREATE TABLE service_availability (
  id UUID PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL, -- 0-6 (Sunday-Saturday)
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE service_social_links (
  id UUID PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- facebook, instagram, twitter, etc.
  url VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
```

### Bookings Module

**Status:** 🚧 Planned  
**Location:** `src/modules/bookings/`

**Features:**

- Booking creation by buyers
- Booking status tracking (PENDING → CONFIRMED → COMPLETED / REJECT)
- Location tracking (service address and arrival coordinates)
- OTP verification for job completion
- Arrival notifications (15min, 30min, 1hr, 2hr before booking)
- Job completion with worker notes and rating
- Photo upload (multiple photos per booking)
- Dashboard metrics (top cities, top services, ranked sellers)
- Booking availability checking

**Endpoints (Planned):**

```
GET    /bookings                       # List bookings (filtered by user role)
GET    /bookings/:id                   # Get booking by ID
POST   /bookings                       # Create booking (Buyer)
PATCH  /bookings/:id                   # Update booking
PATCH  /bookings/:id/status            # Update booking status
POST   /bookings/:id/arrive            # Mark seller arrival
POST   /bookings/:id/complete          # Complete job
GET    /bookings/available-hours       # Get available booking hours
GET    /bookings/top-cities            # Get top cities by bookings
GET    /bookings/top-services          # Get top services
GET    /bookings/ranked-sellers        # Get ranked sellers
GET    /bookings/dashboard/metrics     # Get dashboard metrics
GET    /bookings/dashboard/stats       # Get dashboard statistics
```

**Database Schema:**

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time VARCHAR(10) NOT NULL,
  end_time VARCHAR(10) NULLABLE,
  service_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  address_name VARCHAR(255) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  describe_problem TEXT NOT NULL,
  upload_photos TEXT[],
  estimated_budget DECIMAL(10,2) NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  arrival_latitude DECIMAL(10,8) NULLABLE,
  arrival_longitude DECIMAL(11,8) NULLABLE,
  arrival_15_notified BOOLEAN DEFAULT false,
  arrival_30_notified BOOLEAN DEFAULT false,
  arrival_1_notified BOOLEAN DEFAULT false,
  arrival_2_notified BOOLEAN DEFAULT false,
  complete_job BOOLEAN NULLABLE,
  payment_checked BOOLEAN NULLABLE,
  otp_code VARCHAR(10) NULLABLE,
  arrival_rating INTEGER NULLABLE,
  worker_notes TEXT NULLABLE,
  status ENUM('PENDING', 'CONFIRMED', 'REJECT', 'COMPLETED') DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULLABLE
);

CREATE TABLE booking_images (
  id UUID PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
```

**Background Jobs:**

- Send arrival notifications (15min, 30min, 1hr, 2hr before booking)
- Process booking status updates
- Generate booking reports

### Reviews Module

**Status:** 🚧 Planned  
**Location:** `src/modules/reviews/`

**Features:**

- Create reviews for completed bookings
- Reply to reviews (sellers)
- Feature reviews (admins)
- Rating system (numeric ratings)
- Review filtering and sorting

**Endpoints (Planned):**

```
GET    /reviews                        # List reviews
GET    /reviews/:id                    # Get review by ID
POST   /reviews                        # Create review (Buyer)
PATCH  /reviews/:id                    # Update review
POST   /reviews/:id/reply             # Reply to review (Seller)
POST   /reviews/:id/feature           # Feature review (Admin)
GET    /reviews/service/:serviceId    # Get reviews for a service
GET    /reviews/seller/:sellerId      # Get reviews for a seller
```

**Database Schema:**

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  reply TEXT NULLABLE,
  reply_date TIMESTAMPTZ NULLABLE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULLABLE
);
```

### Chat Module

**Status:** 🚧 Planned  
**Location:** `src/modules/chat/`

**Features:**

- Real-time messaging via WebSocket (Socket.io)
- Conversation management
- File sharing in chat
- Typing indicators
- Message history
- Room-based messaging

**Endpoints (Planned):**

```
GET    /chat/conversations             # Get user conversations
GET    /chat/conversations/:id         # Get conversation by ID
POST   /chat/conversations             # Create conversation
GET    /chat/conversations/:id/messages # Get messages in conversation
POST   /chat/messages                  # Send message (also via WebSocket)
```

**WebSocket Events (Planned):**

- `connected` - Connection confirmed
- `join_room` - Join a conversation room
- `leave_room` - Leave a conversation room
- `send_message` - Send a message
- `new_message` - Receive a new message
- `typing_start` - User started typing
- `typing_stop` - User stopped typing
- `user_typing` - Another user is typing

**Database Schema:**

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  participant1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  participant2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULLABLE,
  UNIQUE(participant1_id, participant2_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  file_url TEXT NULLABLE,
  file_type VARCHAR(50) NULLABLE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULLABLE
);
```

**Dependencies Required:**

- `socket.io` - WebSocket server
- `@nestjs/websockets` - WebSocket integration
- `@nestjs/platform-socket.io` - Socket.io adapter

### Customer Module

**Status:** 🚧 Planned  
**Location:** `src/modules/customer/`

**Features:**

- Customer profile management
- Customer booking history
- Customer-specific features

**Endpoints (Planned):**

```
GET    /customer/profile               # Get customer profile
GET    /customer/bookings              # Get customer bookings
```

### Support Module

**Status:** 🚧 Planned  
**Location:** `src/modules/support/`

**Features:**

- Support ticket creation
- Support request management
- Status tracking (Open, In Progress, Resolved, Closed)
- Admin response to support tickets

**Endpoints (Planned):**

```
GET    /support                        # Get support requests
POST   /support                        # Create support request
GET    /support/:id                    # Get support request by ID
PATCH  /support/:id                    # Update support request
```

**Database Schema:**

```sql
CREATE TABLE support_requests (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') DEFAULT 'OPEN',
  admin_response TEXT NULLABLE,
  admin_id UUID NULLABLE REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULLABLE
);
```

### Disputes Module

**Status:** 🚧 Planned  
**Location:** `src/modules/disputes/`

**Features:**

- Create disputes for bookings
- Dispute status tracking
- Admin notes on disputes
- Dispute resolution by admins

**Endpoints (Planned):**

```
GET    /disputes                       # List disputes
POST   /disputes                       # Create dispute
GET    /disputes/:id                   # Get dispute by ID
PATCH  /disputes/:id/status           # Update dispute status
POST   /disputes/:id/notes            # Add note to dispute
POST   /disputes/:id/resolve          # Resolve dispute (Admin)
```

**Database Schema:**

```sql
CREATE TABLE disputes (
  id UUID PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status ENUM('PENDING', 'IN_REVIEW', 'RESOLVED', 'CLOSED') DEFAULT 'PENDING',
  admin_notes TEXT NULLABLE,
  resolved_at TIMESTAMPTZ NULLABLE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULLABLE
);
```

### Strike Module

**Status:** 🚧 Planned  
**Location:** `src/modules/strike/`

**Features:**

- Strike management for policy violations
- Violation tracking
- Strike consequences based on strike count

**Endpoints (Planned):**

```
GET    /strikes                        # List strikes
POST   /strikes                        # Create strike (Admin)
GET    /strikes/user/:userId           # Get strikes for a user
```

**Database Schema:**

```sql
CREATE TABLE strikes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  admin_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
```

### Addresses Module

**Status:** 🚧 Planned  
**Location:** `src/modules/addresses/`

**Features:**

- Save multiple addresses per user
- Address details (city, country, postal code)
- Default address setting
- Address selection for bookings

**Endpoints (Planned):**

```
GET    /addresses                      # Get user addresses
POST   /addresses                      # Create address
GET    /addresses/:id                   # Get address by ID
PATCH  /addresses/:id                 # Update address
DELETE /addresses/:id                  # Delete address
```

**Database Schema:**

```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  address_name VARCHAR(255) NOT NULL,
  full_address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NULLABLE,
  country VARCHAR(100) NOT NULL,
  postal_code VARCHAR(20) NOT NULL,
  latitude DECIMAL(10,8) NULLABLE,
  longitude DECIMAL(11,8) NULLABLE,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULLABLE
);
```

### Boost Management Module

**Status:** 🚧 Planned  
**Location:** `src/modules/boost-management/`

**Features:**

- Boost service visibility
- Track active boosts
- Boost expiration management

**Endpoints (Planned):**

```
GET    /boost-management               # Get boost management records
POST   /boost-management               # Create boost
GET    /boost-management/:id          # Get boost by ID
PATCH  /boost-management/:id          # Update boost
```

**Database Schema:**

```sql
CREATE TABLE boost_management (
  id UUID PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  boost_plan_id UUID NOT NULL REFERENCES boost_plans(id),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULLABLE
);
```

### Boost Plans Module

**Status:** 🚧 Planned  
**Location:** `src/modules/boost-plans/`

**Features:**

- Boost plan creation and management
- Different boost tiers and durations
- Pricing for boost plans

**Endpoints (Planned):**

```
GET    /boost-plans                    # List boost plans
POST   /boost-plans                    # Create boost plan (Admin)
GET    /boost-plans/:id                # Get boost plan by ID
PATCH  /boost-plans/:id                # Update boost plan (Admin)
DELETE /boost-plans/:id                # Delete boost plan (Admin)
```

**Database Schema:**

```sql
CREATE TABLE boost_plans (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NULLABLE,
  duration_days INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULLABLE
);
```

### Boost Subscriptions Module

**Status:** 🚧 Planned  
**Location:** `src/modules/boost-subscriptions/`

**Features:**

- Active boost subscriptions tracking
- Subscription management

**Database Schema:**

```sql
CREATE TABLE boost_subscriptions (
  id UUID PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  boost_plan_id UUID NOT NULL REFERENCES boost_plans(id),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
```

### Boost Audit Log Module

**Status:** 🚧 Planned  
**Location:** `src/modules/boost-audit-log/`

**Features:**

- History of boost actions
- Audit trail for boost management

**Database Schema:**

```sql
CREATE TABLE boost_audit_log (
  id UUID PRIMARY KEY,
  boost_id UUID NOT NULL REFERENCES boost_management(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  performed_by UUID NOT NULL REFERENCES users(id),
  details JSONB NULLABLE,
  created_at TIMESTAMPTZ NOT NULL
);
```

### Performance Analytics Module

**Status:** 🚧 Planned  
**Location:** `src/modules/performance-analytics/`

**Features:**

- Seller reliability metrics
- Performance indicators
- Analytics dashboard data

**Endpoints (Planned):**

```
GET    /performance-analytics          # Get performance analytics
GET    /performance-analytics/seller/:sellerId  # Get seller performance
POST   /performance-analytics/seller-reliability # Create reliability record
```

**Database Schema:**

```sql
CREATE TABLE performance_analytics (
  id UUID PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reliability_score DECIMAL(5,2) NOT NULL,
  total_bookings INTEGER DEFAULT 0,
  completed_bookings INTEGER DEFAULT 0,
  cancelled_bookings INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) NULLABLE,
  total_reviews INTEGER DEFAULT 0,
  response_time_minutes INTEGER NULLABLE,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
```

### Message Safety Module

**Status:** 🚧 Planned  
**Location:** `src/modules/message-safety/`

**Features:**

- Message monitoring
- Violation detection
- Action management on violations

**Database Schema:**

```sql
CREATE TABLE message_safety (
  id UUID PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  violation_type VARCHAR(50) NOT NULL,
  detected_at TIMESTAMPTZ NOT NULL,
  action_taken VARCHAR(50) NULLABLE,
  admin_id UUID NULLABLE REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL
);
```

### Audit Log Module

**Status:** 🚧 Planned  
**Location:** `src/modules/audit-log/`

**Features:**

- Track all admin actions
- User activity logging
- Change history tracking

**Endpoints (Planned):**

```
GET    /audit-log                      # Get audit logs
GET    /audit-log/:id                  # Get audit log by ID
```

**Database Schema:**

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NULLABLE,
  details JSONB NULLABLE,
  ip_address VARCHAR(64) NULLABLE,
  user_agent TEXT NULLABLE,
  created_at TIMESTAMPTZ NOT NULL
);
```

### Recent Activity Module

**Status:** 🚧 Planned  
**Location:** `src/modules/recent-activity/`

**Features:**

- Track recent user activities
- Activity feed

**Endpoints (Planned):**

```
GET    /recent-activity                # Get recent activities
GET    /recent-activity/user/:userId   # Get user activities
```

### Cities and Map Module

**Status:** 🚧 Planned  
**Location:** `src/modules/cities-and-map/`

**Features:**

- City management
- Map integration
- Geographic data management

**Endpoints (Planned):**

```
GET    /cities                         # List cities
POST   /cities                         # Create city (Admin)
GET    /cities/:id                     # Get city by ID
PATCH  /cities/:id                     # Update city (Admin)
DELETE /cities/:id                     # Delete city (Admin)
```

**Database Schema:**

```sql
CREATE TABLE cities (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100) NULLABLE,
  latitude DECIMAL(10,8) NULLABLE,
  longitude DECIMAL(11,8) NULLABLE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL,
  deleted_at TIMESTAMPTZ NULLABLE
);
```

### System Settings Module

**Status:** 🚧 Planned  
**Location:** `src/modules/system-setting/`

**Features:**

- Platform-wide configuration
- Setting categories
- Audit logging for setting changes

**Endpoints (Planned):**

```
GET    /system-settings                # Get system settings
POST   /system-settings                # Create setting (Admin)
GET    /system-settings/:id            # Get setting by ID
PATCH  /system-settings/:id            # Update setting (Admin)
```

**Database Schema:**

```sql
CREATE TABLE system_settings (
  id UUID PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NULLABLE,
  updated_by UUID NULLABLE REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
```

---

## Configuration

### Config Module

**Location:** `src/config/`

The config module loads all configuration files:

- `app.config.ts` - Application settings (port, CORS, environment)
- `database.config.ts` - PostgreSQL configuration
- `jwt.config.ts` - JWT secrets and expiry
- `bullmq.config.ts` - Redis and BullMQ configuration
- `cloudinary.config.ts` - Cloudinary credentials
- `sendgrid.config.ts` - SendGrid configuration
- `twilio.config.ts` - Twilio configuration
- `google.config.ts` - Google OAuth configuration

### Environment Validation

**Location:** `src/config/env.validation.ts`

Uses Joi to validate all environment variables on application startup. Missing or invalid variables will cause the application to fail to start.

### Global Configuration

**Location:** `src/main.ts`

- Global API prefix: `/api`
- Helmet security headers
- CORS configuration
- Global validation pipe
- Global exception filter
- Global interceptors (Response, Logging)
- Swagger documentation setup

---

## Environment Variables

### Multi-Environment Setup

| File               | Purpose                     | Git Status |
| ------------------ | --------------------------- | ---------- |
| `.env.example`     | Template with all variables | Committed  |
| `.env.development` | Development configuration   | Ignored    |
| `.env.staging`     | Staging configuration       | Ignored    |
| `.env.production`  | Production configuration    | Ignored    |
| `.env`             | Local overrides             | Ignored    |

### Loading Priority

1. `.env.{NODE_ENV}` - Environment-specific (development/staging/production)
2. `.env` - Local overrides (highest priority for secrets)
3. System environment variables - Highest priority

### Required Environment Variables

#### Application

```env
NODE_ENV=development|staging|production
PORT=3000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### Database (PostgreSQL)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=fixtree
DB_SYNCHRONIZE=false
DB_LOGGING=true
```

#### JWT

```env
JWT_SECRET=your-access-token-secret-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-token-secret-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d
```

#### Redis (BullMQ)

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

#### Cloudinary

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### SendGrid

```env
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@fixtree.com
SENDGRID_FROM_NAME=Fixtree
```

#### Twilio

```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_VERIFY_SERVICE_SID=your-verify-service-sid
```

#### Google OAuth

```env
GOOGLE_CLIENT_ID=your-google-client-id
```

#### Super Admin (Seeder)

```env
SUPER_ADMIN_EMAIL=superadmin@fixtree.com
SUPER_ADMIN_PASSWORD=SuperAdmin@123
```

---

## Getting Started

### Prerequisites

- Node.js >= 20.x
- PostgreSQL >= 16.x
- Redis >= 7.x
- npm or yarn

### Installation Steps

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd fixtree-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up PostgreSQL database:**

   ```sql
   CREATE DATABASE fixtree;
   ```

5. **Set up Redis:**

   ```bash
   # Start Redis server
   redis-server
   ```

6. **Run migrations:**

   ```bash
   npm run migration:run
   ```

7. **Seed database (optional):**

   ```bash
   npm run seed
   ```

8. **Start the development server:**

   ```bash
   npm run start:dev
   ```

9. **Access Swagger documentation:**
   ```
   http://localhost:3000/api/docs
   ```

### Available Scripts

```bash
# Development
npm run start           # Start production server
npm run start:dev       # Start development server (watch mode)
npm run start:debug     # Start with debugger
npm run build           # Build for production

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier

# Testing
npm run test            # Run unit tests
npm run test:watch      # Run tests in watch mode
npm run test:cov        # Run tests with coverage
npm run test:e2e        # Run e2e tests

# Database
npm run migration:generate  # Generate migration
npm run migration:run      # Run migrations
npm run migration:revert   # Revert last migration
npm run seed            # Run database seeder
```

---

## Development Guide

### Creating a New Module

1. **Generate module files:**

   ```bash
   nest g module modules/feature-name
   nest g controller modules/feature-name
   nest g service modules/feature-name
   ```

2. **Create entity:**

   ```typescript
   // entities/feature.entity.ts
   import { Entity, Column } from 'typeorm';
   import { BaseEntity } from '../../../database/entities/base.entity';

   @Entity('features')
   export class Feature extends BaseEntity {
     @Column()
     name: string;
   }
   ```

3. **Create DTOs:**

   ```typescript
   // dto/create-feature.dto.ts
   import { IsString, IsNotEmpty } from 'class-validator';
   import { ApiProperty } from '@nestjs/swagger';

   export class CreateFeatureDto {
     @ApiProperty()
     @IsString()
     @IsNotEmpty()
     name: string;
   }
   ```

4. **Register in app.module.ts:**
   ```typescript
   imports: [
     // ... other modules
     FeatureModule,
   ];
   ```

### Adding Authentication to Endpoints

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('feature')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeatureController {
  @Get()
  @Public() // Skip authentication
  findAll() {
    // Public endpoint
  }

  @Post()
  @Roles(Role.BUYER, Role.SELLER) // Require specific roles
  create() {
    // Protected endpoint
  }
}
```

### File Upload Handling

```typescript
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { imageUploadConfig } from '../../shared/upload/upload.config';

@Post('upload')
@UseInterceptors(FileInterceptor('file', imageUploadConfig))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  // Handle single file
  // file.buffer, file.mimetype, file.originalname
}
```

### Error Handling

The application uses a global exception filter:

```typescript
// Automatically catches and formats errors
throw new NotFoundException('Resource not found');
throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Unauthorized');
throw new ForbiddenException('Access denied');
```

### Database Queries

Using TypeORM repositories:

```typescript
// In service
constructor(
  @InjectRepository(Entity)
  private readonly repository: Repository<Entity>,
) {}

async findAll(): Promise<Entity[]> {
  return this.repository.find({
    relations: ['relatedEntity'],
    where: { status: 'active' },
  });
}
```

### Background Jobs

Adding a background job:

```typescript
// In service
constructor(
  @InjectQueue(QUEUES.NOTIFICATIONS)
  private readonly notificationQueue: Queue,
) {}

async sendNotification(data: any) {
  await this.notificationQueue.add('notification-job', data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
}

// In processor
@Processor(QUEUES.NOTIFICATIONS)
export class NotificationsProcessor extends WorkerHost {
  @Process('notification-job')
  async handleNotification(job: Job) {
    // Process job
  }
}
```

### Cron Jobs

Adding a scheduled cron job:

```typescript
// In cron.service.ts
async onModuleInit() {
  await this.cronQueue.add(
    CRON_JOBS.CLEANUP_EXPIRED_SESSIONS,
    {},
    {
      repeat: { pattern: '0 0 * * *' }, // Daily at midnight
      removeOnComplete: true,
    },
  );
}

// In cron.processor.ts
async process(job: Job): Promise<void> {
  switch (job.name) {
    case CRON_JOBS.CLEANUP_EXPIRED_SESSIONS:
      await this.handleCleanupExpiredSessions();
      break;
  }
}
```

---

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Test Coverage

```bash
npm run test:cov
```

### Writing Tests

```typescript
describe('FeatureService', () => {
  let service: FeatureService;
  let repository: Repository<Feature>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FeatureService,
        {
          provide: getRepositoryToken(Feature),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FeatureService>(FeatureService);
    repository = module.get<Repository<Feature>>(getRepositoryToken(Feature));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

---

## Deployment

### Production Build

```bash
npm run build
npm run start:prod
```

### Environment Setup

1. Set production environment variables
2. Ensure PostgreSQL and Redis are running
3. Run migrations
4. Seed database (if needed)
5. Start the application

### Monitoring

- Health check endpoint: `GET /health`
- Logs: Check application logs for errors
- Database: Monitor PostgreSQL connections
- Redis: Monitor Redis connection status

### Docker Deployment

```bash
# Build image
docker build -t fixtree-backend .

# Run container
docker run -p 3000:3000 --env-file .env.production fixtree-backend
```

---

## Code Examples

### Example: User Registration

```typescript
// Controller
@Post('register')
@Public()
@UseInterceptors(FileInterceptor('profileImage', imageUploadConfig))
async register(
  @Body() registerDto: RegisterDto,
  @UploadedFile() file?: Express.Multer.File,
): Promise<RegisterResponseDto> {
  return this.authService.register(registerDto, file);
}

// Service
async register(
  dto: RegisterDto,
  file?: Express.Multer.File,
): Promise<RegisterResponseDto> {
  // Check if user exists
  const existingUser = await this.usersRepository.findByEmail(dto.email);
  if (existingUser) {
    throw new ConflictException('User already exists');
  }

  // Hash password
  const hashedPassword = await this.utilService.hashPassword(dto.password);

  // Upload profile image if provided
  let profileImageUrl: string | null = null;
  if (file) {
    const uploadResult = await this.cloudinaryService.upload(file);
    profileImageUrl = uploadResult.secure_url;
  }

  // Create user
  const user = await this.usersRepository.create({
    ...dto,
    password: hashedPassword,
    profileImage: profileImageUrl,
  });

  // Send verification email
  await this.notificationsService.sendEmailVerification(user);

  return {
    user: this.mapUserToResponse(user),
    message: 'Registration successful. Please verify your email.',
  };
}
```

### Example: JWT Strategy

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersRepository.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return user;
  }
}
```

### Example: Repository Pattern

```typescript
@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async create(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
```

---

## Best Practices

### Naming Conventions

- **Files**: kebab-case (`user-profile.service.ts`)
- **Classes**: PascalCase (`UserProfileService`)
- **Methods**: camelCase (`getUserProfile`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Enums**: PascalCase (`UserRole`)

### Code Organization

1. **One feature per module**
2. **Separate concerns**: Controller → Service → Repository
3. **Use DTOs for validation**
4. **Keep services focused on business logic**
5. **Use repositories for database operations**

### Error Handling

- Use appropriate HTTP exceptions
- Provide meaningful error messages
- Log errors for debugging
- Don't expose sensitive information

### Security Best Practices

1. **Always validate input** using DTOs
2. **Use parameterized queries** (TypeORM handles this)
3. **Hash passwords** (bcrypt)
4. **Protect sensitive endpoints** with guards
5. **Validate JWT tokens** on every request
6. **Sanitize file uploads**
7. **Use HTTPS in production**
8. **Set secure CORS origins**

### Performance Optimization

1. **Use database indexes** on frequently queried fields
2. **Implement pagination** for list endpoints
3. **Cache frequently accessed data** (Redis)
4. **Use background jobs** for heavy operations
5. **Optimize database queries** (avoid N+1 problems)
6. **Use connection pooling** (TypeORM handles this)

### Git Workflow

**Branching Strategy:**

```
main        → Production (auto-deploys to production server)
develop     → Staging (auto-deploys to staging server)
feature/*   → New features (PR to develop)
hotfix/*    → Urgent fixes (PR to main)
bugfix/*    → Bug fixes (PR to develop)
```

**Commit Message Format:**
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <subject>

Types:
- feat:     New feature
- fix:      Bug fix
- docs:     Documentation changes
- style:    Code style changes
- refactor: Code refactoring
- perf:     Performance improvements
- test:     Adding or updating tests
- chore:    Maintenance tasks
- revert:   Reverting changes
- build:    Build system changes
- ci:       CI configuration changes
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Problem:** Cannot connect to PostgreSQL

**Solution:**

- Check PostgreSQL is running: `pg_isready`
- Verify connection credentials in `.env`
- Check firewall settings
- Ensure database exists

#### 2. Redis Connection Error

**Problem:** Redis connection failed

**Solution:**

- Check Redis is running: `redis-cli ping`
- Verify Redis host/port in `.env`
- Check Redis password if configured
- Application will continue without Redis (queues disabled)

#### 3. JWT Token Invalid

**Problem:** Authentication fails

**Solution:**

- Verify `JWT_SECRET` is set correctly
- Check token expiration
- Ensure token is sent in `Authorization` header
- Format: `Bearer <token>`

#### 4. File Upload Fails

**Problem:** Cloudinary upload errors

**Solution:**

- Verify Cloudinary credentials in `.env`
- Check file size limits
- Ensure file format is supported
- Check Cloudinary account limits

#### 5. Email Not Sending

**Problem:** SendGrid errors

**Solution:**

- Verify SendGrid API key in `.env`
- Check SendGrid account status
- Verify sender email is verified in SendGrid
- Check SendGrid logs

#### 6. SMS Not Sending

**Problem:** Twilio errors

**Solution:**

- Verify Twilio credentials in `.env`
- Check Twilio account balance
- Verify phone number format
- Check Twilio logs

### Debugging Tips

1. **Enable logging:**

   ```typescript
   private readonly logger = new Logger(ServiceName.name);
   this.logger.log('Debug message');
   ```

2. **Check Swagger docs:** `http://localhost:3000/api/docs`

3. **Database queries:** Enable TypeORM logging in development

4. **Redis monitoring:** Use `redis-cli monitor`

5. **Application logs:** Check console output

---

## Contributing

### Development Workflow

1. Create a feature branch from `develop`
2. Make changes and commit (conventional commits enforced)
3. Push and create PR to `develop`
4. After review and merge, auto-deploys to staging
5. After testing, merge `develop` to `main`
6. Auto-deploys to production

### Code Review Checklist

- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] No linting errors
- [ ] Documentation updated
- [ ] Environment variables documented
- [ ] Security considerations addressed

---

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## Support

For questions, issues, or contributions:

1. Check existing documentation
2. Review Swagger API docs
3. Check application logs
4. Contact the development team

---

## Implementation Roadmap

The implementation follows a **stage-based plan** defined in **`IMPLEMENTATION-STAGES.md`**. Each stage is a separate commit; complete one stage before moving to the next. The document below summarizes the progress overview; for full task lists, DTOs, workflows, and dependencies, see **IMPLEMENTATION-STAGES.md**.

### Progress Overview

| Stage | Description                                      | Status        |
| ----- | ------------------------------------------------ | ------------- |
| 1     | Project Setup & Configuration                    | ✅ Completed  |
| 2     | Common Utilities                                 | ✅ Completed  |
| 3     | Database Setup                                   | ✅ Completed  |
| 4     | Shared Services                                  | ✅ Completed  |
| 5     | Users Module                                     | ✅ Completed  |
| 6     | Auth Module (Basic)                              | ✅ Completed  |
| 7     | Sessions Module                                  | ✅ Completed  |
| 8     | Auth Module (Extended)                           | ✅ Completed  |
| 9     | Seller Module                                    | ✅ Completed  |
| 10    | Admin Modules                                    | ✅ Completed  |
| 11    | Queue & Cron Jobs                                | ✅ Completed  |
| 12    | Notifications Module                             | ✅ Completed  |
| 13    | Swagger Documentation                            | ✅ Completed  |
| 14    | Health Check Module                              | ✅ Completed  |
| 15    | Database Seeders                                 | ✅ Completed  |
| 16    | WebSocket Setup                                  | ⬜ Pending    |
| 17    | Admin Module (Super Admin: create & view admins) | ⬜ Pending    |
| 18    | Extend Seller Module                             | ⬜ Pending    |
| 19    | Categories Module                                | ⬜ Pending    |
| 20    | Services Module                                  | ⬜ Pending    |
| 21    | Booking Core Features                            | ⬜ Pending    |
| 22    | Booking Admin Endpoints                          | ⬜ Pending    |
| 23    | Booking Queues & Jobs                            | ⬜ Pending    |
| 24    | Reviews Module                                   | ⬜ Pending    |
| 25    | Chat Module                                      | ⬜ Pending    |
| 26    | Chat Multimedia Cleanup                          | ⬜ Pending    |
| 27    | Buyer Module                                     | ⬜ Pending    |
| 28    | Disputes Module                                  | ⬜ Pending    |
| 29    | Strike Module                                    | ⬜ Pending    |
| 30    | Audit Log Module                                 | ⬜ Pending    |
| 31    | Recent Activity Module                           | ⬜ Pending    |
| 32    | Recent Activity Cleanup                          | ⬜ Pending    |
| 33    | Cities Module                                    | ⬜ Pending    |
| 34    | Message Safety Module                            | ⬜ Pending    |
| 35    | Plans Module                                     | ⬜ Pending    |
| 36    | Plan Subscriptions Module                        | ⬜ Pending    |
| 37    | Boost Management Module                          | ⚠️ Incomplete |
| 38    | Boost Audit Log Module                           | ⚠️ Incomplete |
| 39    | Performance Analytics Module                     | ⬜ Pending    |
| 40    | Support Module                                   | ⬜ Pending    |
| 41    | System Settings Module                           | ⬜ Pending    |
| 42    | Docker Setup                                     | ⬜ Pending    |
| 43    | CI/CD Pipeline                                   | ⬜ Pending    |
| 44    | Final Integration & Testing                      | ⬜ Pending    |

**Legend:** ⬜ Pending | 🔄 In Progress | ✅ Completed | ⚠️ Incomplete (logic not yet finalized)

### Reference

- **Authoritative implementation plan:** `IMPLEMENTATION-STAGES.md`
- **Module organization (Hybrid Pattern, checklists):** Described in IMPLEMENTATION-STAGES.md and `MODULE-ORGANIZATION-GUIDE.md`

### Implementation Guidelines

When implementing planned stages:

1. **Follow the existing architecture patterns**
   - Use feature-based modules and the Hybrid Pattern where both public/seller and admin endpoints exist
   - Implement Repository pattern
   - Use DTOs for validation
   - Follow naming conventions from IMPLEMENTATION-STAGES.md

2. **Database Migrations**
   - Create migration files for new tables as specified per stage
   - Use TypeORM migrations
   - Test migrations in development

3. **API Documentation**
   - Add Swagger decorators
   - Document request/response DTOs as per each stage
   - Include examples

4. **Testing**
   - Write unit tests for services
   - Write integration tests for controllers
   - Test edge cases

5. **Background Jobs**
   - Use BullMQ for async operations (see Stage 11 and DOCS.md Queues section)
   - Implement processors for jobs
   - Handle job failures gracefully

6. **Real-time Features**
   - Use Socket.io for WebSocket (Stage 16)
   - Implement proper authentication
   - Handle connection errors

---

**Last Updated:** February 2026  
**Version:** 1.0.0  
**Maintained by:** Fixtree Development Team

**Note:** This documentation includes both implemented features (✅) and planned features (🚧) from the complete project vision. Refer to the implementation status indicators throughout the document to distinguish between current and future features.

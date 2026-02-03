# Fixtree Backend

A scalable, production-ready NestJS backend for the Fixtree physical service marketplace platform.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Folder Structure](#folder-structure)
- [User Roles](#user-roles)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Code Examples](#code-examples)
- [Conventions & Patterns](#conventions--patterns)
- [Future Enhancements](#future-enhancements)

> **For Implementation:** See [IMPLEMENTATION-STAGES.md](./IMPLEMENTATION-STAGES.md) for step-by-step implementation guide with checklists.

---

## Project Overview

**Fixtree** is a marketplace for on-site/physical services connecting buyers with local service providers (sellers).

### Key Features

- Multi-role authentication (Buyer, Seller, Admin, Super Admin)
- Google OAuth login (Web & Mobile)
- Multi-platform support (Web, iOS, Android)
- Session management with device tracking
- Logout from all devices
- Role-based access control
- Email & Phone verification
- Email notifications (SendGrid)
- SMS notifications (Twilio)
- Background job processing (BullMQ)
- Scheduled cron jobs
- Image uploads (Cloudinary)
- Soft delete support
- Request ID tracking
- Comprehensive logging

---

## Tech Stack

| Category             | Technology          | Version |
| -------------------- | ------------------- | ------- |
| **Framework**        | NestJS              | ^11.x   |
| **Language**         | TypeScript          | ^5.x    |
| **Database**         | PostgreSQL          | ^16.x   |
| **ORM**              | TypeORM             | ^0.3.x  |
| **Cache/Queue**      | Redis               | ^7.x    |
| **Job Queue**        | BullMQ              | ^5.x    |
| **Authentication**   | Passport + JWT      | ^0.7.x  |
| **Google OAuth**     | google-auth-library | ^9.x    |
| **Validation**       | class-validator     | ^0.14.x |
| **File Upload**      | Cloudinary          | ^2.x    |
| **Email**            | SendGrid            | ^8.x    |
| **SMS**              | Twilio              | ^5.x    |
| **API Docs**         | Swagger             | ^8.x    |
| **Logging**          | Winston             | ^3.x    |
| **Security**         | Helmet              | ^8.x    |
| **User Agent**       | Bowser              | ^2.x    |
| **Code Formatter**   | Prettier            | ^3.x    |
| **Linter**           | ESLint              | ^9.x    |
| **Git Hooks**        | Husky               | ^9.x    |
| **Staged Linting**   | lint-staged         | ^15.x   |
| **Commit Linting**   | commitlint          | ^19.x   |
| **Env Validation**   | Joi                 | ^17.x   |
| **Containerization** | Docker              | ^24.x   |
| **CI/CD**            | GitHub Actions      | -       |

---

## Architecture Overview

### Design Principles

1. **Modular Architecture** - Feature-based modules with clear separation
2. **Repository Pattern** - Abstracted database operations
3. **Admin/User Separation** - Separate controllers and services for admin vs user APIs
4. **Shared Core Logic** - Repositories shared between admin and user services
5. **Role-Based Access** - Guards at controller level, not in services
6. **Multi-Platform** - Single API supporting web and mobile apps

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│              (Web App / iOS App / Android App)                   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY (NestJS)                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Guards    │  │Interceptors │  │   Filters & Pipes       │  │
│  │ (JWT/Roles) │  │  (Logging)  │  │ (Validation/Exception)  │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
┌───────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   User APIs       │ │   Admin APIs    │ │  Shared APIs    │
│  /auth/*          │ │  /admin/auth/*  │ │  /health        │
│                   │ │  /admin/users/* │ │                 │
└─────────┬─────────┘ └────────┬────────┘ └────────┬────────┘
          │                    │                    │
          └────────────────────┼────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVICES LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ AuthService  │  │ UsersService │  │ SessionsService      │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      REPOSITORY LAYER                            │
│  ┌──────────────────┐  ┌──────────────────────────────────────┐ │
│  │ UsersRepository  │  │ SessionsRepository                   │ │
│  └──────────────────┘  └──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  PostgreSQL  │  │    Redis     │  │     Cloudinary       │   │
│  │  (TypeORM)   │  │   (BullMQ)   │  │   (File Storage)     │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

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

- **Controllers** = permissions & API exposure
- **Services** = business logic (separate for admin/user)
- **Repositories** = database operations (shared)

---

## Folder Structure

```
fixtree-backend/
├── .env                                # Local overrides (git ignored)
├── .env.example                        # Template with all variables (committed)
├── .env.development                    # Development config (git ignored)
├── .env.staging                        # Staging config (git ignored)
├── .env.production                     # Production config (git ignored)
├── .gitignore
├── .dockerignore                       # Docker ignore file
├── .github/                            # GitHub configurations
│   └── workflows/
│       ├── ci.yml                      # CI pipeline (lint, build, test)
│       ├── deploy-staging.yml          # Deploy to staging (develop branch)
│       └── deploy-production.yml       # Deploy to production (main branch)
├── .husky/                             # Git hooks
│   ├── pre-commit                      # Run lint-staged
│   └── commit-msg                      # Run commitlint
├── .lintstagedrc                       # lint-staged configuration
├── .commitlintrc                       # commitlint configuration
├── .prettierrc                         # Prettier configuration
├── Dockerfile                          # Production Docker image
├── Dockerfile.dev                      # Development Docker image
├── docker-compose.yml                  # Local development stack
├── docker-compose.prod.yml             # Production stack
├── eslint.config.mjs                   # ESLint flat config
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── README.md

└── src/
    ├── main.ts                         # Application entry point
    ├── app.module.ts                   # Root module
    │
    │── config/                         # Configuration
    │   ├── config.module.ts            # Config module (loads all configs)
    │   ├── env.validation.ts           # Joi schema for env validation
    │   ├── app.config.ts               # App settings (port, cors)
    │   ├── database.config.ts          # PostgreSQL settings
    │   ├── jwt.config.ts               # JWT secrets & expiry
    │   ├── bullmq.config.ts            # Redis & BullMQ settings
    │   ├── cloudinary.config.ts        # Cloudinary credentials
    │   ├── sendgrid.config.ts          # SendGrid settings
    │   ├── twilio.config.ts            # Twilio SMS settings
    │   └── google.config.ts            # Google OAuth settings
    │
    ├── common/                         # Shared utilities
    │   ├── constants/
    │   │   ├── app.constants.ts        # App-wide constants
    │   │   └── queue.constants.ts      # Queue & cron job names
    │   │
    │   ├── decorators/
    │   │   ├── roles.decorator.ts      # @Roles() decorator
    │   │   ├── current-user.decorator.ts # @CurrentUser() decorator
    │   │   └── public.decorator.ts     # @Public() skip auth
    │   │
    │   ├── dto/
    │   │   ├── pagination.dto.ts       # Pagination query params
    │   │   └── pagination-response.dto.ts # Paginated response
    │   │
    │   ├── enums/
    │   │   ├── role.enum.ts            # BUYER | SELLER | ADMIN | SUPER_ADMIN
    │   │   └── platform.enum.ts        # WEB | IOS | ANDROID
    │   │
    │   ├── guards/
    │   │   ├── jwt-auth.guard.ts       # JWT authentication
    │   │   └── roles.guard.ts          # Role-based authorization
    │   │
    │   ├── interceptors/
    │   │   ├── response.interceptor.ts # Standardize responses
    │   │   ├── logging.interceptor.ts  # Request/response logging
    │   │   └── audit-log.interceptor.ts # Admin action logging
    │   │
    │   ├── filters/
    │   │   └── http-exception.filter.ts # Global exception handler
    │   │
    │   ├── middleware/
    │   │   └── request-id.middleware.ts # Unique request ID
    │   │
    │   ├── pipes/
    │   │   └── validation.pipe.ts      # DTO validation
    │   │
    │   ├── types/
    │   │   ├── jwt-payload.type.ts     # JWT payload interface
    │   │   └── api-response.type.ts    # API response type
    │   │
    │   └── utils/
    │       ├── utils.module.ts
    │       └── utils.service.ts        # Hash, date, pagination helpers
    │
    ├── database/                       # Database configuration
    │   ├── typeorm.module.ts           # TypeORM module setup
    │   ├── typeorm.config.ts           # TypeORM configuration
    │   ├── entities/
    │   │   └── base.entity.ts          # Base entity (id, timestamps, soft delete)
    │   ├── migrations/
    │   │   └── (migration files)
    │   └── seeders/
    │       ├── seeder.module.ts
    │       ├── seeder.service.ts
    │       └── data/
    │           └── super-admin.seed.ts
    │
    ├── queues/                         # Background jobs
    │   ├── bullmq.module.ts            # BullMQ setup
    │   └── cron/
    │       ├── cron.module.ts
    │       ├── cron.service.ts         # Register scheduled jobs
    │       └── cron.processor.ts       # Process cron jobs
    │
    ├── shared/                         # Shared services
    │   ├── cloudinary/
    │   │   ├── cloudinary.module.ts
    │   │   └── cloudinary.service.ts
    │   │
    │   ├── sendgrid/
    │   │   ├── sendgrid.module.ts
    │   │   └── sendgrid.service.ts
    │   │
    │   ├── twilio/
    │   │   ├── twilio.module.ts
    │   │   └── twilio.service.ts       # SMS & Phone verification
    │   │
    │   ├── upload/
    │   │   ├── upload.module.ts
    │   │   ├── upload.service.ts
    │   │   └── upload.config.ts
    │   │
    │   └── logger/
    │       ├── logger.module.ts
    │       └── logger.service.ts
    │
    └── modules/                        # Feature modules
        ├── auth/
        │   ├── auth.module.ts
        │   ├── auth.controller.ts
        │   ├── auth.service.ts
        │   ├── strategies/
        │   │   ├── jwt.strategy.ts
        │   │   └── jwt-refresh.strategy.ts
        │   ├── sessions/
        │   │   ├── sessions.module.ts
        │   │   ├── sessions.service.ts
        │   │   ├── sessions.repository.ts
        │   │   ├── device-parser.service.ts
        │   │   ├── entities/
        │   │   │   └── session.entity.ts
        │   │   └── dto/
        │   │       └── session-response.dto.ts
        │   └── dto/
        │       ├── login.dto.ts
        │       ├── register.dto.ts
        │       ├── change-password.dto.ts
        │       ├── forgot-password.dto.ts
        │       ├── reset-password.dto.ts
        │       ├── refresh-token.dto.ts
        │       ├── device-info.dto.ts
        │       └── update-profile.dto.ts
        │
        ├── users/
        │   ├── users.module.ts
        │   ├── users.service.ts
        │   ├── users.repository.ts
        │   ├── entities/
        │   │   └── user.entity.ts
        │   └── dto/
        │       └── create-user.dto.ts
        │
        ├── notifications/
        │   ├── notifications.module.ts
        │   ├── notifications.service.ts
        │   └── notifications.processor.ts
        │
        ├── health/
        │   ├── health.module.ts
        │   └── health.controller.ts
        │
        └── admin/
            ├── admin.module.ts
            ├── auth/
            │   ├── admin-auth.module.ts
            │   ├── admin-auth.controller.ts
            │   └── admin-auth.service.ts
            └── users/
                ├── admin-users.module.ts
                ├── admin-users.controller.ts
                └── admin-users.service.ts
```

---

## User Roles

| Role            | Description      | Registration            | Permissions                      |
| --------------- | ---------------- | ----------------------- | -------------------------------- |
| **BUYER**       | Service consumer | Public `/auth/register` | Browse, book, review services    |
| **SELLER**      | Service provider | Public `/auth/register` | Create services, manage bookings |
| **ADMIN**       | Platform manager | Created by Super Admin  | Manage users, moderate content   |
| **SUPER_ADMIN** | System owner     | Database seeder         | Full access, create admins       |

---

## API Endpoints

### Health Check

```
GET    /health                          # System health status
```

### Auth Flow (Strict Verification)

- Users must **verify email or phone** before login is allowed.
- Registration sends a verification link/OTP.
- Login is blocked until `isEmailVerified` or `isPhoneVerified` is true.

### Auth - User (Buyer/Seller)

```
POST   /auth/register                   # Register new user
POST   /auth/login                      # Login (requires email/phone verification)
POST   /auth/google                     # Google OAuth login
POST   /auth/refresh-token              # Refresh access token
POST   /auth/logout                     # Logout current device
POST   /auth/change-password            # Change password
POST   /auth/forgot-password            # Request password reset
POST   /auth/reset-password             # Reset with token
POST   /auth/verify-email               # Verify email address
POST   /auth/send-phone-verification   # Send phone verification OTP
POST   /auth/verify-phone              # Verify phone OTP

GET    /auth/profile                    # Get current user profile
PATCH  /auth/profile                    # Update profile
DELETE /auth/profile                    # Delete account

GET    /auth/sessions                   # List all sessions
DELETE /auth/sessions/:id               # Logout specific device
DELETE /auth/sessions                   # Logout all devices
DELETE /auth/sessions/others            # Logout other devices
```

### Auth - Admin (Admin/Super Admin)

```
POST   /admin/auth/login                # Admin login
POST   /admin/auth/refresh-token        # Refresh token
POST   /admin/auth/logout               # Logout
POST   /admin/auth/change-password      # Change password
POST   /admin/auth/forgot-password      # Forgot password
POST   /admin/auth/reset-password       # Reset password

GET    /admin/auth/profile              # Get admin profile
PATCH  /admin/auth/profile              # Update profile

GET    /admin/auth/sessions             # List sessions
DELETE /admin/auth/sessions/:id         # Logout device
DELETE /admin/auth/sessions             # Logout all
DELETE /admin/auth/sessions/others      # Logout others
```

### Admin - User Management

```
GET    /admin/users                     # List all users
POST   /admin/users                     # Create user (Super Admin)
GET    /admin/users/:id                 # Get user details
PATCH  /admin/users/:id                 # Update user
DELETE /admin/users/:id                 # Delete user
POST   /admin/users/:id/ban             # Ban user
POST   /admin/users/:id/unban           # Unban user
```

### API Documentation

```
GET    /docs                            # Swagger UI
```

---

## Environment Variables

### Multi-Environment Setup

| File               | Purpose                     | Git       |
| ------------------ | --------------------------- | --------- |
| `.env.example`     | Template with all variables | Committed |
| `.env.development` | Development configuration   | Ignored   |
| `.env.staging`     | Staging configuration       | Ignored   |
| `.env.production`  | Production configuration    | Ignored   |
| `.env`             | Local overrides             | Ignored   |

### Loading Priority

```
1. .env.{NODE_ENV}    # Environment-specific (development/staging/production)
2. .env               # Local overrides (highest priority for secrets)
3. System env vars    # Highest priority
```

### .env.example (Template)

```env
# ============================================
# APP
# ============================================
NODE_ENV=development
PORT=3000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# ============================================
# DATABASE (PostgreSQL)
# ============================================
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=fixtree
DB_SYNCHRONIZE=false
DB_LOGGING=true

# ============================================
# JWT
# ============================================
JWT_SECRET=your-access-token-secret-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-refresh-token-secret-min-32-chars
JWT_REFRESH_EXPIRES_IN=7d

# ============================================
# REDIS (BullMQ)
# ============================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# ============================================
# CLOUDINARY
# ============================================
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ============================================
# SENDGRID
# ============================================
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@fixtree.com
SENDGRID_FROM_NAME=Fixtree

# ============================================
# TWILIO
# ============================================
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_VERIFY_SERVICE_SID=your-verify-service-sid

# ============================================
# GOOGLE OAUTH
# ============================================
GOOGLE_CLIENT_ID=your-google-client-id

# ============================================
# SUPER ADMIN (Seeder)
# ============================================
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

### Installation

#### Option 1: Using Docker (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd fixtree-backend

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Start all services (app, postgres, redis)
docker-compose up -d

# Run migrations
docker-compose exec app npm run migration:run

# Seed database
docker-compose exec app npm run seed

# View logs
docker-compose logs -f app
```

#### Option 2: Local Development

```bash
# Clone repository
git clone <repository-url>
cd fixtree-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Make sure PostgreSQL and Redis are running locally

# Run migrations
npm run migration:run

# Seed database
npm run seed

# Start development server
npm run start:dev
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
npm run lint:fix        # Run ESLint with auto-fix
npm run format          # Format code with Prettier
npm run format:check    # Check formatting without changes

# Testing
npm run test            # Run tests
npm run test:e2e        # Run e2e tests

# Database
npm run migration:generate  # Generate migration
npm run migration:run       # Run migrations
npm run migration:revert    # Revert last migration
npm run seed            # Run database seeder

# Docker
docker-compose up -d              # Start development stack
docker-compose down               # Stop all services
docker-compose logs -f app        # View app logs
docker-compose exec app sh        # Shell into container
docker-compose -f docker-compose.prod.yml up -d --build  # Production build

# Git Hooks (automatic)
# pre-commit: runs lint-staged (format + lint)
# commit-msg: validates commit message format
```

---

## Code Examples

### Example: Entity with Soft Delete

```typescript
// src/modules/users/entities/user.entity.ts
import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Role } from '../../../common/enums/role.enum';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  emailVerificationToken: string;

  @Column({ nullable: true })
  passwordResetToken: string;

  @Column({ nullable: true })
  passwordResetExpires: Date;
}
```

### Example: Repository

```typescript
// src/modules/users/users.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

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

### Example: Service

```typescript
// src/modules/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    await this.findById(id); // Ensure exists
    return this.usersRepository.update(id, data);
  }

  async softDelete(id: string): Promise<void> {
    await this.findById(id); // Ensure exists
    await this.usersRepository.softDelete(id);
  }
}
```

### Example: Controller with Guards

```typescript
// src/modules/auth/auth.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register new user (Buyer/Seller)' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @Roles(Role.BUYER, Role.SELLER)
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() user) {
    return this.authService.getProfile(user.id);
  }

  @Patch('profile')
  @ApiBearerAuth()
  @Roles(Role.BUYER, Role.SELLER)
  @ApiOperation({ summary: 'Update profile' })
  async updateProfile(@CurrentUser() user, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(user.id, dto);
  }

  @Delete('profile')
  @ApiBearerAuth()
  @Roles(Role.BUYER, Role.SELLER)
  @ApiOperation({ summary: 'Delete account' })
  async deleteAccount(@CurrentUser() user) {
    return this.authService.deleteAccount(user.id);
  }
}
```

### Example: DTO with Validation

```typescript
// src/modules/auth/dto/register.dto.ts
import {
  IsEmail,
  IsString,
  IsEnum,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/enums/role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain uppercase, lowercase, number and special character',
  })
  password: string;

  @ApiProperty({ enum: [Role.BUYER, Role.SELLER], example: Role.BUYER })
  @IsEnum([Role.BUYER, Role.SELLER])
  role: Role.BUYER | Role.SELLER;
}
```

### Example: Cron Job

```typescript
// src/queues/cron/cron.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES, CRON_JOBS } from '../../common/constants/queue.constants';

@Injectable()
export class CronService implements OnModuleInit {
  constructor(
    @InjectQueue(QUEUES.CRON)
    private readonly cronQueue: Queue,
  ) {}

  async onModuleInit() {
    // Cleanup expired sessions - Daily at midnight
    await this.cronQueue.add(
      CRON_JOBS.CLEANUP_EXPIRED_SESSIONS,
      {},
      {
        repeat: { pattern: '0 0 * * *' },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    // Example: Send daily reports - Every day at 9 AM
    await this.cronQueue.add(
      CRON_JOBS.DAILY_REPORT,
      {},
      {
        repeat: { pattern: '0 9 * * *' },
        removeOnComplete: true,
      },
    );
  }
}

// src/queues/cron/cron.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUES, CRON_JOBS } from '../../common/constants/queue.constants';
import { SessionsService } from '../../modules/auth/sessions/sessions.service';
import { LoggerService } from '../../shared/logger/logger.service';

@Processor(QUEUES.CRON)
export class CronProcessor extends WorkerHost {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case CRON_JOBS.CLEANUP_EXPIRED_SESSIONS:
        await this.handleCleanupExpiredSessions();
        break;
      case CRON_JOBS.DAILY_REPORT:
        await this.handleDailyReport();
        break;
      default:
        this.logger.warn(`Unknown cron job: ${job.name}`);
    }
  }

  private async handleCleanupExpiredSessions(): Promise<void> {
    this.logger.log('Running: Cleanup expired sessions');
    const count = await this.sessionsService.cleanupExpiredSessions();
    this.logger.log(`Cleaned up ${count} expired sessions`);
  }

  private async handleDailyReport(): Promise<void> {
    this.logger.log('Running: Daily report');
    // Implement daily report logic
  }
}
```

### Example: SendGrid Service

```typescript
// src/shared/sendgrid/sendgrid.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

interface SendEmailOptions {
  to: string;
  subject: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
  html?: string;
  text?: string;
}

@Injectable()
export class SendGridService {
  constructor(private readonly configService: ConfigService) {
    sgMail.setApiKey(this.configService.get<string>('sendgrid.apiKey'));
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    const msg = {
      to: options.to,
      from: {
        email: this.configService.get<string>('sendgrid.fromEmail'),
        name: this.configService.get<string>('sendgrid.fromName'),
      },
      subject: options.subject,
      ...(options.templateId && {
        templateId: options.templateId,
        dynamicTemplateData: options.dynamicTemplateData,
      }),
      ...(options.html && { html: options.html }),
      ...(options.text && { text: options.text }),
    };

    await sgMail.send(msg);
  }

  async sendBulkEmails(
    recipients: string[],
    options: Omit<SendEmailOptions, 'to'>,
  ): Promise<void> {
    const messages = recipients.map((to) => ({
      to,
      from: {
        email: this.configService.get<string>('sendgrid.fromEmail'),
        name: this.configService.get<string>('sendgrid.fromName'),
      },
      subject: options.subject,
      ...(options.templateId && {
        templateId: options.templateId,
        dynamicTemplateData: options.dynamicTemplateData,
      }),
    }));

    await sgMail.send(messages);
  }
}
```

### Example: Twilio Service

```typescript
// src/shared/twilio/twilio.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private client: Twilio;
  private verifyServiceSid: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new Twilio(
      this.configService.get<string>('twilio.accountSid'),
      this.configService.get<string>('twilio.authToken'),
    );
    this.verifyServiceSid = this.configService.get<string>(
      'twilio.verifyServiceSid',
    );
  }

  // Send SMS
  async sendSms(to: string, message: string): Promise<void> {
    await this.client.messages.create({
      to,
      from: this.configService.get<string>('twilio.phoneNumber'),
      body: message,
    });
  }

  // Send phone verification OTP (using Twilio Verify API)
  async sendPhoneVerification(phoneNumber: string): Promise<void> {
    await this.client.verify.v2
      .services(this.verifyServiceSid)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
      });
  }

  // Verify phone OTP
  async verifyPhoneCode(phoneNumber: string, code: string): Promise<boolean> {
    const verification = await this.client.verify.v2
      .services(this.verifyServiceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code,
      });

    return verification.status === 'approved';
  }

  // Send bulk SMS (via queue recommended)
  async sendBulkSms(
    recipients: { to: string; message: string }[],
  ): Promise<void> {
    await Promise.all(recipients.map((r) => this.sendSms(r.to, r.message)));
  }
}
```

### Example: Notification Service

```typescript
// src/modules/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { QUEUES } from '../../common/constants/queue.constants';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectQueue(QUEUES.NOTIFICATIONS)
    private readonly notificationQueue: Queue,
  ) {}

  // Email notifications
  async sendWelcomeEmail(userId: string, email: string, name: string) {
    await this.notificationQueue.add('welcome-email', {
      userId,
      email,
      name,
      channel: 'email',
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string) {
    await this.notificationQueue.add('password-reset-email', {
      email,
      resetToken,
      channel: 'email',
    });
  }

  async sendEmailVerification(email: string, verificationToken: string) {
    await this.notificationQueue.add('email-verification', {
      email,
      verificationToken,
      channel: 'email',
    });
  }

  // SMS notifications
  async sendWelcomeSms(phoneNumber: string, name: string) {
    await this.notificationQueue.add('welcome-sms', {
      phoneNumber,
      name,
      channel: 'sms',
    });
  }

  async sendBookingConfirmationSms(phoneNumber: string, bookingDetails: any) {
    await this.notificationQueue.add('booking-confirmation-sms', {
      phoneNumber,
      bookingDetails,
      channel: 'sms',
    });
  }

  async sendBookingReminderSms(phoneNumber: string, bookingDetails: any) {
    await this.notificationQueue.add('booking-reminder-sms', {
      phoneNumber,
      bookingDetails,
      channel: 'sms',
    });
  }
}

// src/modules/notifications/notifications.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUES } from '../../common/constants/queue.constants';
import { SendGridService } from '../../shared/sendgrid/sendgrid.service';
import { TwilioService } from '../../shared/twilio/twilio.service';
import { LoggerService } from '../../shared/logger/logger.service';

@Processor(QUEUES.NOTIFICATIONS)
export class NotificationsProcessor extends WorkerHost {
  constructor(
    private readonly sendGridService: SendGridService,
    private readonly twilioService: TwilioService,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log(`Processing notification: ${job.name}`);

    switch (job.name) {
      // Email notifications
      case 'welcome-email':
        await this.handleWelcomeEmail(job.data);
        break;
      case 'password-reset-email':
        await this.handlePasswordResetEmail(job.data);
        break;
      case 'email-verification':
        await this.handleEmailVerification(job.data);
        break;

      // SMS notifications
      case 'welcome-sms':
        await this.handleWelcomeSms(job.data);
        break;
      case 'booking-confirmation-sms':
        await this.handleBookingConfirmationSms(job.data);
        break;
      case 'booking-reminder-sms':
        await this.handleBookingReminderSms(job.data);
        break;

      default:
        this.logger.warn(`Unknown notification type: ${job.name}`);
    }
  }

  // Email handlers
  private async handleWelcomeEmail(data: any): Promise<void> {
    await this.sendGridService.sendEmail({
      to: data.email,
      subject: 'Welcome to Fixtree!',
      templateId: 'd-welcome-template-id',
      dynamicTemplateData: { name: data.name },
    });
  }

  private async handlePasswordResetEmail(data: any): Promise<void> {
    await this.sendGridService.sendEmail({
      to: data.email,
      subject: 'Reset Your Password',
      templateId: 'd-password-reset-template-id',
      dynamicTemplateData: { resetToken: data.resetToken },
    });
  }

  private async handleEmailVerification(data: any): Promise<void> {
    await this.sendGridService.sendEmail({
      to: data.email,
      subject: 'Verify Your Email',
      templateId: 'd-email-verification-template-id',
      dynamicTemplateData: { verificationToken: data.verificationToken },
    });
  }

  // SMS handlers
  private async handleWelcomeSms(data: any): Promise<void> {
    await this.twilioService.sendSms(
      data.phoneNumber,
      `Welcome to Fixtree, ${data.name}! Start exploring services now.`,
    );
  }

  private async handleBookingConfirmationSms(data: any): Promise<void> {
    await this.twilioService.sendSms(
      data.phoneNumber,
      `Your booking #${data.bookingDetails.id} is confirmed for ${data.bookingDetails.date}.`,
    );
  }

  private async handleBookingReminderSms(data: any): Promise<void> {
    await this.twilioService.sendSms(
      data.phoneNumber,
      `Reminder: Your booking #${data.bookingDetails.id} is scheduled for tomorrow.`,
    );
  }
}
```

### Example: Guard

```typescript
// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}
```

### Example: Decorator

```typescript
// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// src/common/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

### Example: Interceptor

```typescript
// src/common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  requestId: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const requestId = request.requestId || 'unknown';

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
        requestId,
      })),
    );
  }
}
```

### Example: Request ID Middleware

```typescript
// src/common/middleware/request-id.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = (req.headers['x-request-id'] as string) || randomUUID();
    req['requestId'] = requestId;
    res.setHeader('X-Request-ID', requestId);
    next();
  }
}
```

### Example: Environment Validation (Joi)

```typescript
// src/config/env.validation.ts
import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // App
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production')
    .required(),
  PORT: Joi.number().default(3000),
  CORS_ORIGINS: Joi.string().required(),

  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_LOGGING: Joi.boolean().default(false),

  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // Redis
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),

  // SendGrid
  SENDGRID_API_KEY: Joi.string().required(),
  SENDGRID_FROM_EMAIL: Joi.string().email().required(),
  SENDGRID_FROM_NAME: Joi.string().required(),

  // Twilio
  TWILIO_ACCOUNT_SID: Joi.string().required(),
  TWILIO_AUTH_TOKEN: Joi.string().required(),
  TWILIO_PHONE_NUMBER: Joi.string().required(),
  TWILIO_VERIFY_SERVICE_SID: Joi.string().required(),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),

  // Super Admin
  SUPER_ADMIN_EMAIL: Joi.string().email().required(),
  SUPER_ADMIN_PASSWORD: Joi.string().min(8).required(),
});
```

### Example: Config Module with Multi-Environment

```typescript
// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './env.validation';
import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import bullmqConfig from './bullmq.config';
import cloudinaryConfig from './cloudinary.config';
import sendgridConfig from './sendgrid.config';
import twilioConfig from './twilio.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env', // Local overrides (highest priority)
        `.env.${process.env.NODE_ENV || 'development'}`, // Environment-specific
      ],
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        bullmqConfig,
        cloudinaryConfig,
        sendgridConfig,
        twilioConfig,
      ],
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
      },
    }),
  ],
})
export class AppConfigModule {}
```

### Example: .env.development

```env
# .env.development - Development defaults (committed to git)
NODE_ENV=development
PORT=3000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=fixtree_dev
DB_SYNCHRONIZE=false
DB_LOGGING=true

# JWT (use weak secrets for dev only)
JWT_SECRET=dev-secret-key-minimum-32-characters!!
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=dev-refresh-secret-key-min-32-chars!!
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# SendGrid (use test key or leave empty for dev)
SENDGRID_API_KEY=your-dev-api-key
SENDGRID_FROM_EMAIL=dev@fixtree.com
SENDGRID_FROM_NAME=Fixtree Dev

# Twilio (use test credentials for dev)
TWILIO_ACCOUNT_SID=your-dev-account-sid
TWILIO_AUTH_TOKEN=your-dev-auth-token
TWILIO_PHONE_NUMBER=+15005550006
TWILIO_VERIFY_SERVICE_SID=your-dev-verify-sid

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Super Admin
SUPER_ADMIN_EMAIL=admin@fixtree.com
SUPER_ADMIN_PASSWORD=DevAdmin@123
```

### Example: .env.production (Template)

```env
# .env.production - Production config (NOT committed, on server only)
NODE_ENV=production
PORT=3000
CORS_ORIGINS=https://fixtree.com,https://www.fixtree.com

# Database
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=fixtree_user
DB_PASSWORD=<strong-password>
DB_NAME=fixtree_prod
DB_SYNCHRONIZE=false
DB_LOGGING=false

# JWT (strong secrets, rotate periodically)
JWT_SECRET=<generate-strong-64-char-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=<generate-strong-64-char-secret>
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=<redis-password>

# SendGrid
SENDGRID_API_KEY=<production-api-key>
SENDGRID_FROM_EMAIL=noreply@fixtree.com
SENDGRID_FROM_NAME=Fixtree

# Twilio
TWILIO_ACCOUNT_SID=<production-account-sid>
TWILIO_AUTH_TOKEN=<production-auth-token>
TWILIO_PHONE_NUMBER=<production-phone-number>
TWILIO_VERIFY_SERVICE_SID=<production-verify-sid>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<production-cloud-name>
CLOUDINARY_API_KEY=<production-api-key>
CLOUDINARY_API_SECRET=<production-api-secret>

# Super Admin
SUPER_ADMIN_EMAIL=superadmin@fixtree.com
SUPER_ADMIN_PASSWORD=<strong-password>
```

### Example: Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### Example: ESLint Configuration (Strict)

```javascript
// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintPluginPrettier,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'warn',
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '*.js', '*.mjs'],
  },
);
```

### Example: lint-staged Configuration

```json
// .lintstagedrc
{
  "*.ts": ["prettier --write", "eslint --fix"],
  "*.{json,md}": ["prettier --write"]
}
```

### Example: commitlint Configuration

```json
// .commitlintrc
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "chore",
        "revert",
        "build",
        "ci"
      ]
    ],
    "subject-case": [2, "always", "lower-case"],
    "subject-max-length": [2, "always", 72]
  }
}
```

### Example: Husky pre-commit Hook

```bash
# .husky/pre-commit
npx lint-staged
```

### Example: Husky commit-msg Hook

```bash
# .husky/commit-msg
npx --no -- commitlint --edit $1
```

### Example: Dockerfile (Production)

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

### Example: Dockerfile.dev (Development)

```dockerfile
# Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
```

### Example: docker-compose.yml (Development)

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - '3000:3000'
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      - postgres
      - redis
    networks:
      - fixtree-network

  postgres:
    image: postgres:16-alpine
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: fixtree
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - fixtree-network

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis-data:/data
    networks:
      - fixtree-network

volumes:
  postgres-data:
  redis-data:

networks:
  fixtree-network:
    driver: bridge
```

### Example: docker-compose.prod.yml (Production)

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    env_file:
      - .env
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    networks:
      - fixtree-network

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - fixtree-network

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    restart: unless-stopped
    networks:
      - fixtree-network

volumes:
  postgres-data:
  redis-data:

networks:
  fixtree-network:
    driver: bridge
```

### Example: .dockerignore

```
# .dockerignore
node_modules
dist
.git
.gitignore
.env
.env.*
!.env.example
*.md
.husky
.vscode
coverage
test
*.log
```

### Example: GitHub Actions CI Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Check formatting
        run: npm run format:check

      - name: Run linter
        run: npm run lint

      - name: Build
        run: npm run build

      # Uncomment when tests are ready
      # - name: Run tests
      #   run: npm run test
```

### Example: GitHub Actions Deploy Staging Workflow

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Staging Server
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /var/www/fixtree-backend-staging
            git pull origin develop
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml up -d --build
            docker system prune -f
```

### Example: GitHub Actions Deploy Production Workflow

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to Production Server
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            cd /var/www/fixtree-backend
            git pull origin main
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml up -d --build
            docker system prune -f
```

### Example: Base Entity

```typescript
// src/database/entities/base.entity.ts
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
```

---

## Conventions & Patterns

### Git Branching Strategy

```
main        → Production (auto-deploys to production server)
develop     → Staging (auto-deploys to staging server)
feature/*   → New features (PR to develop)
hotfix/*    → Urgent fixes (PR to main)
bugfix/*    → Bug fixes (PR to develop)
```

**Workflow:**

1. Create feature branch from `develop`
2. Make changes and commit (conventional commits enforced)
3. Push and create PR to `develop`
4. After review and merge, auto-deploys to staging
5. After testing, merge `develop` to `main`
6. Auto-deploys to production

### CI/CD Pipeline

| Trigger                        | Actions                     |
| ------------------------------ | --------------------------- |
| Push/PR to `main` or `develop` | Lint → Format check → Build |
| Push to `develop`              | Deploy to staging server    |
| Push to `main`                 | Deploy to production server |

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>: <subject>

Types:
- feat:     New feature
- fix:      Bug fix
- docs:     Documentation changes
- style:    Code style changes (formatting, semicolons, etc.)
- refactor: Code refactoring (no feature change)
- perf:     Performance improvements
- test:     Adding or updating tests
- chore:    Maintenance tasks
- revert:   Reverting changes
- build:    Build system changes
- ci:       CI configuration changes

Examples:
- feat: add user registration endpoint
- fix: resolve password validation error
- docs: update API documentation
- chore: update dependencies
```

### Naming Conventions

| Type       | Convention                          | Example                               |
| ---------- | ----------------------------------- | ------------------------------------- |
| Files      | kebab-case                          | `user.entity.ts`, `jwt-auth.guard.ts` |
| Classes    | PascalCase                          | `UserEntity`, `JwtAuthGuard`          |
| Methods    | camelCase                           | `findById`, `createUser`              |
| Constants  | SCREAMING_SNAKE_CASE                | `JWT_SECRET`, `QUEUE_NAME`            |
| Interfaces | PascalCase with I prefix (optional) | `JwtPayload`, `IApiResponse`          |

### Module Structure

```
module-name/
├── module-name.module.ts       # Module definition
├── module-name.controller.ts   # HTTP endpoints (if needed)
├── module-name.service.ts      # Business logic
├── module-name.repository.ts   # Database operations (if needed)
├── entities/
│   └── entity-name.entity.ts
└── dto/
    ├── create-entity.dto.ts
    └── update-entity.dto.ts
```

### Import Order

```typescript
// 1. Node.js built-in modules
import { randomUUID } from 'crypto';

// 2. External modules
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// 3. Internal modules (absolute paths)
import { Role } from '../../../common/enums/role.enum';

// 4. Relative imports
import { User } from './entities/user.entity';
```

---

## Future Enhancements

These features are planned for future implementation:

- [ ] Unit and E2E testing
- [ ] Rate limiting
- [ ] API versioning (if needed)
- [ ] WebSocket for real-time messaging
- [ ] Payment integration
- [ ] Analytics dashboard
- [ ] Admin dashboard
- [ ] Mobile push notifications (FCM/APNs)

---

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

---

## Support

For questions or support, contact the development team.

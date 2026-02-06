# Fixtree Backend - Implementation Stages

> **Note:** This is a temporary document for tracking implementation progress. It will be removed after all stages are completed.

Each stage is a separate commit. Complete one stage before moving to the next.

---

## Progress Overview

| Stage | Description                   | Status       |
| ----- | ----------------------------- | ------------ |
| 1     | Project Setup & Configuration | ✅ Completed |
| 2     | Common Utilities              | ✅ Completed |
| 3     | Database Setup                | ✅ Completed |
| 4     | Shared Services               | ✅ Completed |
| 5     | Users Module                  | ✅ Completed |
| 6     | Auth Module (Basic)           | ✅ Completed |
| 7     | Sessions Module               | ✅ Completed |
| 8     | Auth Module (Extended)        | ✅ Completed |
| 9     | Seller Module                 | ⬜ Pending   |
| 10    | Admin Modules                 | ⬜ Pending   |
| 11    | Queue & Cron Jobs             | ⬜ Pending   |
| 12    | Notifications Module          | ⬜ Pending   |
| 13    | Health Check & Swagger        | ⬜ Pending   |
| 14    | Database Seeders              | ✅ Completed |
| 15    | Docker Setup                  | ⬜ Pending   |
| 16    | CI/CD Pipeline                | ⬜ Pending   |
| 17    | Final Integration & Testing   | ⬜ Pending   |

**Legend:** ⬜ Pending | 🔄 In Progress | ✅ Completed

---

## Stage 1: Project Setup & Configuration

**Commit:** `feat: project setup and configuration`

**Tasks:**

- [x] Initialize NestJS project
- [x] Setup multi-environment files (`.env.example`, `.env.development`)
- [x] Create Joi validation schema for environment variables
- [x] Setup Husky, lint-staged, and commitlint
- [x] Configure Prettier (`.prettierrc`)
- [x] Configure ESLint strict mode (`eslint.config.mjs`)
- [x] Create `config/` module with all config files
- [x] Setup `app.module.ts` with ConfigModule
- [x] Configure `main.ts` (Helmet, CORS, global prefix)

**Files to create:**

```
# Environment files
.env.example              # Template (committed)
.env.development          # Development config (git ignored)
.env                      # Local overrides (git ignored)

# Code quality config
.prettierrc
.lintstagedrc
.commitlintrc
eslint.config.mjs

# Husky hooks
.husky/
├── pre-commit
└── commit-msg

# Source files
src/
├── main.ts
├── app.module.ts
└── config/
    ├── config.module.ts
    ├── env.validation.ts     # Joi validation schema
    ├── app.config.ts
    ├── database.config.ts
    ├── jwt.config.ts
    ├── bullmq.config.ts
    ├── cloudinary.config.ts
    ├── sendgrid.config.ts
    ├── twilio.config.ts
    └── google.config.ts      # Google OAuth settings
```

**Dependencies to install:**

```bash
npm install @nestjs/config helmet joi
```

**Multi-environment setup:**

```
.env.example        # Template with all variables (committed)
.env.development    # Development config (git ignored)
.env.staging        # Staging config (git ignored)
.env.production     # Production config (git ignored)
.env                # Local overrides (git ignored, highest priority)
```

**Loading order (ConfigModule):**

```typescript
envFilePath: [
  '.env', // Local overrides
  `.env.${process.env.NODE_ENV || 'development'}`, // Environment-specific
];
```

**Environment validation (env.validation.ts):**

```typescript
import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production')
    .required(),
  PORT: Joi.number().default(3000),

  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // ... other validations
});
```

**Dev dependencies for code quality:**

```bash
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
```

**Husky setup commands:**

```bash
# Initialize Husky
npx husky init

# Create pre-commit hook
echo "npx lint-staged" > .husky/pre-commit

# Create commit-msg hook
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

**Prettier configuration (`.prettierrc`):**

```json
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

**lint-staged configuration (`.lintstagedrc`):**

```json
{
  "*.ts": ["prettier --write", "eslint --fix"],
  "*.{json,md}": ["prettier --write"]
}
```

**commitlint configuration (`.commitlintrc`):**

```json
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

**Commit message format:**

```
<type>: <subject>

Examples:
feat: add user authentication
fix: resolve login validation bug
docs: update API documentation
chore: update dependencies
refactor: restructure auth module
```

---

## Stage 2: Common Utilities

**Commit:** `feat: common utilities and helpers`

**Tasks:**

- [x] Create constants (app, queue)
- [x] Create enums (role, platform)
- [x] Create decorators (roles, current-user, public)
- [x] Create guards (jwt-auth, roles)
- [x] Create interceptors (response, logging, audit-log)
- [x] Create filters (http-exception)
- [x] Create middleware (request-id)
- [x] Create pipes (validation)
- [x] Create types (jwt-payload, api-response)
- [x] Create utils module and service

**Files to create:**

```
src/common/
├── constants/
│   ├── app.constants.ts
│   └── queue.constants.ts
├── decorators/
│   ├── roles.decorator.ts
│   ├── current-user.decorator.ts
│   └── public.decorator.ts
├── dto/
│   ├── pagination.dto.ts
│   └── pagination-response.dto.ts
├── enums/
│   ├── role.enum.ts
│   └── platform.enum.ts
├── guards/
│   ├── jwt-auth.guard.ts
│   └── roles.guard.ts
├── interceptors/
│   ├── response.interceptor.ts
│   ├── logging.interceptor.ts
│   └── audit-log.interceptor.ts
├── filters/
│   └── http-exception.filter.ts
├── middleware/
│   └── request-id.middleware.ts
├── pipes/
│   └── validation.pipe.ts
├── types/
│   ├── jwt-payload.type.ts
│   └── api-response.type.ts
└── utils/
    ├── utils.module.ts
    └── utils.service.ts
```

**Dependencies to install:**

```bash
npm install class-validator class-transformer bcrypt
npm install -D @types/bcrypt
```

---

## Stage 3: Database Setup

**Commit:** `feat: database configuration and base entity`

**Tasks:**

- [x] Install TypeORM and PostgreSQL driver
- [x] Create `database/typeorm.module.ts`
- [x] Create `database/typeorm.config.ts`
- [x] Create `database/entities/base.entity.ts` (with soft delete)
- [x] Setup migrations directory
- [x] Create seeder module structure

**Files to create:**

```
src/database/
├── typeorm.module.ts
├── typeorm.config.ts
├── entities/
│   └── base.entity.ts
├── migrations/
│   └── .gitkeep
└── seeders/
    ├── seeder.module.ts
    ├── seeder.service.ts
    └── data/
        └── super-admin.seed.ts
```

**Dependencies to install:**

```bash
npm install @nestjs/typeorm typeorm pg
```

**Add to package.json scripts:**

```json
{
  "scripts": {
    "migration:generate": "typeorm migration:generate -d src/database/typeorm.config.ts",
    "migration:run": "typeorm migration:run -d src/database/typeorm.config.ts",
    "migration:revert": "typeorm migration:revert -d src/database/typeorm.config.ts",
    "seed": "ts-node src/database/seeders/seeder.service.ts"
  }
}
```

---

## Stage 4: Shared Services

**Commit:** `feat: shared services (logger, cloudinary, sendgrid, twilio, upload)`

**Tasks:**

- [x] Create logger module (Winston)
- [x] Create cloudinary module
- [x] Create sendgrid module (email)
- [x] Create twilio module (SMS & phone verification)
- [x] Create upload module (Multer + Cloudinary)

**Files to create:**

```
src/shared/
├── logger/
│   ├── logger.module.ts
│   └── logger.service.ts
├── cloudinary/
│   ├── cloudinary.module.ts
│   └── cloudinary.service.ts
├── sendgrid/
│   ├── sendgrid.module.ts
│   └── sendgrid.service.ts
├── twilio/
│   ├── twilio.module.ts
│   └── twilio.service.ts
└── upload/
    ├── upload.module.ts
    ├── upload.service.ts
    └── upload.config.ts
```

**Dependencies to install:**

```bash
npm install winston cloudinary @sendgrid/mail twilio multer
npm install -D @types/multer
```

**Twilio Setup:**

1. Create Twilio account at https://www.twilio.com
2. Get Account SID and Auth Token from Console
3. Buy a phone number for sending SMS
4. Create a Verify Service for phone verification

---

## Stage 5: Users Module

**Commit:** `feat: users module with entity and repository`

**Tasks:**

- [x] Create user entity (extends BaseEntity)
- [x] Create users repository
- [x] Create users service
- [x] Create users module
- [x] Create DTOs
- [x] Generate initial migration

**Files to create:**

```
src/modules/users/
├── users.module.ts
├── users.service.ts
├── users.repository.ts
├── entities/
│   └── user.entity.ts
└── dto/
    └── create-user.dto.ts
```

**After creating entity, run:**

```bash
npm run migration:generate -- src/database/migrations/CreateUsersTable
npm run migration:run
```

---

## Stage 6: Auth Module (Basic)

**Commit:** `feat: auth module with JWT authentication`

**Tasks:**

- [x] Create auth module, controller, service
- [x] Create JWT strategy
- [x] Create JWT refresh strategy
- [x] Implement register endpoint
- [x] Implement login endpoint
- [x] Implement Google OAuth login endpoint
- [x] Implement refresh token endpoint
- [x] Implement logout endpoint
- [x] Create auth DTOs

**Files to create:**

```
src/modules/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── strategies/
│   ├── jwt.strategy.ts
│   └── jwt-refresh.strategy.ts
└── dto/
    ├── login.dto.ts
    ├── register.dto.ts
    ├── refresh-token.dto.ts
    └── device-info.dto.ts
```

**Dependencies to install:**

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt google-auth-library
npm install -D @types/passport-jwt
```

**Google OAuth Flow (Token Verification):**

```
1. Client gets Google ID Token from Google Sign-In SDK
2. Client sends POST /api/auth/google { idToken, deviceInfo? }
3. Backend verifies token with google-auth-library
4. Backend extracts user info (email, googleId, name, picture)
5. Backend finds or creates user
6. Backend creates session and returns JWT tokens
```

---

## Stage 7: Sessions Module

**Commit:** `feat: session management with multi-platform support`

**Tasks:**

- [x] Create session entity
- [x] Create sessions repository
- [x] Create sessions service
- [x] Create device-parser service (Bowser)
- [x] Implement session endpoints
- [x] Add Redis caching for sessions

**Files to create:**

```
src/modules/auth/sessions/
├── sessions.module.ts
├── sessions.service.ts
├── sessions.repository.ts
├── device-parser.service.ts
├── entities/
│   └── session.entity.ts
└── dto/
    └── session-response.dto.ts
```

**Dependencies to install:**

```bash
npm install bowser ioredis
```

**After creating entity, run:**

```bash
npm run migration:generate -- src/database/migrations/CreateSessionsTable
npm run migration:run
```

---

## Stage 8: Auth Module (Extended)

**Commit:** `feat: extended auth features (password, profile, verification)`

**Tasks:**

- [x] Implement change password
- [x] Implement forgot password
- [x] Implement reset password
- [x] Implement email verification (send & verify)
- [x] Implement phone verification (send OTP & verify)
- [x] Implement get profile
- [x] Implement update profile
- [x] Implement delete account (soft delete)

**Files to create (additional DTOs):**

```
src/modules/auth/dto/
├── change-password.dto.ts
├── forgot-password.dto.ts
├── reset-password.dto.ts
├── update-profile.dto.ts
├── send-phone-verification.dto.ts
└── verify-phone.dto.ts
```

---

## Stage 9: Seller Module

**Commit:** `feat: seller module with auto-creation on registration`

**Tasks:**

- [ ] Create seller entity (one-to-one with User)
- [ ] Create seller repository
- [ ] Create seller service
- [ ] Create seller module
- [ ] Create seller controller (basic endpoints)
- [ ] Create seller DTOs (update DTO only)
- [ ] Update auth service to auto-create seller on registration
- [ ] Update auth module to import sellers module
- [ ] Generate migration for seller table
- [ ] Test seller creation on registration

**Files to create:**

```
src/modules/sellers/
├── sellers.module.ts
├── sellers.service.ts
├── sellers.repository.ts
├── sellers.controller.ts
├── entities/
│   └── seller.entity.ts
└── dto/
    ├── requests/
    │   └── update-seller.dto.ts
    └── responses/
        └── seller-response.dto.ts
```

**Entity Structure:**

```typescript
// seller.entity.ts
@Entity('seller')
export class Seller extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  @Index()
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
```

**Key Points:**

- One-to-one relationship with User
- `CASCADE` delete: if user is deleted, seller is deleted
- Minimal fields: `userId`, `user` relation, and `isActive` flag
- Uses both `userId` (direct column access) and `user` (relation property) - same pattern as Session entity
- Auto-creates seller when user registers with `role=SELLER`

**Integration with Registration:**

Update `AuthService.register()` method:

```typescript
// After user creation
if (user.role === Role.SELLER) {
  await this.sellersService.create(user.id);
}
```

**Endpoints:**

```
GET    /sellers/profile          # Get seller (SELLER only)
PATCH  /sellers/profile          # Update seller (SELLER only)
```

**Dependencies:**
No new dependencies required. Uses existing:

- `@nestjs/typeorm` (already installed)
- `class-validator` (already installed)
- `class-transformer` (already installed)

**After creating entity, run:**

```bash
npm run migration:generate -- src/database/migrations/CreateSellerTable
npm run migration:run
```

---

## Stage 10: Admin Modules

**Commit:** `feat: admin modules (auth and users management)`

**Tasks:**

- [ ] Create admin module (root)
- [ ] Create admin-auth module, controller, service
- [ ] Create admin-users module, controller, service
- [ ] Implement admin login (role restriction)
- [ ] Implement user management (CRUD, ban/unban)

**Files to create:**

```
src/modules/admin/
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

## Stage 11: Queue & Cron Jobs

**Commit:** `feat: BullMQ queues and cron jobs`

**Tasks:**

- [ ] Create BullMQ module
- [ ] Create cron module, service, processor
- [ ] Add example cron job (cleanup sessions)
- [ ] Test queue functionality

**Files to create:**

```
src/queues/
├── bullmq.module.ts
└── cron/
    ├── cron.module.ts
    ├── cron.service.ts
    └── cron.processor.ts
```

**Dependencies to install:**

```bash
npm install @nestjs/bullmq bullmq
```

---

## Stage 12: Notifications Module

**Commit:** `feat: notifications module with queue processor`

**Tasks:**

- [ ] Create notifications module
- [ ] Create notifications service
- [ ] Create notifications processor
- [ ] Implement email notifications (via SendGrid)
- [ ] Implement SMS notifications (via Twilio)

**Notification types to implement:**

- Welcome email
- Password reset email
- Email verification
- Welcome SMS
- Booking confirmation SMS
- Booking reminder SMS

**Files to create:**

```
src/modules/notifications/
├── notifications.module.ts
├── notifications.service.ts
└── notifications.processor.ts
```

---

## Stage 13: Health Check & Swagger

**Commit:** `feat: health check and swagger documentation`

**Tasks:**

- [ ] Create health module and controller
- [ ] Configure Swagger in main.ts
- [ ] Add Swagger decorators to all controllers
- [ ] Test all endpoints via Swagger UI

**Files to create:**

```
src/modules/health/
├── health.module.ts
└── health.controller.ts
```

**Dependencies to install:**

```bash
npm install @nestjs/swagger @nestjs/terminus
```

---

## Stage 14: Database Seeders

**Commit:** `feat: database seeders for initial data`

**Tasks:**

- [x] Implement seeder service
- [x] Create super admin seeder
- [x] Add seeder command to package.json
- [ ] Test seeder execution

**Run seeder:**

```bash
npm run seed
```

---

## Stage 15: Docker Setup

**Commit:** `chore: docker configuration for development and production`

**Tasks:**

- [ ] Create Dockerfile (production)
- [ ] Create Dockerfile.dev (development)
- [ ] Create docker-compose.yml (local development)
- [ ] Create docker-compose.prod.yml (production)
- [ ] Create .dockerignore
- [ ] Test local development with Docker
- [ ] Document Docker commands

**Files to create:**

```
Dockerfile
Dockerfile.dev
docker-compose.yml
docker-compose.prod.yml
.dockerignore
```

**Dockerfile (Production):**

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

**docker-compose.yml (Development):**

```yaml
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
    depends_on:
      - postgres
      - redis

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

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis-data:/data

volumes:
  postgres-data:
  redis-data:
```

**Docker commands:**

```bash
# Development
docker-compose up -d              # Start all services
docker-compose down               # Stop all services
docker-compose logs -f app        # View app logs
docker-compose exec app sh        # Shell into app container

# Production build test
docker build -t fixtree-backend .
docker run -p 3000:3000 fixtree-backend
```

---

## Stage 16: CI/CD Pipeline

**Commit:** `ci: github actions for CI/CD pipeline`

**Tasks:**

- [ ] Create CI workflow (lint, format, build)
- [ ] Create staging deployment workflow
- [ ] Create production deployment workflow
- [ ] Setup GitHub secrets
- [ ] Setup VPS server for deployment
- [ ] Test deployment pipeline

**Files to create:**

```
.github/
└── workflows/
    ├── ci.yml
    ├── deploy-staging.yml
    └── deploy-production.yml
```

**Branch strategy:**

```
main        → Production deployment
develop     → Staging deployment
feature/*   → PR to develop
hotfix/*    → PR to main
```

**CI workflow (ci.yml):**

```yaml
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
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run format:check
      - run: npm run lint
      - run: npm run build
```

**Deploy staging workflow (deploy-staging.yml):**

```yaml
name: Deploy to Staging
on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /var/www/fixtree-backend-staging
            git pull origin develop
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml up -d --build
```

**Deploy production workflow (deploy-production.yml):**

```yaml
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            cd /var/www/fixtree-backend
            git pull origin main
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml up -d --build
```

**GitHub Secrets to configure:**

```
# Staging
STAGING_HOST          # Staging server IP
STAGING_USER          # SSH username
STAGING_SSH_KEY       # SSH private key

# Production
PRODUCTION_HOST       # Production server IP
PRODUCTION_USER       # SSH username
PRODUCTION_SSH_KEY    # SSH private key
```

**VPS Server Setup (Contabo):**

```bash
# 1. Install Docker
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER

# 2. Install Git
sudo apt install git -y

# 3. Clone repository
cd /var/www
git clone <repository-url> fixtree-backend
cd fixtree-backend

# 4. Setup environment
cp .env.example .env
nano .env  # Configure environment variables

# 5. Start with Docker
docker-compose -f docker-compose.prod.yml up -d

# 6. Setup Nginx reverse proxy (optional)
sudo apt install nginx -y
# Configure nginx to proxy to localhost:3000
```

---

## Stage 17: Final Integration & Testing

**Commit:** `feat: final integration and manual testing`

**Tasks:**

- [ ] Verify all modules are imported correctly
- [ ] Test complete auth flow (register → login → profile → logout)
- [ ] Test admin flow (login → manage users)
- [ ] Test session management (multiple devices, logout all)
- [ ] Verify cron jobs are running
- [ ] Check logs and request IDs
- [ ] Verify soft delete functionality

**Testing checklist:**

### User Auth Flow

- [ ] POST /auth/register - Register buyer
- [ ] POST /auth/register - Register seller
- [ ] POST /auth/login - Login user
- [ ] POST /auth/refresh-token - Refresh token
- [ ] GET /auth/profile - Get profile
- [ ] PATCH /auth/profile - Update profile
- [ ] POST /auth/change-password - Change password
- [ ] POST /auth/forgot-password - Request reset
- [ ] POST /auth/reset-password - Reset password
- [ ] POST /auth/send-phone-verification - Send phone OTP
- [ ] POST /auth/verify-phone - Verify phone OTP
- [ ] POST /auth/verify-email - Verify email
- [ ] GET /auth/sessions - List sessions
- [ ] DELETE /auth/sessions/:id - Logout device
- [ ] DELETE /auth/sessions/others - Logout others
- [ ] DELETE /auth/sessions - Logout all
- [ ] POST /auth/logout - Logout current

### Seller Flow

- [ ] POST /auth/register - Register seller (verify seller is auto-created)
- [ ] GET /sellers/profile - Get seller profile
- [ ] PATCH /sellers/profile - Update seller profile
- [ ] GET /sellers/profile as BUYER - Returns 403 Forbidden

### Admin Auth Flow

- [ ] POST /admin/auth/login - Admin login
- [ ] GET /admin/auth/profile - Admin profile
- [ ] GET /admin/auth/sessions - Admin sessions

### Admin User Management

- [ ] GET /admin/users - List users
- [ ] GET /admin/users/:id - Get user
- [ ] POST /admin/users - Create admin (Super Admin)
- [ ] PATCH /admin/users/:id - Update user
- [ ] POST /admin/users/:id/ban - Ban user
- [ ] POST /admin/users/:id/unban - Unban user
- [ ] DELETE /admin/users/:id - Delete user

### Other

- [ ] GET /health - Health check
- [ ] GET /docs - Swagger UI
- [ ] Cron jobs running
- [ ] Logs with request IDs

---

## After Completion

Once all stages are completed and tested:

1. Remove this file (`IMPLEMENTATION-STAGES.md`)
2. Update `README.md` if needed
3. Create initial git tag: `git tag v1.0.0`
4. Push to repository

---

## Notes

- Each stage should be a single commit
- Test each stage before moving to the next
- Keep dependencies up to date
- Follow the code examples in `README.md`

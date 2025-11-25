# Umoja App Frontend Architecture

## Overview

Umoja is a marketplace platform connecting fashion designers with buyers, featuring project management, bidding systems, milestone tracking, and integrated payment processing. The frontend is built as a modern web application using Next.js 15 with TypeScript.

## Tech Stack

### Core Framework & Runtime

- **Next.js 15.0.3** - React framework with App Router
- **React 19.0.0-rc** - UI library (release candidate)
- **TypeScript 5** - Type-safe development
- **Node.js** - Runtime environment

### UI & Styling

- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Radix UI** - Headless component library for accessibility
  - Dialog, Select, Radio Group, Checkbox, Switch, Toast, etc.
- **Lucide React** - Icon library
- **Class Variance Authority (CVA)** - Component variant management
- **Tailwind Merge** - Intelligent Tailwind class merging

### State Management & Data Fetching

- **TanStack Query 5.62.7** - Server state management and caching
- **React Hook Form 7.53.2** - Form state management
- **Zod 3.23.8** - Schema validation and type inference

### Authentication & Security

- **NextAuth.js 4.24.11** - Authentication framework
- **Google OAuth** - Social authentication
- **Credential-based auth** - Email/password authentication
- **JWT tokens** - Session management

### Real-time & Communication

- **Firebase** - Real-time database for chat functionality
- **Firebase Analytics** - User analytics

### Development & Quality

- **ESLint** - Code linting
- **Husky** - Git hooks
- **Lint-staged** - Pre-commit linting
- **Rollbar** - Error tracking and monitoring

### Deployment & Infrastructure

- **Vercel** - Hosting and deployment
- **Vercel Analytics** - Performance monitoring
- **Google Analytics** - User tracking

## Architecture Overview

### Directory Structure

```
src/
├── actions/           # Server actions for data mutations
├── app/              # Next.js App Router pages and layouts
│   ├── (auth)/       # Authentication pages (login, register, etc.)
│   ├── (dashboard)/  # Protected dashboard pages
│   ├── api/          # API route handlers
│   └── onboard/      # User onboarding flow
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (shadcn/ui)
│   ├── custom/      # App-specific components
│   └── provider/    # Context providers
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries and configurations
├── types/           # TypeScript type definitions
├── constant/        # Application constants
├── layout/          # Layout components
├── section/         # Page sections and features
└── tanstack/        # TanStack Query configurations
```

## Authentication Architecture

### Authentication Flow

1. **NextAuth.js Configuration** (`src/lib/auth.ts`)

   - Supports Google OAuth and credential-based authentication
   - JWT strategy for session management
   - Custom callbacks for user data handling

2. **Middleware Protection** (`src/middleware.ts`)

   - Route-based access control
   - Automatic redirects based on authentication status
   - Onboarding flow enforcement

3. **User Roles & Permissions**
   - **BUYER** - Can create projects, manage sizing templates, handle escrow
   - **DESIGNER** - Can bid on projects, manage wallet, submit work

### Session Management

- JWT tokens stored in HTTP-only cookies
- Server-side session validation
- Automatic token refresh handling

## Data Architecture

### API Layer Structure

#### Server Actions (`src/actions/`)

- **auth.ts** - Authentication operations
- **bid.ts** - Bidding system operations
- **project.ts** - Project management
- **sizing-templates.ts** - Sizing template management
- **user.ts** - User profile operations

#### API Routes (`src/app/api/`)

- RESTful API endpoints following Next.js conventions
- Organized by feature domains:
  - `/auth/*` - Authentication endpoints
  - `/project/*` - Project and bidding operations
  - `/user/*` - User management
  - `/wallet/*` - Payment and wallet operations
  - `/sizing-template/*` - Template management

### Data Flow Pattern

```
Client Component → Server Action/API Route → External Backend → Database
                ↓
            TanStack Query (Caching & State Management)
                ↓
            Component Re-render
```

### State Management Strategy

#### Server State (TanStack Query)

- API data caching and synchronization
- Optimistic updates for better UX
- Background refetching and stale data handling
- Query keys organized by domain (`src/tanstack/keys.ts`)

#### Client State (React Hook Form + Local State)

- Form state management with validation
- Local UI state (modals, tabs, etc.)
- File upload and preview handling

## Component Architecture

### Design System Hierarchy

#### Base Layer (`src/components/ui/`)

- Built on Radix UI primitives
- Consistent styling with Tailwind CSS
- Accessible by default
- Examples: Button, Input, Dialog, Select

#### Custom Layer (`src/components/custom/`)

- Business-specific components
- Composed from base UI components
- Feature-rich components like:
  - Card components (Project, Bid, Notification)
  - Form components (TextField, FileUpload)
  - Complex UI (Milestone timeline, Chat bubbles)

#### Layout Components (`src/layout/`)

- Page-level layout structures
- Sidebar and navigation components
- Dashboard-specific layouts

### Component Patterns

#### Compound Components

```tsx
<Dialog>
  <DialogTrigger />
  <DialogContent>
    <DialogHeader />
    <DialogBody />
    <DialogFooter />
  </DialogContent>
</Dialog>
```

#### Render Props & Custom Hooks

- File handling: `useFilePicker`, `useImagePreviewUrls`
- Data fetching: Custom hooks in `src/tanstack/hooks/`
- Form management: Integration with React Hook Form

## Routing Architecture

### App Router Structure (Next.js 15)

#### Route Groups

- **(auth)** - Public authentication pages
- **(dashboard)** - Protected user dashboard
- **(corner)** - Dashboard pages with corner pattern layout
- **(with-back-button)** - Pages with back navigation

#### Dynamic Routes

- `/project/[id]` - Individual project pages
- `/bid/[bidId]` - Bid management pages
- `/sizing-template/[id]` - Template editing
- `/milestone/[milestoneId]` - Milestone tracking

#### Middleware Protection

- Route-based authentication checks
- Role-based access control
- Automatic onboarding flow redirection
- Guest route handling

## Real-time Features

### Firebase Integration

- **Real-time Database** - Chat messaging
- **Analytics** - User behavior tracking
- **Configuration** - Environment-based setup

### Chat System

- Real-time messaging between buyers and designers
- File sharing capabilities
- Message status indicators
- Typing indicators and presence

## Payment & Escrow System

### Wallet Management

- Multi-currency support (NGN, EUR)
- Escrow balance tracking
- Transaction history
- Withdrawal methods (PayPal, Direct Transfer)

### Milestone-based Payments

- Project funding workflow
- Milestone completion tracking
- Automatic payment release
- Dispute resolution system

## File Management

### Upload Strategy

- Client-side file validation
- Multiple upload methods (drag-drop, click-to-upload)
- Image preview generation
- File size and type restrictions

### Storage Integration

- Cloudinary for image optimization
- Firebase Storage for chat media

## Performance Optimizations

### Code Splitting

- Route-based code splitting via Next.js
- Dynamic imports for heavy components
- Lazy loading for non-critical features

### Caching Strategy

- TanStack Query for server state caching
- Next.js automatic static optimization
- Image optimization with Next.js Image component

### Bundle Optimization

- Tree shaking for unused code elimination
- Import optimization for large libraries
- Webpack bundle analysis

## Security Measures

### Authentication Security

- JWT token validation
- CSRF protection via NextAuth.js
- Secure cookie configuration
- OAuth state validation

### Data Validation

- Client-side validation with Zod schemas
- Server-side validation in API routes
- Type safety with TypeScript
- Input sanitization

### Error Handling

- Centralized error boundary components
- Rollbar integration for error tracking
- Graceful degradation for failed requests
- User-friendly error messages

## Development Workflow

### Code Quality

- ESLint configuration with Next.js rules
- TypeScript strict mode
- Pre-commit hooks with Husky
- Automated linting with lint-staged

### Environment Management

- Environment-specific configurations
- Secure environment variable handling
- Development vs production builds

### Deployment Pipeline

- Vercel for hosting
- Automated deployments from Git
- Environment variable injection
- Build optimization

## Key Features Implementation

### Project Management

- Multi-step project creation wizard
- Gallery management with cover image selection
- Clothing type and specialist categorization
- Due date and budget management

### Bidding System

- Designer bid submission
- Milestone-based project breakdown
- Bid comparison and selection
- Negotiation workflow

### Sizing Templates

- Gender-specific measurement templates
- Template sharing between projects
- Designer template requests
- Measurement validation

### User Onboarding

- Role-based onboarding flows
- Profile completion tracking
- Progressive disclosure of features
- Congratulations and guidance

## Monitoring & Analytics

### Performance Monitoring

- Vercel Analytics integration
- Core Web Vitals tracking
- Page load performance metrics

### Error Tracking

- Rollbar for error monitoring
- Client and server error capture
- Error context and user session data

### User Analytics

- Google Analytics integration
- Firebase Analytics for user behavior
- Conversion funnel tracking

## Future Considerations

### Scalability

- Component library extraction
- Micro-frontend architecture preparation
- API versioning strategy
- Database optimization

### Feature Enhancements

- Progressive Web App (PWA) capabilities
- Offline functionality
- Push notifications
- Advanced search and filtering

### Technical Debt

- Migration to stable React 19
- Bundle size optimization
- Accessibility improvements
- Performance auditing

---

This architecture supports a complex marketplace application with real-time features, secure payments, and role-based workflows while maintaining code quality, performance, and user experience standards.

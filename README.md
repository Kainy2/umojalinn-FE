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

---

## Consultation Feature

> **Status:** Frontend complete with mock data. Backend API integration pending.

### Overview

The Consultation feature enables buyers and designers to book one-on-one video consultations. Three distinct journeys are supported:

| Journey | Trigger | Flow |
|---------|---------|------|
| **Buyer General Request** | Buyer submits a consultation request from the Consultations tab | Matching → Matched → Booked → Live → Completed |
| **Designer Request** | Designer sends consultation request via a buyer's job ad | Requested → Booked → Live → Completed |
| **Buyer Instant Book** | Buyer books directly from a designer's public profile | Booked → Live → Completed |

---

### Status Flows

#### Buyer Statuses
`MATCHING` → `MATCHED` → `REQUESTED` → `BOOKED` → `LIVE` → `COMPLETED` → `CANCELLED`

- **MATCHING** — Request submitted, awaiting designer assignment by Umoja Linn admin
- **MATCHED** — Designer assigned and accepted; buyer selects a timeslot and pays
- **REQUESTED** — Designer sent a consultation request to the buyer via a job ad
- **BOOKED** — Timeslot confirmed and payment held in escrow
  - Sub-states: `BOOKED`, `RESCHEDULE_REQUESTED`, `NO_SHOW`
- **LIVE** — Consultation session is currently active
- **COMPLETED** — Session ended
  - Sub-states: `AWAITING_SUMMARY`, `SUMMARY_SUBMITTED`, `SUMMARY_ACCEPTED`, `SUMMARY_REJECTED`, `DISPUTE`
- **CANCELLED** — Cancelled by buyer, designer, or admin

#### Designer Statuses
`ASSIGNED` → `REQUESTED` → `BOOKED` → `LIVE` → `AWAITING_SUMMARY` → `COMPLETED` → `CANCELLED`

- **ASSIGNED** — Admin assigned a buyer request; designer must accept or reject
- **AWAITING_SUMMARY** — Session ended; designer must submit a summary document

---

### Routes Added

| Route | Role | Description |
|-------|------|-------------|
| `/consultations` | Buyer | Consultation list with sidebar status filters |
| `/consultations/[id]` | Buyer | Consultation detail right-panel |
| `/jobs/consultations` | Designer | Consultation list with sidebar status filters |
| `/jobs/consultations/[id]` | Designer | Consultation detail right-panel |
| `/video/[id]` | Both | Live session (reuses existing Agora video room) |

The "Consultations" tab is added to:
- Buyer's Projects tab bar (`src/section/dashboard/home/NavTab.tsx`)
- Designer's Jobs tab bar (`src/section/dashboard/job/Tab.tsx`)

---

### Key Files

```
src/
├── types/consultation.d.ts                          # All TypeScript types
├── lib/consultation-mock.ts                         # Mock data (all 14 status variants)
├── tanstack/hooks/useConsultation.tsx               # TanStack Query hooks (5 query, 12 mutation)
├── app/api/consultation/                            # API route proxies (ready for backend)
│   ├── all/route.ts
│   ├── [id]/route.ts
│   ├── [id]/book/route.ts
│   ├── [id]/accept/route.ts
│   ├── [id]/reject/route.ts
│   ├── [id]/reschedule/route.ts
│   ├── [id]/cancel/route.ts
│   ├── [id]/summary/route.ts
│   ├── [id]/dispute/route.ts
│   ├── availability/route.ts
│   └── suggest/route.ts
└── components/consultation/
    ├── StatusBadge.tsx                              # Colored status pill
    ├── EscrowAlert.tsx                              # Escrow/cancellation banner
    ├── ConsultationCard.tsx                         # List item card (buyer + designer)
    ├── ConsultationCardList.tsx                     # Filterable list with sidebar
    ├── detail/
    │   ├── BuyerDetail.tsx                          # Buyer detail right-panel
    │   └── DesignerDetail.tsx                       # Designer detail right-panel
    └── modals/
        ├── ConsultationRequestModal.tsx             # Multi-step buyer request form
        ├── BookingCalendarModal.tsx                 # Calendar + timeslot picker
        ├── RescheduleModal.tsx                      # Propose / accept reschedule
        ├── SummaryDocModal.tsx                      # Submit / review summary doc
        ├── ReportMissingModal.tsx                   # Dispute trigger (Live status)
        ├── AvailabilityModal.tsx                    # Designer availability & pricing
        └── SuggestConsultationModal.tsx             # Designer requests via job ad
```

---

### Profile Integrations

- **Designer profile settings** (`src/app/(dashboard)/(corner)/settings/(with-breadcrumbs)/profile/page.tsx`) — "Edit Availability" button opens `AvailabilityModal`
- **Designer public profile** (`src/section/dashboard/profile/DesignerProfileView.tsx`) — "Book Consultation" button (buyers only) opens `BookingCalendarModal`
- **Job ad detail page** (`src/app/(dashboard)/(with-back-button)/jobs/[id]/page.tsx`) — "Suggest Consultation" button (designers only) opens `SuggestConsultationModal`

---

### Connecting the Backend API

All frontend hooks and API route proxies are already structured. When the backend is ready:

**Step 1 — Update API routes** (`src/app/api/consultation/**`)

Each route currently proxies to `/consultation/...` via `customAxios`. No changes needed if the backend follows the same URL pattern. If URLs differ, update the path in each `route.ts` file.

**Step 2 — Replace mock data in hooks** (`src/tanstack/hooks/useConsultation.tsx`)

Remove the `/* eslint-disable */` comment at the top and replace each `mutationFn` / `queryFn` stub with a real `customAxios` call via a server action, following the pattern in `src/actions/project.ts`.

Example — replace a stub:
```ts
// Before (mock)
mutationFn: async (_payload: TBookConsultationPayload) => {
  await mockDelay(600);
  return mockQueryResponse(MOCK_BUYER_CONSULTATIONS[3]);
},

// After (real)
mutationFn: (payload: TBookConsultationPayload) => bookConsultation(payload),
```

**Step 3 — Remove mock imports**

Once all hooks use real data, delete or archive `src/lib/consultation-mock.ts` and remove its imports from `useConsultation.tsx`.

---

### Escrow & Payment Notes

- Payment is collected at the `MATCHED → BOOKED` transition when the buyer confirms a timeslot
- The frontend submits the chosen slot; the backend handles payment processing (Paystack/Stripe)
- Funds are held in escrow until the designer attends for ≥10 minutes
- Dispute button ("Report Missing") appears during `LIVE` status and calls `POST /api/consultation/[id]/dispute`

### Video Session

Live consultations use the existing Agora video infrastructure:
- Token generation: `GET /api/agora/token`
- Video room: `/video/[consultationId]` — passes `consultationId` as the Agora `channelId`
- No changes needed to the video components

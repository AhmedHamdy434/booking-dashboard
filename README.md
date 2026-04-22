# 🚀 Smart Booking Admin Dashboard

A high-end, modern SaaS-style admin dashboard built for managing services and bookings with a premium aesthetic and optimized performance.

![Dashboard Preview](https://via.placeholder.com/1200x600?text=Booking+Dashboard+Preview)

## ✨ Key Features

- **🛡️ Secure Authentication**: Robust login system powered by Supabase Auth with client-side Zod validation.
- **📊 Interactive Dashboard**: Real-time stats overview with trend indicators and recent activity tracking.
- **📅 Smart Schedule**: Integrated FullCalendar support with Month, Week, and Day views for managing appointments.
- **🛠️ Service Management**: Full CRUD operations for services with optimized revalidation using React Query.
- **📱 Responsive Design**: Seamless experience across mobile, tablet, and desktop with a modern sliding mobile sidebar.
- **⚡ Performance Optimized**: Uses "Uncontrolled Inputs" pattern for snappy form interactions and full React 19 Compiler compatibility.
- **🎨 Premium UI/UX**: Sophisticated Slate & Violet color palette, glassmorphism headers, and smooth micro-animations.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **State Management**: [TanStack Query v5](https://tanstack.com/query/latest)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Calendar**: [FullCalendar](https://fullcalendar.io/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/AhmedHamdy434/booking-dashboard.git
cd booking-dashboard
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Locally
```bash
npm run dev
```

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI & Layout components
├── features/       # Feature-based modules (Auth, Bookings, Services)
│   ├── auth/       # Authentication logic & pages
│   ├── bookings/   # Booking management
│   ├── services/   # Service management (CRUD)
│   └── schedule/   # FullCalendar integration
├── hooks/          # Global hooks
├── lib/            # Third-party configurations (Supabase, QueryClient)
├── routes/         # Routing logic & Protected routes
└── types/          # TypeScript definitions
```

## 🎨 Design Principles

This project follows a **Clean & Minimalist** SaaS aesthetic:
- **Depth**: Soft shadows and subtle borders instead of heavy outlines.
- **Typography**: Optimized for readability using modern sans-serif stacks.
- **Feedback**: Standardized confirmation dialogs and toast notifications (Sonner) for all destructive actions.
- **Revalidation**: Intelligent cache invalidation ensures the UI is always in sync with the database.

---
Built with ❤️ by [Ahmed Hamdy](https://github.com/AhmedHamdy434)

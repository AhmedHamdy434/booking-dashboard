# 📊 Admin Dashboard

The Admin Dashboard is the central command hub for the barbershop business. Designed specifically for owners and managers, it provides a comprehensive bird's-eye view of operations and total control over daily scheduling. It is engineered to be incredibly fast, featuring a modern, SaaS-style aesthetic.

## 🚀 Capabilities & Features (What can you do?)

### 1. Booking Management
- **Main Interface**: Displays an instant, chronologically sorted list of all upcoming appointments.
- **Filtering System**: Allows admins to quickly filter bookings (e.g., viewing only `Pending` bookings to ensure rapid decision-making).
- **Status Controls (Actions)**:
  - **Approve**: Upgrades the booking status to `Confirmed`, officially locking in the appointment for the customer.
  - **Reject**: Cancels the booking, changing its status to `Cancelled` and freeing up the time slot.
  - **Complete**: Once the haircut/service is finished, the admin marks it as `Completed`, which factors it into the daily revenue calculations.

### 2. Barber & Staff Management (CRUD)
- **Add/Edit Personnel**: Input new barbers into the system, including their names, profile pictures, and specific specializations.
- **Schedule Management**: Define the exact working days and active hours for each barber (e.g., works from 10:00 AM to 8:00 PM, with Fridays off).
- **Availability Toggle**: Temporarily activate or deactivate a barber (due to sick leave or vacation) to instantly stop the system from accepting new bookings for them.

### 3. Service Catalog Management (CRUD)
- **Catalog Control**: Dynamically add new services (e.g., Moroccan Bath, Blow-dry, etc.).
- **Precise Pricing & Timing**: Set the exact price and, most importantly, **duration in minutes** for each service. *Crucially, changing a service's duration here instantly updates the slot generation math in both the Mobile App and the Website.*

### 4. Smart Calendar Scheduling
- View all appointments mapped onto a visual "Calendar" (Month, Week, Day views) powered by `FullCalendar`, making it incredibly easy to spot gaps, overlaps, and daily traffic at a glance.

### 5. Quick Analytics & Stats
- Track the total number of bookings for the current day.
- View projected daily income and revenue.
- Identify top-performing metrics, such as "Most Requested Services" and "Busiest Barbers."

## 🛠️ Tech Stack & Architecture

The dashboard is built with an absolute focus on speed and secure data mutation:
- **Framework**: [React 19](https://react.dev/) bundled with [Vite 8](https://vitejs.dev/) for a lightning-fast Single Page Application (SPA) experience.
- **Form Management**: Utilizes `react-hook-form` paired with `Zod` for extremely strict schema validation before any data touches the database.
- **Data Fetching & Mutation**: Relies on `TanStack Query v5` to provide instant UI updates (Optimistic Updates) and automatic refetching when an admin approves or modifies a booking.
- **UI Architecture**: Constructed using [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/) primitives to deliver an unparalleled, accessible user experience (featuring interactive data tables, complex modals, and toast notifications via `sonner`).
- **Calendar Engine**: Integrates [FullCalendar](https://fullcalendar.io/) to handle complex time-grid rendering.

## ⚙️ Developer Setup Guide

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Configuration**:
   Create a `.env` file in the root directory and supply your Supabase connection strings:
   ```env
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

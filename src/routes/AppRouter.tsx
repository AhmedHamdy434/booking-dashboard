import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';

const LoginPage = lazy(() => import('@/features/auth/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const ServicesPage = lazy(() => import('@/features/services/ServicesPage'));
const NewServicePage = lazy(() => import('@/features/services/NewServicePage'));
const EditServicePage = lazy(() => import('@/features/services/EditServicePage'));
const SchedulePage = lazy(() => import('@/features/schedule/SchedulePage'));
const BookingsPage = lazy(() => import('@/features/bookings/BookingsPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-[50vh]">
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading page...</p>
    </div>
  </div>
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/services/new" element={<NewServicePage />} />
              <Route path="/services/edit/:id" element={<EditServicePage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/bookings" element={<BookingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

import { useBookings, useUpdateBookingStatus } from '@/features/bookings/hooks/useBookings';
import { useServices } from '@/features/services/hooks/useServices';
import { useBarbers } from '@/features/barbers/hooks/useBarbers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Settings, Users, ClipboardList, Scissors, AlertCircle, Check, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, description, icon: Icon }: StatCardProps) => (
  <Card className="border-slate-200/60 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold tracking-tight text-foreground">{value}</div>
      <div className="mt-1 flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{description}</span>
      </div>
    </CardContent>
  </Card>
);


export const DashboardPage = () => {
  const { data: bookings, isLoading: isLoadingBookings } = useBookings();
  const { data: services, isLoading: isLoadingServices } = useServices();
  const { data: barbers, isLoading: isLoadingBarbers } = useBarbers();
  const { mutate: updateStatus, isPending } = useUpdateBookingStatus();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const pendingBookings = bookings?.filter(b => b.status === 'pending') || [];

  const stats: StatCardProps[] = [
    {
      title: 'Pending Approvals',
      value: isLoadingBookings ? '...' : pendingBookings.length,
      description: 'require your attention',
      icon: AlertCircle,
    },
    {
      title: 'Total Bookings',
      value: isLoadingBookings ? '...' : bookings?.length || 0,
      description: 'upcoming bookings',
      icon: ClipboardList,
    },
    {
      title: 'Services Offered',
      value: isLoadingServices ? '...' : services?.length || 0,
      description: 'active services',
      icon: Settings,
    },
    {
      title: 'Active Barbers',
      value: isLoadingBarbers ? '...' : barbers?.length || 0,
      description: 'active staff members',
      icon: Scissors,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your bookings today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-slate-200/60 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Needs Approval</CardTitle>
            <Link to="/bookings" className="text-xs text-primary hover:underline font-medium">View all</Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingBookings.length === 0 ? (
                 <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border border-dashed rounded-xl bg-slate-50/50 dark:bg-slate-900/10">
                    <Check className="mb-4 h-8 w-8 text-emerald-500/50" />
                    <p className="text-sm font-medium text-foreground">All caught up!</p>
                    <p className="text-xs">No pending bookings to approve.</p>
                 </div>
              ) : (
                pendingBookings.slice(0, 4).map((booking) => {
                  const isUpdating = isPending && updatingId === booking.id;
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:shadow-sm transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                          <AlertCircle size={18} />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold text-foreground">
                            {booking.services?.name || 'Unknown Service'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.date} at {booking.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          onClick={() => {
                            setUpdatingId(booking.id);
                            updateStatus({ id: booking.id, status: 'confirmed' });
                          }}
                          disabled={isUpdating}
                        >
                          {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check size={16} />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => {
                            setUpdatingId(booking.id);
                            updateStatus({ id: booking.id, status: 'cancelled' });
                          }}
                          disabled={isUpdating}
                        >
                          {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X size={16} />}
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 border-slate-200/60 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-sm text-muted-foreground mb-4">
              Common tasks to manage your business.
            </p>
            {/* Quick Actions Placeholders */}
            <div className="grid gap-2">
               <Link to="/schedule" className="flex items-center gap-3 rounded-lg border border-slate-200/60 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 cursor-pointer transition-colors shadow-sm active:scale-[0.98]">
                  <div className="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 p-2 rounded-md">
                     <CalendarDays size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">View Schedule</p>
                  </div>
               </Link>
               <Link to="/services/new" className="flex items-center gap-3 rounded-lg border border-slate-200/60 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 cursor-pointer transition-colors shadow-sm active:scale-[0.98]">
                  <div className="bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400 p-2 rounded-md">
                     <Settings size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Add New Service</p>
                  </div>
               </Link>
               <Link to="/barbers" className="flex items-center gap-3 rounded-lg border border-slate-200/60 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 cursor-pointer transition-colors shadow-sm active:scale-[0.98]">
                  <div className="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 p-2 rounded-md">
                     <Scissors size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Manage Barbers</p>
                  </div>
               </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

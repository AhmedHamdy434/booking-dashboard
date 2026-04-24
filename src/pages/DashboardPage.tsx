import { useBookings } from '@/features/bookings/hooks/useBookings';
import { useServices } from '@/features/services/hooks/useServices';
import { useBarbers } from '@/features/barbers/hooks/useBarbers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Settings, Users, ClipboardList, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  const stats: StatCardProps[] = [
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
      title: 'Active Users',
      value: isLoadingBookings ? '...' : new Set(bookings?.map(b => b.user_id)).size || 0,
      description: 'unique customers',
      icon: Users,
    },
    {
      title: 'Total Barbers',
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
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {!bookings || bookings.length === 0 ? (
                 <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                    <ClipboardList className="mb-4 h-10 w-10 text-muted-foreground/40" />
                    <p className="text-sm font-medium">No recent bookings</p>
                    <p className="text-xs">When customers book, they'll appear here.</p>
                 </div>
              ) : (
                bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-start gap-4 group">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <CalendarDays size={18} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none text-foreground">
                        {booking.services?.name || 'Unknown Service'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.date} at {booking.time}
                      </p>
                    </div>
                  </div>
                ))
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

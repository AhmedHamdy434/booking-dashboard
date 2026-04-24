import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  LogOut,
  ClipboardList,
  Tent,
  CalendarDays,
  Scissors,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const SidebarItem = ({ to, icon: Icon, label }: SidebarItemProps) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50'
      )
    }
  >
    <Icon className={cn("h-4 w-4 shrink-0 transition-colors duration-200")} />
    <span>{label}</span>
  </NavLink>
);

export const Sidebar = () => {
  const { logout } = useAuth();

  const menuItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/bookings', icon: ClipboardList, label: 'Bookings' },
    { to: '/schedule', icon: CalendarDays, label: 'Schedule' },
    { to: '/barbers', icon: Scissors, label: 'Barbers' },
    { to: '/barbers/availability', icon: Clock, label: 'Availability' },
    { to: '/services', icon: Settings, label: 'Services' },
  ];

  return (
    <aside className="flex h-full w-full flex-col bg-transparent">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Tent className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Booking<span className="text-primary">App</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-4">
        <div className="mb-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
          Main Menu
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <SidebarItem key={item.to} {...item} />
          ))}
        </nav>
      </div>

      <div className="p-4 mt-auto">
        <ConfirmDialog
          title="Log out"
          description="Are you sure you want to log out? You will need to sign in again to access the dashboard."
          onConfirm={() => logout()}
          confirmText="Log out"
          variant="destructive"
          trigger={
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </Button>
          }
        />
      </div>
    </aside>
  );
};

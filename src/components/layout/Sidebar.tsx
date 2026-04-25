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
import { useTranslation } from 'react-i18next';

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
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )
    }
  >
    <Icon className={cn("h-4 w-4 shrink-0 transition-colors duration-200")} />
    <span>{label}</span>
  </NavLink>
);

export const Sidebar = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const menuItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('sidebar.dashboard') },
    { to: '/bookings', icon: ClipboardList, label: t('sidebar.bookings') },
    { to: '/schedule', icon: CalendarDays, label: t('sidebar.schedule') },
    { to: '/barbers', icon: Scissors, label: t('sidebar.barbers') },
    { to: '/barbers/availability', icon: Clock, label: t('sidebar.availability') },
    { to: '/services', icon: Settings, label: t('sidebar.services') },
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
          {t('sidebar.main_menu')}
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <SidebarItem key={item.to} {...item} />
          ))}
        </nav>
      </div>

      <div className="p-4 mt-auto">
        <ConfirmDialog
          title={t('common.logout')}
          description={t('common.logout_description')}
          onConfirm={() => logout()}
          confirmText={t('common.logout')}
          variant="destructive"
          trigger={
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
              <span>{t('common.logout')}</span>
            </Button>
          }
        />
      </div>
    </aside>
  );
};

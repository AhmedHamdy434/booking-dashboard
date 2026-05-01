import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { ModeToggle } from '@/features/theme/components/ModeToggle';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuth();

  const getPageInfo = (pathname: string) => {
    switch (pathname) {
      case '/dashboard':
        return { title: t('navbar.dashboard'), path: [{ name: t('navbar.overview') }] };
      case '/services':
        return { title: t('navbar.services'), path: [{ name: t('navbar.services_mgmt') }] };
      case '/services/new':
        return { title: t('navbar.services'), path: [{ name: t('navbar.services'), link: '/services' }, { name: t('navbar.add_new') }] };
      case '/bookings':
        return { title: t('navbar.bookings'), path: [{ name: t('navbar.bookings_mgmt') }] };
      case '/schedule':
        return { title: t('navbar.bookings'), path: [{ name: t('navbar.bookings'), link: '/bookings' }, { name: t('schedule.title') }] };
      case '/barbers':
        return { title: t('barbers.title'), path: [{ name: t('barbers.title') }] };
      case '/barbers/availability':
        return { title: t('barbers.title'), path: [{ name: t('barbers.title'), link: '/barbers' }, { name: t('availability.title') }] };
      default:
        return { title: t('navbar.admin_panel'), path: [] };
    }
  };

  const { title, path } = getPageInfo(location.pathname);

  return (
    <>
      <div className="flex flex-1 items-center gap-x-4 h-full">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">{title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {path.map((item, index) => (
              <div key={index} className="flex items-center">
                <BreadcrumbSeparator className="rtl:rotate-180" />
                <BreadcrumbItem>
                  {item.link ? (
                    <BreadcrumbLink asChild>
                      <Link to={item.link}>{item.name}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.name}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4 h-full">
        <LanguageSwitcher />
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border shadow-sm">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{t('navbar.administrator')}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="me-2 h-4 w-4" />
              <span>{t('navbar.profile')}</span>
            </DropdownMenuItem>
            <ConfirmDialog
              title={t('navbar.logout_title')}
              description={t('navbar.logout_desc')}
              onConfirm={() => logout()}
              confirmText={t('navbar.logout_title')}
              cancelText={t('common.cancel')}
              variant="destructive"
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                  <LogOut className="me-2 h-4 w-4" />
                  <span>{t('navbar.logout_title')}</span>
                </DropdownMenuItem>
              }
            />

          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

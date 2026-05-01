import { useTranslation } from "react-i18next";
import { AlertCircle, ClipboardList, Settings, Scissors } from "lucide-react";
import { StatCard } from "./StatCard";
import { useBookings } from "@/features/bookings/hooks/useBookings";
import { useServices } from "@/features/services/hooks/useServices";
import { useBarbers } from "@/features/barbers/hooks/useBarbers";
import { StatsGridSkeleton } from "./StatsGridSkeleton";

export const StatsGrid = () => {
  const { t } = useTranslation();
  const { data: bookings, isLoading: isLoadingBookings } = useBookings();
  const { data: services, isLoading: isLoadingServices } = useServices();
  const { data: barbers, isLoading: isLoadingBarbers } = useBarbers();

  const isAnyLoading = isLoadingBookings || isLoadingServices || isLoadingBarbers;

  if (isAnyLoading) {
    return <StatsGridSkeleton />;
  }

  const pendingCount = bookings?.filter((b) => b.status === "pending").length || 0;

  const stats = [
    {
      title: t("dashboard.stats_pending_approvals"),
      value: pendingCount,
      description: t("dashboard.stats_attention_required"),
      icon: AlertCircle,
    },
    {
      title: t("dashboard.stats_total_bookings"),
      value: bookings?.length || 0,
      description: t("dashboard.stats_upcoming_bookings"),
      icon: ClipboardList,
    },
    {
      title: t("dashboard.stats_services_offered"),
      value: services?.length || 0,
      description: t("dashboard.stats_active_services"),
      icon: Settings,
    },
    {
      title: t("dashboard.stats_active_barbers"),
      value: barbers?.length || 0,
      description: t("dashboard.stats_active_staff"),
      icon: Scissors,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

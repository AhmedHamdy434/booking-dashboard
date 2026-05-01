import { useTranslation } from "react-i18next";
import { StatsGrid } from "./components/StatsGrid";
import { PendingBookings } from "./components/PendingBookings";
import { QuickActions } from "./components/QuickActions";


export const DashboardPage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t("dashboard.title")}
        </h1>
        <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
      </div>

      <StatsGrid />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <PendingBookings />
        <QuickActions />
      </div>
    </div>
  );
};

export default DashboardPage;

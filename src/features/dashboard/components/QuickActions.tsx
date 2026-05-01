import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Settings, Scissors } from "lucide-react";

export const QuickActions = () => {
  const { t } = useTranslation();

  const actions = [
    {
      to: "/schedule",
      icon: CalendarDays,
      label: t("dashboard.action_view_schedule"),
      colorClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    {
      to: "/services/new",
      icon: Settings,
      label: t("dashboard.action_add_service"),
      colorClass: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400",
    },
    {
      to: "/barbers",
      icon: Scissors,
      label: t("dashboard.action_manage_barbers"),
      colorClass: "bg-primary/10 text-primary",
    },
  ];

  return (
    <Card className="col-span-3 border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>{t("dashboard.quick_actions")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p className="text-sm text-muted-foreground mb-4">
          {t("dashboard.quick_actions_desc")}
        </p>
        <div className="grid gap-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.to}
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-accent cursor-pointer transition-colors shadow-sm active:scale-[0.98]"
              >
                <div className={`${action.colorClass} p-2 rounded-md`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">{action.label}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

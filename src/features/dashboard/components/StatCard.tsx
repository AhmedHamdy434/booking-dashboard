import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import {type ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number | ReactNode;
  description: string;
  icon: LucideIcon;
}

export const StatCard = ({ title, value, description, icon: Icon }: StatCardProps) => (
  <Card className="border-border/50 shadow-sm transition-all hover:shadow-md">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold tracking-tight text-foreground min-h-[36px] flex items-center">
        {value}
      </div>
      <div className="mt-1 flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{description}</span>
      </div>
    </CardContent>
  </Card>
);

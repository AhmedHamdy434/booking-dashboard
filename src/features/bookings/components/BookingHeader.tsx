import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BookingHeader = () => {
    const { t } = useTranslation();
    
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('bookings.title')}</h1>
          <p className="text-muted-foreground">
            {t('bookings.subtitle')}
          </p>
        </div>
        <Button asChild>
          <Link to="/bookings/new">
            <Plus className="me-2 h-4 w-4" /> {t('common.new_booking')}
          </Link>
        </Button>

      </div>
    );
};

export default BookingHeader;
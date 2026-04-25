import { BookingsList } from "./components/BookingsList";
import { BookingFilters } from "./components/BookingFilters";
import BookingHeader from "./components/BookingHeader";

export const BookingsPage = () => {
  return (
    <div className="space-y-6">
<BookingHeader />
      <div className="mt-6 flex flex-col gap-6">
        <BookingFilters />
        <BookingsList />
      </div>
    </div>
  );
};

export default BookingsPage;

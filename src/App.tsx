import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AppRouter } from './routes/AppRouter';
import { useTranslation } from 'react-i18next';
import { DirectionProvider } from './components/ui/direction';

function App() {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  return (
    <QueryClientProvider client={queryClient}>
      <DirectionProvider dir={direction}>
      <AppRouter />
      </DirectionProvider>
    </QueryClientProvider>
  );
}

export default App;

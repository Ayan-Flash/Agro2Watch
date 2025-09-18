import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageContext';

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === 'en' ? 'ml' : 'en')}
      className="font-medium"
    >
      {language === 'en' ? 'മലയാളം' : 'English'}
    </Button>
  );
};
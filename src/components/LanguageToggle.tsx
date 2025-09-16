import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { languageOptions } from '@/lib/translations';

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="font-medium flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {languageOptions.find(l => l.code === language)?.nativeName || 'English'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languageOptions.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => {
              setLanguage(lang.code as any);
              try { localStorage.setItem('agro_lang', lang.code); } catch {}
            }}
            className={`${language === lang.code ? 'bg-green-50' : ''} flex justify-between`}
          >
            <span>{lang.name}</span>
            <span className="text-sm text-gray-500">{lang.nativeName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t('selectLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('en')}>
          <div className="flex items-center gap-2">
            <span className={language === 'en' ? 'font-semibold' : ''}>
              {t('english')}
            </span>
            {language === 'en' && <span className="text-primary">✓</span>}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('hi')}>
          <div className="flex items-center gap-2">
            <span className={language === 'hi' ? 'font-semibold' : ''}>
              {t('hindi')}
            </span>
            {language === 'hi' && <span className="text-primary">✓</span>}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('es')}>
          <div className="flex items-center gap-2">
            <span className={language === 'es' ? 'font-semibold' : ''}>
              {t('spanish')}
            </span>
            {language === 'es' && <span className="text-primary">✓</span>}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('fr')}>
          <div className="flex items-center gap-2">
            <span className={language === 'fr' ? 'font-semibold' : ''}>
              {t('french')}
            </span>
            {language === 'fr' && <span className="text-primary">✓</span>}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'es' | 'fr';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, Record<string, string>>;
  t: (key: string) => string;
};

const defaultTranslations = {
  en: {
    home: 'Home',
    services: 'Services',
    howItWorks: 'How It Works',
    about: 'About',
    contact: 'Contact',
    patientLogin: 'Patient Login',
    providerLogin: 'Provider Login',
    startYourVisit: 'Start Your Visit',
    english: 'English',
    hindi: 'Hindi',
    spanish: 'Spanish',
    french: 'French',
    selectLanguage: 'Select Language',
    telehealth: 'Telehealth reimagined for better care',
    healthcareAtYour: 'Healthcare at Your',
    fingertips: 'Fingertips',
    connectWithDescription: 'Connect with board-certified healthcare professionals through secure video consultations. Get diagnosed, treated, and prescribed medication—all from the comfort of your home.'
  },
  hi: {
    home: 'होम',
    services: 'सेवाएं',
    howItWorks: 'यह कैसे काम करता है',
    about: 'हमारे बारे में',
    contact: 'संपर्क करें',
    patientLogin: 'रोगी लॉगिन',
    providerLogin: 'प्रदाता लॉगिन',
    startYourVisit: 'अपनी यात्रा शुरू करें',
    english: 'अंग्रेज़ी',
    hindi: 'हिंदी',
    spanish: 'स्पेनिश',
    french: 'फ्रेंच',
    selectLanguage: 'भाषा चुनें',
    telehealth: 'बेहतर देखभाल के लिए टेलीहेल्थ का पुनर्कल्पना',
    healthcareAtYour: 'आपकी स्वास्थ्य देखभाल',
    fingertips: 'उंगलियों पर',
    connectWithDescription: 'सुरक्षित वीडियो परामर्श के माध्यम से बोर्ड-प्रमाणित स्वास्थ्य देखभाल पेशेवरों से जुड़ें। निदान, उपचार और दवा की पर्ची प्राप्त करें - सभी आपके घर के आराम से।'
  },
  es: {
    home: 'Inicio',
    services: 'Servicios',
    howItWorks: 'Cómo Funciona',
    about: 'Acerca de',
    contact: 'Contacto',
    patientLogin: 'Acceso Paciente',
    providerLogin: 'Acceso Proveedor',
    startYourVisit: 'Comience su Visita',
    english: 'Inglés',
    hindi: 'Hindi',
    spanish: 'Español',
    french: 'Francés',
    selectLanguage: 'Seleccionar Idioma',
    telehealth: 'Telesalud reinventada para una mejor atención',
    healthcareAtYour: 'Atención médica en sus',
    fingertips: 'manos',
    connectWithDescription: 'Conéctese con profesionales de la salud certificados a través de consultas de video seguras. Obtenga diagnóstico, tratamiento y recetas médicas, todo desde la comodidad de su hogar.'
  },
  fr: {
    home: 'Accueil',
    services: 'Services',
    howItWorks: 'Comment Ça Marche',
    about: 'À Propos',
    contact: 'Contact',
    patientLogin: 'Connexion Patient',
    providerLogin: 'Connexion Prestataire',
    startYourVisit: 'Commencer Votre Visite',
    english: 'Anglais',
    hindi: 'Hindi',
    spanish: 'Espagnol',
    french: 'Français',
    selectLanguage: 'Choisir la Langue',
    telehealth: 'Télésanté réinventée pour de meilleurs soins',
    healthcareAtYour: 'Soins de santé à portée',
    fingertips: 'de main',
    connectWithDescription: 'Connectez-vous avec des professionnels de la santé certifiés grâce à des consultations vidéo sécurisées. Obtenez un diagnostic, un traitement et des médicaments prescrits, le tout dans le confort de votre domicile.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState(defaultTranslations);

  // Load language preference from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'hi', 'es', 'fr'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

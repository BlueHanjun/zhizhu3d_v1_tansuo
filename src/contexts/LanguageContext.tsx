import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('zh-CN');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  // 加载语言资源
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationModule = await import(`../locales/${language}.json`);
        setTranslations(translationModule.default || translationModule);
      } catch (error) {
        console.error(`Failed to load ${language} translations:`, error);
        // 如果加载失败，尝试加载默认语言
        if (language !== 'zh-CN') {
          try {
            const fallbackModule = await import('../locales/zh-CN.json');
            setTranslations(fallbackModule.default || fallbackModule);
          } catch (fallbackError) {
            console.error('Failed to load fallback translations:', fallbackError);
          }
        }
      }
    };

    loadTranslations();
  }, [language]);

  // 翻译函数
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // 返回键名作为默认值
      }
    }

    if (typeof value === 'string' && params) {
      return Object.entries(params).reduce(
        (str, [paramKey, paramValue]) => str.replace(`{{${paramKey}}}`, String(paramValue)),
        value
      );
    }

    return value || key;
  };

  // 保存语言设置到localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
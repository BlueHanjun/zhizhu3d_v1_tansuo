import { useLanguage } from "@/contexts/LanguageContext";

const ContactPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-24 text-white text-center flex items-center justify-center min-h-screen">
      <div className="space-y-4 text-2xl">
        <p>
          <span className="font-semibold">{t('contact.email')}:</span> hezuo@zhizhu3d.com
        </p>
        <p className="text-lg text-gray-500 text-right">{t('contact.cooperation')}</p>
      </div>
    </div>
  );
};

export default ContactPage;
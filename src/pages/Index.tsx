import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t, language } = useLanguage();
  return (
    <div className="w-full text-white relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-animation"></div>
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative flex h-[60vh] items-center justify-center overflow-hidden">
          
          <div className="relative z-10 flex flex-row items-center justify-center w-full">
            <img src={language === 'en-US' ? '/shouyelogoslogn_en.png' : '/shouyelogoslogn.png'} alt="ZHIZHU3D Logo" className="h-[260px] w-[1100px] object-contain -ml-20" />
          </div>
        </section>

        {/* Product Introduction Section */}
        <div className="bg-black py-2 max-w-screen-xl mx-auto rounded-t-2xl shadow-lg" style={{ boxShadow: '0 -10px 31px 3px rgba(199, 68, 68, 0.3)' }}>
          <section className="py-16 sm:py-24 mt-4">
            <div className="container mx-auto px-4 md:px-6">
              <h2 className="mb-16 text-center text-2xl font-normal" style={{ letterSpacing: '20%' }}>
                {t('index.productIntro')}
              </h2>
              <div className="grid grid-cols-1 gap-12 md:grid-cols-3 justify-items-center">
                <ProductCard
                  title={t('index.feature1')}
                  description={t('index.feature1Desc')}
                  actionText={t('index.tryDemo')}
                />
                <ProductCard
                  title={t('index.feature2')}
                  description={t('index.feature2Desc')}
                  actionText={t('index.tryDemo')}
                />
                <ProductCard
                  title={t('index.feature3')}
                  description={t('index.feature3Desc')}
                  actionText={t('index.scanDemo')}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ title, description, actionText }: { title: string; description: string; actionText: string }) => {
  const navigate = useNavigate();

  const handleDemoClick = () => {
    // 跳转到demo页面
    navigate('/dashboard/demo#automatic-lighting');
  };

  return (
    <div className="relative flex flex-col items-start pl-6 max-w-xs">
      <h3 className="mb-3 text-xl font-normal text-white relative before:content-[''] before:absolute before:w-0.5 before:h-4 before:bg-white before:-left-4 before:top-1.5">
        {title}
      </h3>
      <p className="mb-4 flex-grow font-normal" style={{ color: '#BBBBBB', width: '32ch', opacity: 0.8 }}>{description}</p>
      <Button variant="link" className="p-0 font-normal items-center" style={{ color: '#BBBBBB', opacity: 0.8 }} onClick={handleDemoClick}>
        {actionText} <ArrowRight className="ml-0 h-4 w-4" style={{ marginTop: '1px' }} />
      </Button>
    </div>
  );
};

export default Index;
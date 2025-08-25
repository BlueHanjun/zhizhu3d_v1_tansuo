import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  return (
    <div className="w-full text-white">
      {/* Hero Section */}
      <section className="relative flex h-[60vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-animation"></div>
        
        <div className="relative z-10 flex flex-row items-center justify-center w-full">
          <img src="/shouyelogoslogn.png" alt="ZHIZHU3D Logo" className="h-[240px] w-[1024px] object-contain -ml-20" />
        </div>
      </section>

      {/* Product Introduction Section */}
      <section className="py-16 sm:py-24 mt-4">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-16 text-center text-2xl font-normal" style={{ letterSpacing: '20%' }}>
            产品介绍
          </h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 justify-items-center">
            <ProductCard
              title="空间灯具点位智能生成"
              description="通过AI技术，通过一张户型图或者CAD，根据需求（情景、风格等）自动生成灯具点位图。"
              actionText="体验Demo"
            />
            <ProductCard
              title="全屋WiFi信号强度仿真"
              description="在户型中不同位置放置不同强度的WiFi放射源，仿真系统自动模拟全屋WiFi强度衰减。"
              actionText="体验Demo"
            />
            <ProductCard
              title="照明知识Agent"
              description="一个通过对话就可以获取照明行业专业知识的小工具。"
              actionText="扫码体验"
            />
          </div>
        </div>
      </section>
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
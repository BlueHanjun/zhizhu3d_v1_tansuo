import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="w-full text-white">
      {/* Hero Section */}
      <section className="relative flex h-[60vh] items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/shouyeditu.png')" }}
        ></div>
        
        <div className="relative z-10 flex flex-row items-center gap-8">
          <img src="/logo.png" alt="ZHIZHU3D Logo" className="h-32 w-32" />
          <div className="text-left">
            <h1 className="text-5xl font-bold tracking-tighter">ZHIZHU3D</h1>
            <p className="mt-4 text-lg text-gray-300">致力于空间智能技术探索</p>
          </div>
        </div>
      </section>

      {/* Product Introduction Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
            产品介绍
          </h2>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <ProductCard
              title="空间灯具点位智能生成"
              description="通过AI技术，通过一键产出或者CAD，根据需求（情景、风格等）自动生成灯具点位图。"
              actionText="体验Demo"
            />
            <ProductCard
              title="全屋WiFi信号强度仿真"
              description="在户型中不同位置放置不同强度的WiFi放射源，仿真系统自动模块全屋WiFi强度衰减。"
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

const ProductCard = ({ title, description, actionText }: { title: string; description: string; actionText: string }) => (
  <div className="relative flex flex-col items-start pl-6">
    <div className="absolute left-0 top-1 h-10 w-0.5 bg-zinc-700" />
    <h3 className="mb-3 text-xl font-semibold text-white relative before:content-[''] before:absolute before:w-2 before:h-px before:bg-white before:-left-7 before:top-1/2">
      {title}
    </h3>
    <p className="mb-4 text-gray-400 flex-grow">{description}</p>
    <Button variant="link" className="p-0 text-gray-300 hover:text-white">
      {actionText} <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  </div>
);

export default Index;
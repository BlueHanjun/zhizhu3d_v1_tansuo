import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showError, showSuccess } from "@/utils/toast";
import DemoCanvas from "@/components/dashboard/DemoCanvas";
import type { Shape } from "@/components/dashboard/DemoCanvas";

const roomTypes = ["客厅", "餐厅", "卧室", "厨房", "卫生间", "走廊"];
const lightingStyles = ["无主灯", "主灯"];

const DemoPage = () => {
  const [room, setRoom] = useState<Shape | null>(null);
  const [furnitures, setFurnitures] = useState<Shape[]>([]);
  const [roomType, setRoomType] = useState("客厅");
  const [lightingStyle, setLightingStyle] = useState("无主灯");
  const [generatedJson, setGeneratedJson] = useState("");

  const handleGenerate = () => {
    if (!room) {
      showError("请先绘制房间");
      return;
    }

    const scale = 10; // 1px = 10mm

    // Room contour
    const roomContour = [
      [0, 0],
      [room.width * scale, 0],
      [room.width * scale, room.height * scale],
      [0, room.height * scale],
      [0, 0],
    ];
    const contourStr = `[${roomContour.map(p => `(${p[0].toFixed(0)},${p[1].toFixed(0)})`).join(',')}]`;

    // Furnitures
    let furnituresStr = "";
    furnitures.forEach(f => {
      // Transform coordinates: canvas top-left to room bottom-left
      const newX = f.x - room.x;
      const newY = (room.y + room.height) - (f.y + f.height);

      const furnitureContour = [
        [newX * scale, (newY + f.height) * scale], // Top-left
        [(newX + f.width) * scale, (newY + f.height) * scale], // Top-right
        [(newX + f.width) * scale, newY * scale], // Bottom-right
        [newX * scale, newY * scale], // Bottom-left
        [newX * scale, (newY + f.height) * scale], // Top-left (close path)
      ];
      
      furnituresStr += `${f.name}:[${furnitureContour.map(p => `(${p[0].toFixed(0)},${p[1].toFixed(0)})`).join(',')}],`;
    });

    const result = {
      contour: contourStr,
      furnitures: furnituresStr,
      style: lightingStyle,
      type: roomType,
    };

    setGeneratedJson(JSON.stringify(result, null, 2));
    showSuccess("数据生成成功！");
  };

  return (
    <div className="text-white h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold">Demo 体验</h1>
        <p className="text-gray-400 mt-2">Demo体验也会消耗您的余额。</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">自动布灯</h2>
        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm text-gray-400">房间类型</label>
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger className="w-[180px] bg-[#1C1C1C] border-zinc-700">
                <SelectValue placeholder="选择房间类型" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C1C] border-zinc-700 text-white">
                {roomTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-400">布灯风格</label>
            <Select value={lightingStyle} onValueChange={setLightingStyle}>
              <SelectTrigger className="w-[180px] bg-[#1C1C1C] border-zinc-700">
                <SelectValue placeholder="选择布灯风格" />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C1C] border-zinc-700 text-white">
                {lightingStyles.map(style => <SelectItem key={style} value={style}>{style}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-8 mt-6">
        <div className="flex-1 h-[60vh] flex items-center justify-center">
          <DemoCanvas 
            room={room} 
            setRoom={setRoom} 
            furnitures={furnitures} 
            setFurnitures={setFurnitures} 
          />
        </div>
        <div className="flex flex-col items-center gap-4">
          <Button onClick={handleGenerate} className="bg-white text-black hover:bg-gray-200">确认生成</Button>
        </div>
        <div className="w-[400px] h-[60vh] bg-[#1C1C1C] rounded-lg p-4 border border-zinc-800">
          <pre className="text-sm text-gray-300 h-full overflow-auto whitespace-pre-wrap">
            <code>{generatedJson}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
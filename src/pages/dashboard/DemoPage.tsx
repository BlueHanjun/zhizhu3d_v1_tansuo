import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showError, showSuccess } from "@/utils/toast";
import DemoCanvas from "@/components/dashboard/DemoCanvas";
import type { Shape } from "@/components/dashboard/DemoCanvas";
import { CozeAPI } from '@coze/api';

const roomTypes = ["客厅", "餐厅", "卧室", "厨房", "卫生间", "走廊"];
const lightingStyles = ["无主灯", "主灯"];

const DemoPage = () => {
  const [room, setRoom] = useState<Shape | null>(null);
  const [furnitures, setFurnitures] = useState<Shape[]>([]);
  const [roomType, setRoomType] = useState("客厅");
  const [lightingStyle, setLightingStyle] = useState("无主灯");
  const [generatedJson, setGeneratedJson] = useState("");
  const [lightingImageUrl, setLightingImageUrl] = useState("");
  const [designIntent, setDesignIntent] = useState("");
  const [lightPositions, setLightPositions] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestTime, setRequestTime] = useState(0);

  const handleGenerate = async () => {
    if (!room) {
      showError("请先绘制房间");
      return;
    }

    // Start timing
    setLoading(true);
    const startTime = Date.now();
    setRequestTime(0);
    
    // Set up interval to update timer every 100ms
    const timerInterval = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;
      setRequestTime(parseFloat(elapsed.toFixed(2)));
    }, 100);

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

    try {
      const apiClient = new CozeAPI({
        token: 'cztei_hkgpCGwCw1AQJ4HkLhx0L28GPMLMBZ1pM36oCIx5a05hFVratQWb5zkiuELjWJ0XH',
        baseURL: 'https://api.coze.cn'
      });
      
      const res = await apiClient.workflows.runs.create({
        workflow_id: '7536895894852960302',
        parameters: {
          contour: contourStr,
          furnitures: furnituresStr,
          style: lightingStyle,
          type: roomType
        }
      });

      // Parse the response data
      const responseData = typeof res === 'string' ? JSON.parse(res) : res;
      
      setGeneratedJson(JSON.stringify(res, null, 2));
      
      // Extract data from the response
      if (responseData.data) {
        const data = typeof responseData.data === 'string' ? JSON.parse(responseData.data) : responseData.data;
        
        // Set lighting image URL
        setLightingImageUrl(data.lighting2D?.download_url || "");
        
        // Set design intent (output) - parsing from content
        if (data.content) {
          // Split content by newlines and find the output section
          const sections = data.content.split('\n');
          for (const section of sections) {
            if (section.startsWith('output：')) {
              setDesignIntent(section.substring(8).trim()); // Remove 'output：' prefix
              break;
            }
          }
        }
        
        // Set light positions (location) - parsing from content
        if (data.content) {
          // Split content by newlines and find the location section
          const sections = data.content.split('\n');
          for (const section of sections) {
            if (section.startsWith('location：')) {
              setLightPositions(section.substring(10).trim()); // Remove 'location：' prefix
              break;
            }
          }
        }
      } else {
        // Handle case where data is directly in the response (like in the user's example)
        // The user's example shows the data directly in the response, not nested in a data field
        setLightingImageUrl(responseData.lighting2D?.download_url || "");
        
        // Set design intent (output) - parsing from content
        if (responseData.content) {
          // Split content by newlines and find the output section
          const sections = responseData.content.split('\n');
          for (const section of sections) {
            if (section.startsWith('output：')) {
              setDesignIntent(section.substring(8).trim()); // Remove 'output：' prefix
              break;
            }
          }
        }
        
        // Set light positions (location) - parsing from content
        if (responseData.content) {
          // Split content by newlines and find the location section
          const sections = responseData.content.split('\n');
          for (const section of sections) {
            if (section.startsWith('location：')) {
              setLightPositions(section.substring(10).trim()); // Remove 'location：' prefix
              break;
            }
          }
        }
      }
      
      showSuccess("API调用成功！");
    } catch (error) {
      console.error('Error calling Coze API:', error);
      showError("API调用失败: " + (error as Error).message);
    } finally {
      // Clear interval and finalize timing
      clearInterval(timerInterval);
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      setRequestTime(parseFloat(duration.toFixed(2)));
      setLoading(false);
    }
  };

  return (
    <div className="text-white h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold">Demo 体验</h1>
        <p className="text-gray-400 mt-2">Demo体验也会消耗您的余额。</p>
      </div>

      <div className="mt-8" id="automatic-lighting">
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

      <div className="flex-1 flex flex-col gap-6 mt-6 h-full">
        <div className="h-[60vh] flex items-center justify-center w-full max-w-6xl">
          <DemoCanvas 
            room={room} 
            setRoom={setRoom} 
            furnitures={furnitures} 
            setFurnitures={setFurnitures} 
          />
        </div>
        <div className="flex justify-start items-center" style={{ marginLeft: '522px' }}>
          <Button 
            onClick={handleGenerate} 
            className="bg-white text-black hover:bg-gray-200"
            disabled={loading}
          >
            {loading ? `请求中... (${requestTime.toFixed(2)}s)` : "确认生成"}
          </Button>
        </div>
        {/* Lighting Image Display */}
        {lightingImageUrl && (
          <div className="w-full bg-[#1C1C1C] rounded-lg p-4 border border-zinc-800 max-w-6xl">
            <h3 className="text-lg font-semibold mb-2">布灯效果图</h3>
            <img 
              src={lightingImageUrl} 
              alt="布灯效果图" 
              className="max-w-full h-auto rounded"
              onError={(e) => {
                console.error('Image failed to load:', e);
                // Optionally set a fallback or hide the image
              }}
            />
          </div>
        )}
        
        {/* Design Intent Display */}
        {designIntent && (
          <div className="w-full bg-[#1C1C1C] rounded-lg p-4 border border-zinc-800 max-w-6xl">
            <h3 className="text-lg font-semibold mb-2">设计意图</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{designIntent}</p>
          </div>
        )}
        
        {/* Light Positions Display */}
        {lightPositions && (
          <div className="w-full bg-[#1C1C1C] rounded-lg p-4 border border-zinc-800 max-w-6xl">
            <h3 className="text-lg font-semibold mb-2">灯具点位</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{lightPositions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoPage;
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { showError, showSuccess } from "@/utils/toast";
import DemoCanvas from "@/components/dashboard/DemoCanvas";
import type { Shape } from "@/components/dashboard/DemoCanvas";
import { CozeAPI } from '@coze/api';

const DemoPage = () => {
  const { t } = useLanguage();
   
  const roomTypes = [t('demo.livingRoom'), t('demo.diningRoom'), t('demo.bedroom'), t('demo.kitchen'), t('demo.bathroom'), t('demo.corridor')];
  const lightingStyles = [t('demo.noMainLight'), t('demo.mainLight')];
  const [room, setRoom] = useState<Shape | null>(null);
  const [furnitures, setFurnitures] = useState<Shape[]>([]);
  const [roomType, setRoomType] = useState(t('demo.livingRoom'));
  const [lightingStyle, setLightingStyle] = useState(t('demo.noMainLight'));

  // 监听语言变化，更新选择器默认值
  useEffect(() => {
    setRoomType(t('demo.livingRoom'));
    setLightingStyle(t('demo.noMainLight'));
  }, [t]);
  const [generatedJson, setGeneratedJson] = useState("");
  const [lightingImageUrl, setLightingImageUrl] = useState("");
  const [lightingImageData, setLightingImageData] = useState("");
  const [designIntent, setDesignIntent] = useState("");
  const [lightPositions, setLightPositions] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestTime, setRequestTime] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);

  const handleGenerate = async () => {
    if (!room) {
      showError(t('demo.drawRoomFirst'));
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
        allowPersonalAccessTokenInBrowser: true,
        token: 'pat_eTFVbmtNc6Inb0sGY28DLYsyJK3t8anIuelEye9fr3szSwoKfMqhN4em12mVKg0c',
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
      
      // Debug: Log the response data structure
      console.log('API Response Data:', responseData);
      
      // Extract data from the response
      // Based on the optimized structure, data is always in responseData.data
      if (responseData.data) {
        const data = typeof responseData.data === 'string' ? JSON.parse(responseData.data) : responseData.data;
        
        // Debug: Log the data structure
        console.log('Parsed Data:', data);
        console.log('Lighting2D:', data.lighting2D);
        console.log('Download URL:', data.lighting2D?.download_url);
        
        // Set lighting image URL
        let lighting2DData = null;
        if (data.lighting2D) {
          try {
            // Parse the lighting2D string if it's a string
            lighting2DData = typeof data.lighting2D === 'string' ? JSON.parse(data.lighting2D) : data.lighting2D;
          } catch (parseError) {
            console.error('Error parsing lighting2D:', parseError);
            lighting2DData = data.lighting2D;
          }
        }
        
        console.log('Setting lighting image URL:', lighting2DData?.download_url || "");
        setLightingImageUrl(lighting2DData?.download_url || "");
        
        // Set lighting image data (base64)
        console.log('Setting lighting image data:', lighting2DData?.image_data || "");
        setLightingImageData(lighting2DData?.image_data || "");
        
        // Set design intent (output)
        setDesignIntent(data.output || "");
        
        // Set light positions (location)
        setLightPositions(data.location || "");
        
        // 保存到历史记录
        const newRecord: HistoryRecord = {
          id: Date.now().toString(),
          timestamp: new Date(),
          roomType,
          lightingStyle,
          room: room!,
          furnitures: [...furnitures],
          result: {
            lightingImageData: lighting2DData?.image_data || "",
            designIntent: data.output || "",
            lightPositions: data.location || "",
            generatedJson: JSON.stringify(res, null, 2)
          }
        };
        
        // 更新历史记录（最多保存10条）
        const updatedRecords = [newRecord, ...historyRecords].slice(0, 10);
        setHistoryRecords(updatedRecords);
        localStorage.setItem('demoHistory', JSON.stringify(updatedRecords));
      }
      
      showSuccess(t('demo.apiSuccess'));
    } catch (error) {
      console.error('Error calling Coze API:', error);
      showError(t('demo.apiFailed') + (error as Error).message);
    } finally {
      // Clear interval and finalize timing
      clearInterval(timerInterval);
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      setRequestTime(parseFloat(duration.toFixed(2)));
      setLoading(false);
    }
  };

  // 加载历史记录
  useEffect(() => {
    const savedHistory = localStorage.getItem('demoHistory');
    if (savedHistory) {
      try {
        const records = JSON.parse(savedHistory);
        setHistoryRecords(records);
      } catch (error) {
        console.error('Failed to parse history records:', error);
      }
    }
  }, []);

  // 处理历史记录点击
  const handleHistoryClick = (record: HistoryRecord) => {
    setSelectedRecord(record);
    setRoom(record.room);
    setFurnitures(record.furnitures);
    setRoomType(record.roomType);
    setLightingStyle(record.lightingStyle);
    setLightingImageData(record.result.lightingImageData);
    setDesignIntent(record.result.designIntent);
    setLightPositions(record.result.lightPositions);
    setGeneratedJson(record.result.generatedJson);
  };

  // 清除历史记录
  const clearHistory = () => {
    setHistoryRecords([]);
    setSelectedRecord(null);
    localStorage.removeItem('demoHistory');
  };

  // 历史记录类型定义
  interface HistoryRecord {
    id: string;
    timestamp: Date;
    roomType: string;
    lightingStyle: string;
    room: Shape;
    furnitures: Shape[];
    result: {
      lightingImageData: string;
      designIntent: string;
      lightPositions: string;
      generatedJson: string;
    };
  }

  return (
    <div className="text-white h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold">{t('demo.title')}</h1>
        <p className="text-gray-400 mt-2">{t('demo.description')}</p>
      </div>

      <div className="mt-8" id="automatic-lighting">
        <h2 className="text-xl font-semibold mb-4">{t('demo.autoLighting')}</h2>
        <div className="flex items-center gap-4">
          <div>
            <label className="text-sm text-gray-400">{t('demo.roomType')}</label>
            <Select value={roomType} onValueChange={setRoomType}>
              <SelectTrigger className="w-[150px] bg-[#1C1C1C] border-zinc-700">
                <SelectValue placeholder={t('demo.selectRoomType')} />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C1C] border-zinc-700 text-white">
                {roomTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-400">{t('demo.lightingStyle')}</label>
            <Select value={lightingStyle} onValueChange={setLightingStyle}>
              <SelectTrigger className="w-[150px] bg-[#1C1C1C] border-zinc-700">
                <SelectValue placeholder={t('demo.selectLightingStyle')} />
              </SelectTrigger>
              <SelectContent className="bg-[#1C1C1C] border-zinc-700 text-white">
                {lightingStyles.map(style => <SelectItem key={style} value={style}>{style}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6 mt-6 h-full">
        <div className="h-[60vh] flex gap-4 w-full max-w-6xl">
          <div className="flex-1">
            <DemoCanvas 
              room={room} 
              setRoom={setRoom} 
              furnitures={furnitures} 
              setFurnitures={setFurnitures} 
            />
          </div>
          
          {/* 近期体验侧边栏 */}
          <div className="w-48 bg-[#1C1C1C] rounded-lg p-3 border border-zinc-800">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-semibold">{t('demo.recentExperiences')}</h3>
              {historyRecords.length > 0 && (
                <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearHistory}
              className="text-red-400 hover:text-red-300"
            >
              {t('common.delete')}
            </Button>
              )}
            </div>
            
            <ScrollArea className="h-[calc(60vh-90px)]">
              {historyRecords.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">
                  {t('demo.noHistory')}
                </p>
              ) : (
                <div className="space-y-2">
                  {historyRecords.map((record) => (
                    <Card 
                      key={record.id}
                      className={`cursor-pointer transition-all ${
                        selectedRecord?.id === record.id 
                          ? 'border-blue-500 bg-blue-900/20' 
                          : 'border-zinc-700 hover:border-zinc-500'
                      }`}
                      onClick={() => handleHistoryClick(record)}
                    >
                      <CardHeader className="p-2 pb-1">
                        <CardTitle className="text-xs font-medium">
                          {t(record.roomType)} - {t(record.lightingStyle)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-2 pt-0">
                        <p className="text-[10px] text-gray-400">
                          {new Date(record.timestamp).toLocaleString()}
                        </p>

                        <p className="text-[10px] text-gray-400">
                          {t('demo.furnitureCount')}: {record.furnitures.length}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
            <p className="text-[10px] text-gray-400 mt-2 text-center">{t('demo.recentLimit')}</p>
          </div>
        </div>
        <div className="flex justify-start items-center" style={{ marginLeft: '450px' }}>
          <Button 
            onClick={handleGenerate} 
            className="bg-white text-black hover:bg-gray-200"
            disabled={loading}
          >
            {loading ? t('demo.aiThinking', { time: requestTime.toFixed(2) }) : t('demo.confirmGenerate')}
          </Button>
        </div>
        
        {/* Combined Display Area */}
        {(loading || lightingImageData || designIntent || lightPositions) && (
          <div className="w-full bg-[#1C1C1C] rounded-lg p-4 border border-zinc-800 max-w-6xl">
            {loading && (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-2">{t('demo.waitAMoment')}</span>
              </div>
            )}
            
            {/* Lighting Image Display */}
            {lightingImageData && !loading && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{t('demo.lightingEffect')}</h3>
                <img 
                  src={`data:image/png;base64,${lightingImageData}`} 
                  alt="布灯效果图" 
                  className="w-2/3 h-auto cursor-pointer" 
                  onClick={() => setIsImageModalOpen(true)}
                />
              </div>
            )}
            
            {/* Design Intent Display */}
            {designIntent && !loading && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{t('demo.designIntent')}</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{designIntent}</p>
              </div>
            )}
            
            {/* Light Positions Display */}
            {lightPositions && !loading && (
              <div>
                <h3 className="text-lg font-semibold mb-2">{t('demo.lightPositions')}</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{lightPositions}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Image Modal */}
        {isImageModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setIsImageModalOpen(false)}>
            <div className="relative">
              <img 
                src={`data:image/png;base64,${lightingImageData}`} 
                alt="布灯效果图 - 放大" 
                className="max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
              />
              <button 
                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2"
                onClick={() => setIsImageModalOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DemoPage;
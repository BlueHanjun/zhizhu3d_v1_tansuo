import { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { Plus, Square, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Shape {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
}

interface DemoCanvasProps {
  room: Shape | null;
  setRoom: (room: Shape | null) => void;
  furnitures: Shape[];
  setFurnitures: (furnitures: Shape[]) => void;
}

const furniturePresets = [
  { name: '床', width: 200, height: 150 },
  { name: '沙发', width: 200, height: 90 },
  { name: '桌子', width: 120, height: 60 },
  { name: '椅子', width: 50, height: 50 },
  { name: '柜子', width: 150, height: 60 },
  { name: '挂画', width: 80, height: 60 },
];

const DemoCanvas = ({ room, setRoom, furnitures, setFurnitures }: DemoCanvasProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleAddFurniture = (preset: typeof furniturePresets[0]) => {
    const newFurniture: Shape = {
      id: `furn-${Date.now()}`,
      name: preset.name,
      x: 20,
      y: 20,
      width: preset.width,
      height: preset.height,
    };
    setFurnitures([...furnitures, newFurniture]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || room) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setIsDrawing(true);
    setStartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const newRoom = {
      id: 'room',
      name: '房间',
      x: Math.min(startPos.x, currentX),
      y: Math.min(startPos.y, currentY),
      width: Math.abs(currentX - startPos.x),
      height: Math.abs(currentY - startPos.y),
    };
    setRoom(newRoom);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const updateShape = (id: string, newProps: Partial<Shape>) => {
    if (id === 'room' && room) {
      setRoom({ ...room, ...newProps });
    } else {
      setFurnitures(furnitures.map(f => f.id === id ? { ...f, ...newProps } : f));
    }
  };

  const handleDeleteShape = (id: string) => {
    if (id === 'room') {
      setRoom(null);
    } else {
      setFurnitures(furnitures.filter(f => f.id !== id));
    }
  };

  const renderShape = (shape: Shape) => {
    const isRoom = shape.id === 'room';
    const shapeClasses = isRoom
      ? 'bg-blue-900/50 border-2 border-blue-500 flex items-center justify-center rounded-sm group'
      : 'bg-zinc-700/80 border border-zinc-500 flex items-center justify-center rounded-sm group';
    const textClasses = 'text-white text-sm select-none px-2 py-1';

    return (
      <Rnd
        key={shape.id}
        size={{ width: shape.width, height: shape.height }}
        position={{ x: shape.x, y: shape.y }}
        onDragStop={(_e, d) => updateShape(shape.id, { x: d.x, y: d.y })}
        onResizeStop={(_e, _direction, ref, _delta, position) => {
          updateShape(shape.id, {
            width: parseInt(ref.style.width, 10),
            height: parseInt(ref.style.height, 10),
            ...position,
          });
        }}
        bounds="parent"
        className={shapeClasses}
      >
        <span className={textClasses}>{shape.name}</span>
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteShape(shape.id);
          }}
        >
          <X className="h-3 w-3" />
        </Button>
        {isRoom && (
          <>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-zinc-400 bg-zinc-900 px-1 rounded">{shape.width * 10}mm</div>
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 rotate-90 text-xs text-zinc-400 bg-zinc-900 px-1 rounded">{shape.height * 10}mm</div>
          </>
        )}
      </Rnd>
    );
  };

  return (
    <div className="w-full h-full flex gap-4">
      <div className="w-40 bg-[#1C1C1C] rounded-lg p-2 flex flex-col gap-2 border border-zinc-800">
        <Button variant="ghost" onClick={() => setRoom(null)} className="w-full justify-start gap-2">
          <Square size={16} /> 画房间
        </Button>
        <hr className="border-zinc-700 my-2" />
        {furniturePresets.map(preset => (
          <Button key={preset.name} variant="ghost" onClick={() => handleAddFurniture(preset)} className="w-full justify-start gap-2">
            <Plus size={16} /> {preset.name}
          </Button>
        ))}
      </div>
      <div
        ref={canvasRef}
        className="flex-1 bg-zinc-900 rounded-lg relative overflow-hidden border border-zinc-700"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 0)',
          backgroundSize: '16px 16px',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {room && renderShape(room)}
        {furnitures.map(renderShape)}
      </div>
    </div>
  );
};

export default DemoCanvas;
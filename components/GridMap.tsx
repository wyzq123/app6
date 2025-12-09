
import React from 'react';
import { GRID_SIZE, getItemAt } from '../constants';
import { RobotState, LevelConfig, GridCell } from '../types';

interface GridMapProps {
  robot: RobotState;
  level: LevelConfig;
  collectedStars: string[]; // List of "x,y" strings of collected stars
}

export const GridMap: React.FC<GridMapProps> = ({ robot, level, collectedStars }) => {
  // Create grid cells
  const cells = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      cells.push({ x, y });
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-0">
      {/* Aspect Ratio Container that fits inside parent */}
      <div 
        className="relative bg-green-500 rounded-xl p-1 shadow-lg border-[4px] border-green-600 select-none"
        style={{
          width: 'auto',
          height: 'auto',
          maxWidth: '100%',
          maxHeight: '100%',
          aspectRatio: '1/1',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          gap: '2px'
        }}
      >
        {/* Background Grid Cells */}
        {cells.map((cell) => {
          // Cast to ensure TS knows about optional properties from GridCell and isTarget
          const itemData = getItemAt(level, cell.x, cell.y) as (GridCell & { isTarget?: boolean }) | undefined;
          const isDarker = (cell.x + cell.y) % 2 === 1;
          
          // Target styling
          const isTarget = itemData?.isTarget;
          
          // Star Logic
          const isStar = itemData?.isStar;
          const starKey = `${cell.x},${cell.y}`;
          const isCollected = collectedStars.includes(starKey);

          // Portal Logic
          const isPortal = !!itemData?.portalColor;
          const portalColor = itemData?.portalColor || 'blue';
          
          // Map portal color names to Tailwind classes
          const getPortalColorClass = (c: string) => {
             if (c === 'red') return 'border-red-500 shadow-red-500/50';
             if (c === 'purple') return 'border-purple-500 shadow-purple-500/50';
             return 'border-blue-500 shadow-blue-500/50';
          };

          return (
            <div 
              key={`${cell.x}-${cell.y}`}
              className={`
                relative rounded-lg flex items-center justify-center select-none overflow-hidden
                ${isDarker ? 'bg-green-400/40' : 'bg-green-300/40'}
                ${isTarget ? 'border-4 border-yellow-300 bg-yellow-100/30' : 'border border-white/10'}
              `}
            >
              {/* 1. Portal Render (Underneath items) */}
              {isPortal && (
                <div className="absolute inset-0 flex items-center justify-center opacity-90 z-10">
                   {/* Outer Ring */}
                   <div className={`w-[85%] h-[85%] rounded-full border-[6px] border-t-transparent ${getPortalColorClass(portalColor)} animate-spin shadow-lg`} style={{ animationDuration: '3s' }}></div>
                   {/* Inner Ring */}
                   <div className={`absolute w-[50%] h-[50%] rounded-full border-[4px] border-b-transparent ${getPortalColorClass(portalColor)} animate-spin shadow-sm`} style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
                   {/* Center Dot */}
                   <div className={`absolute w-[15%] h-[15%] rounded-full ${portalColor === 'red' ? 'bg-red-500' : portalColor === 'purple' ? 'bg-purple-500' : 'bg-blue-500'} animate-pulse`}></div>
                </div>
              )}

              {/* 2. Standard Items (Target, Trees, etc.) */}
              {itemData && itemData.item && (
                <span 
                    className={`drop-shadow-sm transform transition-transform z-20 flex items-center justify-center h-full w-full ${isTarget ? 'scale-110 animate-bounce' : ''}`}
                    style={{ fontSize: 'clamp(32px, 18vmin, 120px)', lineHeight: 1 }}
                >
                  {itemData.item}
                </span>
              )}

              {/* 3. Star Render */}
              {isStar && !isCollected && (
                <div 
                    className="absolute z-20 animate-pulse drop-shadow-[0_0_15px_rgba(250,204,21,0.9)] flex items-center justify-center"
                    style={{ fontSize: 'clamp(32px, 18vmin, 120px)' }}
                >
                  ⭐
                </div>
              )}

              {/* Coordinate dots (decorative) */}
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-60" />
              
              {/* Show obstacle marker if needed */}
              {itemData?.isObstacle && (
                 <div className="absolute inset-0 bg-red-500/20 rounded-lg z-0" />
              )}
            </div>
          );
        })}

        {/* Robot Character Layer */}
        <div 
          className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-xl z-30"
        >
          <div
            className="absolute w-[25%] h-[25%] flex items-center justify-center transition-all duration-500 ease-in-out"
            style={{
              // Calculate percentage position based on 4x4 grid (25% each)
              left: `${robot.x * 25}%`,
              top: `${robot.y * 25}%`,
            }}
          >
            {/* Robot 2D Character - Rover/Car Style Design for clear direction */}
            <div 
               className="w-[85%] h-[85%] relative transition-transform duration-500 drop-shadow-xl"
               style={{ transform: `rotate(${robot.direction}deg)` }} 
            >
                {/* 1. Wheels/Treads (Side Indicators) */}
                <div className="absolute left-0 top-1 bottom-1 w-[15%] bg-slate-700 rounded-l-lg border-r border-slate-600"></div>
                <div className="absolute right-0 top-1 bottom-1 w-[15%] bg-slate-700 rounded-r-lg border-l border-slate-600"></div>

                {/* 2. Main Body (Blue Shell) */}
                <div className="absolute inset-x-[12%] inset-y-0 bg-blue-500 rounded-xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)] border-2 border-blue-600 flex flex-col items-center overflow-visible">
                    
                    {/* 3. HEADLIGHTS - Enhanced & Larger */}
                    {/* Positioning: negative top to stick out front */}
                    <div className="absolute -top-[12%] left-[15%] w-[25%] h-[25%] bg-yellow-300 rounded-t-full shadow-[0_-4px_12px_rgba(253,224,71,0.9)] z-0 animate-pulse border-x border-t border-yellow-100"></div>
                    <div className="absolute -top-[12%] right-[15%] w-[25%] h-[25%] bg-yellow-300 rounded-t-full shadow-[0_-4px_12px_rgba(253,224,71,0.9)] z-0 animate-pulse border-x border-t border-yellow-100"></div>

                    {/* 4. Front Face Screen */}
                    <div className="absolute top-[12%] w-[80%] h-[35%] bg-white rounded-lg border-2 border-slate-200 flex justify-center items-center gap-1.5 shadow-sm z-10">
                        {/* Eyes looking forward */}
                        <div className="w-1.5 h-2.5 bg-slate-900 rounded-full relative">
                           <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                        </div>
                        <div className="w-1.5 h-2.5 bg-slate-900 rounded-full relative">
                           <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                        </div>
                    </div>

                    {/* 5. Direction Triangle (Rear) - Enhanced visibility */}
                    <div className="absolute bottom-[10%] w-[60%] h-[30%] opacity-100 z-10">
                        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-sm filter drop-shadow">
                            <path d="M12 2L22 19H2L12 2Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

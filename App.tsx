import React, { useState, useEffect } from 'react';
import { GridMap } from './components/GridMap';
import { CommandCard } from './components/CommandCard';
import { CommandType, RobotState } from './types';
import { GRID_SIZE, LEVELS, getMilestoneMessage } from './constants';
import { compileCommands } from './utils/compiler';
import { SoundManager } from './utils/sound';
import { Play, RotateCcw, Trash2, ChevronLeft, ChevronRight, Trophy, Grid, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = LEVELS[currentLevelIdx];

  const [robot, setRobot] = useState<RobotState>({
    x: currentLevel.start.x,
    y: currentLevel.start.y,
    direction: currentLevel.start.direction,
  });

  const [commands, setCommands] = useState<CommandType[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [execIndex, setExecIndex] = useState(-1);
  const [compiledQueue, setCompiledQueue] = useState<CommandType[]>([]);
  const [showWinModal, setShowWinModal] = useState(false);
  const [winMessage, setWinMessage] = useState('');
  const [showLevelMenu, setShowLevelMenu] = useState(false);
  const [collectedStars, setCollectedStars] = useState<string[]>([]);

  useEffect(() => {
    resetRobot(true);
  }, [currentLevelIdx]);

  const resetRobot = (clearCmds = false) => {
    setIsPlaying(false);
    setExecIndex(-1);
    setShowWinModal(false);
    setCollectedStars([]);
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setRobot({
      x: currentLevel.start.x,
      y: currentLevel.start.y,
      direction: currentLevel.start.direction,
    });
    if (clearCmds) {
        setCommands([]);
    }
  };

  const clearProgram = () => {
    SoundManager.playDelete();
    setCommands([]);
    resetRobot();
  };

  const addCommand = (cmd: CommandType) => {
    if (isPlaying) return;
    SoundManager.playClick();
    setCommands((prev) => [...prev, cmd]);
  };

  const removeCommand = (index: number) => {
    if (isPlaying) return;
    SoundManager.playDelete();
    setCommands((prev) => prev.filter((_, i) => i !== index));
  };

  const runProgram = () => {
    if (commands.length === 0) return;
    
    SoundManager.playStart();
    const queue = compileCommands(commands);
    setCompiledQueue(queue);
    
    setRobot({
      x: currentLevel.start.x,
      y: currentLevel.start.y,
      direction: currentLevel.start.direction,
    });
    setCollectedStars([]);

    setExecIndex(-1);
    setIsPlaying(true);
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
        setCurrentLevelIdx(prev => prev + 1);
    }
  };

  const handlePrevLevel = () => {
    if (currentLevelIdx > 0) {
        setCurrentLevelIdx(prev => prev - 1);
    }
  };

  // Execution Loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      const nextIndex = execIndex + 1;

      if (nextIndex >= compiledQueue.length) {
        setIsPlaying(false);
        // Win Condition: At target AND all stars collected (if any exist in level)
        const totalStarsInLevel = currentLevel.items.filter(i => i.isStar).length;
        const starsCollectedCount = collectedStars.length;
        
        if (robot.x === currentLevel.target.x && robot.y === currentLevel.target.y) {
            // Check stars
            if (starsCollectedCount >= totalStarsInLevel) {
                SoundManager.playWin();
                
                const milestoneMsg = getMilestoneMessage(currentLevel.id);
                
                if (milestoneMsg) {
                    // Encourage only every 5 levels (or explicit milestones)
                    setWinMessage(milestoneMsg);
                    SoundManager.speak(milestoneMsg);
                } else {
                    // Standard success for other levels
                    setWinMessage("闯关成功！");
                    // No speech for standard levels
                }
                
                setShowWinModal(true);
            } else {
                // At target but missing stars
                SoundManager.speak("还有星星没收集到哦！");
                setIsPlaying(false); // Stop
            }
        } else {
            SoundManager.playFail();
        }
        return;
      }

      setExecIndex(nextIndex);
      const cmd = compiledQueue[nextIndex];
      
      SoundManager.playMove();

      setRobot((prev) => {
        let newX = prev.x;
        let newY = prev.y;
        
        const normalizedDir = ((prev.direction % 360) + 360) % 360;
        let newDir = prev.direction;

        const isValidMove = (x: number, y: number) => {
            if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return false;
            const item = currentLevel.items.find(i => i.x === x && i.y === y);
            if (item?.isObstacle) return false;
            return true;
        };

        switch (cmd) {
          case CommandType.FORWARD:
            if (normalizedDir === 0) newY = prev.y - 1;
            else if (normalizedDir === 180) newY = prev.y + 1;
            else if (normalizedDir === 90) newX = prev.x + 1;
            else if (normalizedDir === 270) newX = prev.x - 1;
            break;
          case CommandType.BACKWARD:
            if (normalizedDir === 0) newY = prev.y + 1;
            else if (normalizedDir === 180) newY = prev.y - 1;
            else if (normalizedDir === 90) newX = prev.x - 1;
            else if (normalizedDir === 270) newX = prev.x + 1;
            break;
          case CommandType.LEFT:
            newDir = prev.direction - 90;
            break;
          case CommandType.RIGHT:
            newDir = prev.direction + 90;
            break;
        }

        if (!isValidMove(newX, newY)) {
            return { ...prev, direction: newDir };
        }

        const itemAtNewPos = currentLevel.items.find(i => i.x === newX && i.y === newY);
        
        // Star Collection
        if (itemAtNewPos?.isStar) {
            const starKey = `${newX},${newY}`;
            setCollectedStars(prevStars => {
                if (!prevStars.includes(starKey)) {
                    SoundManager.playStar();
                    return [...prevStars, starKey];
                }
                return prevStars;
            });
        }

        // Portal Teleportation
        if (itemAtNewPos?.portalColor) {
             const otherPortal = currentLevel.items.find(i => 
                 i.portalColor === itemAtNewPos.portalColor && 
                 (i.x !== newX || i.y !== newY)
             );
             if (otherPortal) {
                 setTimeout(() => SoundManager.playPortal(), 100);
                 newX = otherPortal.x;
                 newY = otherPortal.y;
             }
        }

        return { x: newX, y: newY, direction: newDir };
      });
    }, 600);

    return () => clearTimeout(timer);
  }, [isPlaying, execIndex, compiledQueue, currentLevel, collectedStars]);

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden select-none">
      {/* Header */}
      <div className="bg-white shadow-sm p-2 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-2">
            <button onClick={() => setShowLevelMenu(true)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
                <Grid size={24} />
            </button>
            <div className="flex flex-col">
                <h1 className="text-lg font-bold leading-tight text-slate-800">{currentLevel.title}</h1>
                <p className="text-xs text-slate-500">{currentLevel.description}</p>
            </div>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="hidden sm:flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200 mr-2">
                <Trophy size={16} className="text-yellow-500" />
                <span className="text-sm font-bold text-yellow-700">
                    {collectedStars.length} / {currentLevel.items.filter(i => i.isStar).length}
                </span>
           </div>
           
           <button onClick={handlePrevLevel} disabled={currentLevelIdx === 0} className="p-2 bg-slate-200 rounded-full hover:bg-slate-300 disabled:opacity-30 transition-colors">
               <ChevronLeft size={20} />
           </button>
           <span className="font-mono font-bold text-lg min-w-[3ch] text-center">{currentLevel.id}</span>
           <button onClick={handleNextLevel} disabled={currentLevelIdx === LEVELS.length - 1} className="p-2 bg-slate-200 rounded-full hover:bg-slate-300 disabled:opacity-30 transition-colors">
               <ChevronRight size={20} />
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left: Map */}
        <div className="flex-1 flex items-center justify-center p-2 bg-slate-200/50 overflow-hidden relative">
            <div className="w-full max-w-[750px] aspect-square shadow-xl rounded-2xl bg-white/50 backdrop-blur-sm">
                <GridMap robot={robot} level={currentLevel} collectedStars={collectedStars} />
            </div>
        </div>

        {/* Right: Program List (Now Simplified) */}
        <div className="h-[25vh] md:h-auto md:w-80 bg-white border-t md:border-l border-slate-200 flex flex-col shrink-0 z-10">
            {/* Header for list */}
            <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50">
                <span className="text-sm font-bold uppercase tracking-wider text-slate-400">你的程序</span>
                <span className="text-xs text-slate-400">{commands.length} 个指令</span>
            </div>

            {/* Command List Area */}
            <div className="flex-1 overflow-y-auto p-3 bg-slate-50 inner-shadow">
                {commands.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                        <div className="border-2 border-dashed border-slate-300 rounded-lg w-20 h-20 mb-2 flex items-center justify-center">
                            <Play size={32} className="opacity-20"/>
                        </div>
                        <p className="text-sm font-bold">点击下方卡片开始编程</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap content-start gap-1">
                        {commands.map((cmd, idx) => (
                            <div key={idx} className="relative group">
                                <CommandCard 
                                    type={cmd} 
                                    mini 
                                    className="!m-0 shadow-sm"
                                    onClick={() => removeCommand(idx)}
                                />
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm z-10 hover:scale-110">
                                    <X size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Bottom: Palette & Big Controls */}
      <div className="bg-white border-t border-slate-200 p-3 shrink-0 z-30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
         
         {/* Command Palette */}
         <div className="overflow-x-auto w-full md:w-auto pb-1 hide-scrollbar">
            <div className="flex justify-center md:justify-start gap-3 min-w-max px-2">
                <div className="flex gap-2 p-1.5 bg-blue-50 rounded-xl border border-blue-100">
                    <CommandCard type={CommandType.FORWARD} onClick={() => addCommand(CommandType.FORWARD)} />
                    <CommandCard type={CommandType.BACKWARD} onClick={() => addCommand(CommandType.BACKWARD)} />
                </div>
                <div className="flex gap-2 p-1.5 bg-yellow-50 rounded-xl border border-yellow-100">
                    <CommandCard type={CommandType.LEFT} onClick={() => addCommand(CommandType.LEFT)} />
                    <CommandCard type={CommandType.RIGHT} onClick={() => addCommand(CommandType.RIGHT)} />
                </div>
                <div className="flex gap-2 p-1.5 bg-red-50 rounded-xl border border-red-100">
                    <CommandCard type={CommandType.LOOP_START} onClick={() => addCommand(CommandType.LOOP_START)} />
                    <CommandCard type={CommandType.LOOP_END} onClick={() => addCommand(CommandType.LOOP_END)} />
                </div>
                <div className="flex gap-2 p-1.5 bg-orange-50 rounded-xl border border-orange-100">
                    <CommandCard type={CommandType.X2} onClick={() => addCommand(CommandType.X2)} />
                    <CommandCard type={CommandType.X3} onClick={() => addCommand(CommandType.X3)} />
                </div>
            </div>
         </div>

         {/* BIG CONTROL BUTTONS (Right Side) */}
         <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end border-t md:border-t-0 border-slate-100 pt-2 md:pt-0">
            <button 
                onClick={clearProgram}
                disabled={isPlaying}
                className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-red-100 text-red-500 rounded-2xl hover:bg-red-200 active:scale-95 transition-all disabled:opacity-50"
                title="全部删除"
            >
                <Trash2 size={28} />
                <span className="text-xs font-bold mt-1">清空</span>
            </button>
            
            <button 
                onClick={() => resetRobot()}
                disabled={isPlaying}
                className="flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-blue-100 text-blue-500 rounded-2xl hover:bg-blue-200 active:scale-95 transition-all disabled:opacity-50"
                title="回到起点"
            >
                <RotateCcw size={28} />
                <span className="text-xs font-bold mt-1">重置</span>
            </button>

            <button 
                onClick={runProgram}
                disabled={isPlaying || commands.length === 0}
                className="flex flex-col items-center justify-center h-16 md:h-20 px-8 bg-green-500 text-white rounded-2xl shadow-[0_6px_0_#15803d] hover:bg-green-400 active:shadow-none active:translate-y-[6px] transition-all disabled:opacity-50 disabled:shadow-none disabled:bg-slate-300"
            >
                <Play size={32} fill="currentColor" className="mb-1" />
                <span className="text-lg font-black tracking-wider">运行!</span>
            </button>
         </div>
      </div>

      {/* Modals */}
      {showWinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center transform transition-all scale-100">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Trophy size={40} className="text-yellow-500" />
                </div>
                {/* Dynamically adjust title based on whether it's a milestone (enthusiastic) or normal (simple) */}
                <h2 className="text-3xl font-black text-slate-800 mb-2">{winMessage !== "闯关成功！" ? "太棒了！" : "过关了！"}</h2>
                <p className="text-lg text-slate-600 mb-6">{winMessage}</p>
                
                <div className="flex gap-3 justify-center">
                    <button 
                        onClick={() => {
                            resetRobot();
                        }}
                        className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition-colors"
                    >
                        重玩
                    </button>
                    {currentLevelIdx < LEVELS.length - 1 && (
                        <button 
                            onClick={() => {
                                handleNextLevel();
                            }}
                            className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 shadow-lg shadow-green-500/30 transition-all active:scale-95"
                        >
                            下一关
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}

      {showLevelMenu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                 <div className="p-4 border-b flex justify-between items-center">
                     <h2 className="text-xl font-bold">选择关卡</h2>
                     <button onClick={() => setShowLevelMenu(false)} className="p-2 hover:bg-slate-100 rounded-full">
                         <X size={20} />
                     </button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                     {LEVELS.map((l, idx) => (
                         <button 
                            key={l.id}
                            onClick={() => {
                                setCurrentLevelIdx(idx);
                                setShowLevelMenu(false);
                            }}
                            className={`
                                aspect-square rounded-lg flex flex-col items-center justify-center border-2 transition-all
                                ${currentLevelIdx === idx 
                                    ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold shadow-md ring-2 ring-blue-200' 
                                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-blue-300 hover:bg-white'}
                            `}
                         >
                            <span className="text-lg">{l.id}</span>
                         </button>
                     ))}
                 </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default App;
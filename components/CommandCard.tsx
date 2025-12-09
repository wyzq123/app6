import React from 'react';
import { CommandType } from '../types';

interface CommandCardProps {
  type: CommandType;
  onClick?: () => void;
  className?: string;
  mini?: boolean;
}

export const CommandCard: React.FC<CommandCardProps> = ({ type, onClick, className = '', mini = false }) => {
  
  const baseClasses = "rounded-xl shadow-[0_4px_0_rgba(0,0,0,0.2)] flex items-center justify-center cursor-pointer active:translate-y-[4px] active:shadow-none transition-all border-2 border-white select-none relative";
  
  // Significantly increased sizes
  // mini: Used in the right-side program list (previously w-10 h-10) -> Now w-16 h-16
  // default: Used in the bottom palette (previously w-16 h-16) -> Now w-20 h-20
  const sizeClasses = mini ? "w-16 h-16 m-1.5" : "w-20 h-20 m-2";
  
  // Custom Icon Rendering based on type to match the video style
  const renderIcon = () => {
    switch (type) {
      case CommandType.FORWARD:
        return (
          <svg width="65%" height="65%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20V4" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 11L12 4L19 11" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case CommandType.BACKWARD:
        return (
          <svg width="65%" height="65%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 13L12 20L5 13" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case CommandType.LEFT:
        return (
          <svg width="70%" height="70%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 20V11C17 8 16 6 10 6H4" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 2L4 6L8 10" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case CommandType.RIGHT:
        return (
          <svg width="70%" height="70%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 20V11C7 8 8 6 14 6H20" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 2L20 6L16 10" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case CommandType.LOOP_START:
        return (
           <svg width="65%" height="65%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="3" />
            <path d="M10 8L16 12L10 16V8Z" fill="white"/>
           </svg>
        );
      case CommandType.LOOP_END:
        return (
           <svg width="65%" height="65%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="6" width="12" height="12" rx="2" fill="white" />
           </svg>
        );
      case CommandType.X2:
        return <span className={`text-white font-bold font-mono leading-none ${mini ? 'text-2xl' : 'text-4xl'}`}>2x</span>;
      case CommandType.X3:
        return <span className={`text-white font-bold font-mono leading-none ${mini ? 'text-2xl' : 'text-4xl'}`}>3x</span>;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case CommandType.FORWARD: return 'bg-blue-400 hover:bg-blue-500';
      case CommandType.BACKWARD: return 'bg-blue-500 hover:bg-blue-600';
      case CommandType.LEFT: return 'bg-yellow-500 hover:bg-yellow-600'; 
      case CommandType.RIGHT: return 'bg-yellow-500 hover:bg-yellow-600';
      case CommandType.LOOP_START: return 'bg-red-500 hover:bg-red-600';
      case CommandType.LOOP_END: return 'bg-red-500 hover:bg-red-600';
      case CommandType.X2: 
      case CommandType.X3: return 'bg-orange-400 hover:bg-orange-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div 
      className={`${baseClasses} ${sizeClasses} ${getBgColor()} ${className}`}
      onClick={onClick}
      title={type}
    >
      {renderIcon()}
    </div>
  );
};
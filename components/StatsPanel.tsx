import React from 'react';
import { GameState } from '../types';
import { Heart, MapPin, Backpack, Zap, ShieldAlert, User, Sword, Wind, Brain } from 'lucide-react';

interface StatsPanelProps {
  state: GameState;
  className?: string;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ state, className = '' }) => {
  const hpPercentage = state.maxHp > 0 ? Math.max(0, Math.min(100, (state.hp / state.maxHp) * 100)) : 100;

  return (
    <div className={`bg-gray-800 border-b border-gray-700 p-3 md:p-4 shadow-lg ${className}`}>
      
      {/* 1. Header: Location & Level */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center text-blue-400 font-medium overflow-hidden">
          <MapPin size={18} className="mr-1.5 flex-shrink-0" />
          <span className="truncate text-sm md:text-base">{state.location}</span>
        </div>
        
        <div className="flex flex-col items-end">
             <div className="flex items-center text-yellow-500 font-bold text-sm">
                <Zap size={16} className="mr-1 fill-current" />
                <span>LVL {state.level}</span>
             </div>
             {state.xp > 0 && <span className="text-[10px] text-gray-500">XP: {state.xp}</span>}
        </div>
      </div>

      {/* 2. Character Profile Pill */}
      {(state.class || state.gender !== 'Неизвестно') && (
        <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-2 mb-3 border border-gray-700">
           <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded bg-gray-600 flex items-center justify-center text-gray-300">
                    <User size={16} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-200">{state.name}</span>
                    <span className="text-[10px] text-gray-400 capitalize">{state.gender} {state.class}</span>
                </div>
           </div>
        </div>
      )}

      {/* 3. HP Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span className="flex items-center"><Heart size={12} className="mr-1 text-red-500 fill-current" /> Здоровье</span>
          <span>{state.hp} / {state.maxHp}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-700">
          <div 
            className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500 ease-out"
            style={{ width: `${hpPercentage}%` }}
          />
        </div>
      </div>

      {/* 4. Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
         <div className="bg-gray-900/50 p-1.5 rounded border border-gray-700 flex flex-col items-center">
             <div className="flex items-center text-[10px] text-gray-400 mb-0.5">
                 <Sword size={10} className="mr-1 text-red-400" /> СИЛ
             </div>
             <span className="text-sm font-bold text-gray-200">{state.strength}</span>
         </div>
         <div className="bg-gray-900/50 p-1.5 rounded border border-gray-700 flex flex-col items-center">
             <div className="flex items-center text-[10px] text-gray-400 mb-0.5">
                 <Wind size={10} className="mr-1 text-green-400" /> ЛОВ
             </div>
             <span className="text-sm font-bold text-gray-200">{state.agility}</span>
         </div>
         <div className="bg-gray-900/50 p-1.5 rounded border border-gray-700 flex flex-col items-center">
             <div className="flex items-center text-[10px] text-gray-400 mb-0.5">
                 <Brain size={10} className="mr-1 text-blue-400" /> ИНТ
             </div>
             <span className="text-sm font-bold text-gray-200">{state.intelligence}</span>
         </div>
      </div>

      {/* 5. Inventory & Effects */}
      <div className="space-y-2">
         {/* Effects */}
         {state.statusEffects && state.statusEffects.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
                {state.statusEffects.map((effect, idx) => (
                <span key={idx} className="flex items-center px-1.5 py-0.5 rounded bg-purple-900/40 text-purple-200 text-[10px] border border-purple-800">
                    <ShieldAlert size={8} className="mr-1" />
                    {effect}
                </span>
                ))}
            </div>
         )}
         
         {/* Inventory */}
         <div className="text-xs">
            <div className="flex items-center text-gray-500 mb-1.5">
            <Backpack size={12} className="mr-1" />
            <span>Инвентарь</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
            {state.inventory.length === 0 ? (
                <span className="text-gray-700 italic text-[10px]">Пусто...</span>
            ) : (
                state.inventory.map((item, index) => (
                <span 
                    key={index} 
                    className="px-1.5 py-0.5 bg-gray-700 rounded text-[10px] text-gray-300 border border-gray-600"
                >
                    {item}
                </span>
                ))
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
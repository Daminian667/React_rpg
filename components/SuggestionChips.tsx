import React from 'react';

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  disabled?: boolean;
}

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ suggestions, onSelect, disabled }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4 px-2">
      {suggestions.map((text, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(text)}
          disabled={disabled}
          className="bg-gray-800 hover:bg-gray-700 text-blue-300 border border-blue-900/30 
                     text-xs md:text-sm py-1.5 px-3 rounded-full transition-colors 
                     disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transform duration-100"
        >
          {text}
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;
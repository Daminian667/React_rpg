import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, RefreshCw } from 'lucide-react';
import { Message, GameState, GamePhase } from './types';
import { gameService, INITIAL_STATE } from './services/gemini';
import ChatMessage from './components/ChatMessage';
import StatsPanel from './components/StatsPanel';
import SuggestionChips from './components/SuggestionChips';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentGameState, setCurrentGameState] = useState<GameState>(INITIAL_STATE.state);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Start game on mount
  useEffect(() => {
    if (!hasStarted) {
      startGame();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startGame = async () => {
    setIsLoading(true);
    setHasStarted(true);
    try {
      const response = await gameService.startNewGame();
      
      const welcomeMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.narrative,
        timestamp: new Date(),
        gameState: response.state,
      };

      setMessages([welcomeMsg]);
      setCurrentGameState(response.state);
      setSuggestions(response.suggestedActions);
    } catch (error) {
      console.error("Failed to start game", error);
      setMessages([{
        id: 'error',
        role: 'system',
        content: 'Ошибка подключения к нейросети. Проверьте API ключ или попробуйте позже.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    // FSM Input Validation: Restrict input during selection phases
    const isSelectionPhase = 
      currentGameState.phase === GamePhase.GENDER_SELECTION || 
      currentGameState.phase === GamePhase.CLASS_SELECTION;

    if (isSelectionPhase) {
      // Validate that the text exactly matches one of the suggestions
      if (!suggestions.includes(text)) {
        // Add a temporary system warning or just ignore
        // Here we add a ephemeral system message to guide the user
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'system',
            content: '⚠️ Пожалуйста, выберите вариант из предложенных кнопок.',
            timestamp: new Date()
        }]);
        return;
      }
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setSuggestions([]); // Clear suggestions while thinking

    try {
      const response = await gameService.sendAction(text);
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.narrative,
        timestamp: new Date(),
        gameState: response.state
      };

      setMessages(prev => [...prev, aiMsg]);
      setCurrentGameState(response.state);
      setSuggestions(response.suggestedActions || []);
    } catch (error) {
      console.error("Failed to get response", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        content: 'Связь с сервером потеряна. Попробуйте повторить действие.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    if (window.confirm("Начать новую игру? Весь прогресс будет утерян.")) {
        setMessages([]);
        setSuggestions([]);
        setCurrentGameState(INITIAL_STATE.state);
        startGame();
    }
  };

  // Helper to determine if input should be disabled or restricted
  const isSelectionPhase = 
      currentGameState.phase === GamePhase.GENDER_SELECTION || 
      currentGameState.phase === GamePhase.CLASS_SELECTION;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 max-w-4xl mx-auto shadow-2xl overflow-hidden relative border-x border-gray-800">
      
      {/* Header / Stats Panel */}
      <header className="z-20 bg-gray-900">
         <StatsPanel state={currentGameState} />
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-2 space-y-2 custom-scrollbar">
        {messages.length === 0 && !isLoading && (
            <div className="flex items-center justify-center h-full text-gray-600">
                <span className="text-sm">Инициализация мира...</span>
            </div>
        )}
        
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start w-full mb-6">
             <div className="flex max-w-[80%] flex-row items-end">
                <div className="h-8 w-8 rounded-full bg-emerald-600 mr-3 flex items-center justify-center shadow-md">
                     <BotIconMini />
                </div>
                <div className="bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-700 flex items-center gap-2">
                   <Loader2 size={16} className="animate-spin text-emerald-400" />
                   <span className="text-sm text-gray-400">ГМ думает...</span>
                </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="p-3 md:p-4 bg-gray-900 border-t border-gray-800 z-20">
        
        {/* Suggested Actions */}
        {!isLoading && !currentGameState.isGameOver && (
             <SuggestionChips 
                suggestions={suggestions} 
                onSelect={(text) => handleSend(text)} 
                disabled={isLoading}
             />
        )}

        {/* Input Field */}
        <div className="relative flex items-center gap-2">
            {currentGameState.isGameOver ? (
                 <button 
                 onClick={handleRestart}
                 className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
               >
                 <RefreshCw size={20} />
                 Начать заново
               </button>
            ) : isSelectionPhase ? (
                <div className="w-full py-3.5 px-4 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-400 text-center text-sm italic">
                    Выберите вариант из кнопок выше
                </div>
            ) : (
                <>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Что вы будете делать?"
                        disabled={isLoading}
                        className="flex-1 bg-gray-800 text-gray-100 placeholder-gray-500 border border-gray-700 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all disabled:opacity-50"
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={isLoading || !input.trim()}
                        className="p-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Send size={20} />
                    </button>
                </>
            )}
        </div>
        
        {/* Restart Tiny Button (if game is running) */}
        {!currentGameState.isGameOver && (
             <button 
                onClick={handleRestart}
                className="absolute top-[-3.5rem] right-4 p-2 text-gray-600 hover:text-red-400 transition-colors"
                title="Restart Game"
             >
                <RefreshCw size={14} />
             </button>
        )}
      </footer>
    </div>
  );
};

// Mini icon for loading state
const BotIconMini = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
)

export default App;

import React, { useState, useCallback, useEffect } from 'react';
import { Category, Question } from './types';
import { generateQuestion } from './services/geminiService';
import CategoryButton from './components/CategoryButton';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('funny');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [history, setHistory] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewQuestion = useCallback(async (category: Category) => {
    setLoading(true);
    setError(null);
    try {
      const historyStrings = history.map(h => `${h.optionA} OR ${h.optionB}`);
      const result = await generateQuestion(category, historyStrings);
      
      const newQuestion: Question = {
        id: Math.random().toString(36).substr(2, 9),
        category,
        optionA: result.optionA,
        optionB: result.optionB,
        timestamp: Date.now()
      };

      setCurrentQuestion(newQuestion);
      setHistory(prev => [newQuestion, ...prev].slice(0, 10)); // Keep last 10 for context
    } catch (err) {
      setError("Oops! Something went wrong while generating the question.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [history]);

  // Initial load
  useEffect(() => {
    fetchNewQuestion('funny');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    fetchNewQuestion(cat);
  };

  const handleRegenerate = () => {
    fetchNewQuestion(activeCategory);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="max-w-4xl w-full text-center mb-10 mt-6">
        <h1 className="text-4xl md:text-6xl font-fredoka text-indigo-600 mb-4 float">
          FRIDAY FUN!
        </h1>
        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          Keep your 6th, 7th, and 8th graders engaged with the ultimate middle school "Would You Rather" challenge.
        </p>
      </header>

      {/* Category Selection */}
      <section className="max-w-4xl w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <CategoryButton 
          category="funny" 
          active={activeCategory === 'funny'} 
          onClick={handleCategoryChange} 
          icon="😂" 
          color="bg-yellow-500" 
        />
        <CategoryButton 
          category="thoughtful" 
          active={activeCategory === 'thoughtful'} 
          onClick={handleCategoryChange} 
          icon="🤔" 
          color="bg-blue-500" 
        />
        <CategoryButton 
          category="animal" 
          active={activeCategory === 'animal'} 
          onClick={handleCategoryChange} 
          icon="🐾" 
          color="bg-green-500" 
        />
        <CategoryButton 
          category="gross" 
          active={activeCategory === 'gross'} 
          onClick={handleCategoryChange} 
          icon="🤢" 
          color="bg-orange-600" 
        />
      </section>

      {/* Main Content Area */}
      <main className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-50 rounded-full blur-3xl opacity-50"></div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-6"></div>
            <p className="text-indigo-600 font-bold text-xl animate-pulse">Brainstorming options...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">😵</div>
            <p className="text-red-500 font-semibold mb-6">{error}</p>
            <button 
              onClick={handleRegenerate}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : currentQuestion ? (
          <div className="space-y-12">
            <div className="text-center">
              <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                Would You Rather...
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 relative">
              {/* Option A */}
              <div className="flex-1 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-8 rounded-2xl shadow-lg transform transition hover:scale-[1.02] duration-300 flex items-center justify-center text-center">
                <p className="text-xl md:text-2xl font-bold leading-relaxed">
                  {currentQuestion.optionA}
                </p>
              </div>

              {/* OR Divider */}
              <div className="flex items-center justify-center">
                <div className="bg-white border-4 border-slate-100 shadow-md w-14 h-14 rounded-full flex items-center justify-center font-black text-slate-400 z-10 md:-mx-4">
                  OR
                </div>
              </div>

              {/* Option B */}
              <div className="flex-1 bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg transform transition hover:scale-[1.02] duration-300 flex items-center justify-center text-center">
                <p className="text-xl md:text-2xl font-bold leading-relaxed">
                  {currentQuestion.optionB}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <button
                onClick={handleRegenerate}
                className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition shadow-xl w-full sm:w-auto"
              >
                <span>🔄</span>
                <span>Give Me Another One!</span>
              </button>
            </div>
          </div>
        ) : null}
      </main>

      {/* History Section */}
      {history.length > 1 && (
        <section className="max-w-4xl w-full mt-16 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-fredoka text-slate-800">Previous Questions</h2>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {history.slice(1, 5).map((q) => (
              <div key={q.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm opacity-60 hover:opacity-100 transition duration-300">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{q.category}</span>
                   <span className="text-xs text-slate-300">{new Date(q.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-slate-600 text-sm italic">
                  "{q.optionA} OR {q.optionB}"
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto py-8 text-slate-400 text-sm">
        <p>© {new Date().getFullYear()} Middle School Friday Fun Generator. Built with Gemini AI.</p>
      </footer>
    </div>
  );
};

export default App;

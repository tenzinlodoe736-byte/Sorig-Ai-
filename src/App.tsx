/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HeartPulse, Languages, Send, Stethoscope, AlertTriangle, RefreshCw, ScrollText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { explainMedicalInfo, MedicalExplanation } from './services/geminiService';
import { cn } from './lib/utils';

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MedicalExplanation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    setError(null);
    try {
      const data = await explainMedicalInfo(input);
      setResult(data);
    } catch (err) {
      setError('An error occurred while processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans selection:bg-tibetan-gold/30">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-tibetan-red rounded-xl flex items-center justify-center shadow-lg shadow-tibetan-red/20 text-white">
              <Stethoscope size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight text-gray-900 flex items-center gap-2">
                Sorig AI
                <span className="text-xs font-medium bg-tibetan-gold/10 text-tibetan-gold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Health Interpreter
                </span>
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">Tibetan Medical Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 font-medium bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
               <Languages size={14} className="text-tibetan-blue" />
               EN / བོད་ཡིག
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Intro */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-block"
          >
            <span className="tibetan-text text-xl text-tibetan-red font-bold">བརྟག་དཔྱད་སློབ་སྟོན།</span>
          </motion.div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Accessible Medical Insights</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Paste your medical reports, symptoms, or lab results below. We will translate and explain them into clear Tibetan and English.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Section */}
          <section className="lg:col-span-5 space-y-6">
            <motion.div 
              layout
              className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm shadow-gray-200/50"
            >
              <form onSubmit={handleSubmit} id="medical-form" className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="medical-input" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <ScrollText size={18} className="text-tibetan-red" />
                    Input Information
                  </label>
                  <button 
                    type="button" 
                    onClick={handleReset}
                    className="text-xs text-gray-400 hover:text-tibetan-red transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <textarea
                  id="medical-input"
                  rows={8}
                  className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-tibetan-red/20 focus:border-tibetan-red outline-none transition-all resize-none text-sm leading-relaxed"
                  placeholder="Example: My AST level is 45 and I have a mild pain in my right side. What does this indicate?"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className={cn(
                    "w-full h-14 flex items-center justify-center gap-3 rounded-2xl font-bold text-lg transition-all active:scale-[0.98]",
                    loading || !input.trim() 
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                      : "bg-tibetan-red text-white shadow-lg shadow-tibetan-red/30 hover:bg-tibetan-red/90"
                  )}
                >
                  {loading ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Send size={20} />
                      Interpret Health
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Medical Disclaimer */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
              <div className="text-[11px] text-amber-900 leading-relaxed font-medium">
                <strong className='uppercase block mb-1'>Important Disclaimer</strong>
                Sorig AI is for educational and informational purposes only. It is not medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
              </div>
            </div>
          </section>

          {/* Results Section */}
          <section className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result && !loading && !error && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100 text-gray-300">
                    <HeartPulse size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-500 mb-2">Awaiting Input</h3>
                  <p className="text-sm text-gray-400 max-w-xs">
                    Please provide medical symptoms or report details to see a Tibetan interpretation.
                  </p>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 space-y-4"
                >
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-tibetan-red/10 border-t-tibetan-red rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Languages size={24} className="text-tibetan-red animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900">Interpreting...</p>
                    <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-widest">Translating to Tibetan</p>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 bg-red-50 rounded-3xl border border-red-100 text-center"
                >
                  <AlertTriangle className="text-red-500 mx-auto mb-4" size={40} />
                  <p className="text-red-900 font-bold mb-2">Oops!</p>
                  <p className="text-red-700 text-sm mb-6">{error}</p>
                  <button 
                    onClick={handleSubmit} 
                    className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 pb-12"
                >
                  {/* Results Toggle/Tabs can be added, but side by side is better for clarity */}
                  
                  {/* Tibetan Result (Top Priority) */}
                  <div className="bg-white rounded-3xl border-2 border-tibetan-gold/20 overflow-hidden shadow-xl shadow-tibetan-gold/5">
                    <div className="bg-tibetan-gold/10 px-6 py-3 border-b border-tibetan-gold/20 flex items-center justify-between">
                       <span className="tibetan-text font-bold text-tibetan-gold text-lg">བོད་སྐད་འགྲེལ་བཤད།</span>
                       <span className="text-[10px] font-bold text-tibetan-gold tracking-widest uppercase">Tibetan Explanation</span>
                    </div>
                    <div className="p-8 space-y-8">
                       <div className="space-y-4">
                         <h4 className="flex items-center gap-2 text-tibetan-red font-bold text-sm uppercase tracking-wider italic">
                            <span className="w-1.5 h-4 bg-tibetan-red rounded-full"></span>
                            <span className="tibetan-text text-base">རྒྱུ་མཚན་འགྲེལ་བཤད།</span>
                         </h4>
                         <div className="tibetan-text text-xl leading-[2] text-gray-800">
                           <ReactMarkdown>{result.tibetanExplanation}</ReactMarkdown>
                         </div>
                       </div>
                       
                       <div className="space-y-4 pt-8 border-t border-gray-100">
                         <h4 className="flex items-center gap-2 text-tibetan-blue font-bold text-sm uppercase tracking-wider italic">
                            <span className="w-1.5 h-4 bg-tibetan-blue rounded-full"></span>
                            <span className="tibetan-text text-base">སློབ་སྟོན་དང་ཐབས་ཤེས།</span>
                         </h4>
                         <div className="tibetan-text text-xl leading-[2] text-gray-800">
                           <ReactMarkdown>{result.tibetanSolutions}</ReactMarkdown>
                         </div>
                       </div>
                    </div>
                  </div>

                  {/* English Result */}
                  <div className="bg-white/60 rounded-3xl border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
                       <span className="font-bold text-gray-500 text-xs px-2 py-0.5 rounded border border-gray-200 uppercase tracking-widest">English Interpretation</span>
                    </div>
                    <div className="p-8 grid md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Overview</h4>
                         <div className="prose prose-sm text-gray-700 leading-relaxed">
                           <ReactMarkdown>{result.explanation}</ReactMarkdown>
                         </div>
                       </div>
                       <div className="space-y-4">
                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Actionable Tips</h4>
                         <div className="prose prose-sm text-gray-700 leading-relaxed">
                           <ReactMarkdown>{result.solutions}</ReactMarkdown>
                         </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
               <Stethoscope size={20} className="text-tibetan-red" />
               <span className="font-bold text-gray-900">Sorig AI</span>
            </div>
            <p className="text-xs text-gray-400 max-w-xs">
              Empowering the Tibetan community with accessible medical insights and modern health interpretation.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Built with Care & AI</p>
            <div className="flex gap-4">
              <span className="tibetan-text text-gray-300 text-lg">བོད་ཡིག</span>
              <span className="text-gray-300">|</span>
              <span className="text-xs font-bold text-gray-300 tracking-widest">INTERPRETER</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

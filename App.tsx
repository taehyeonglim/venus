
import React, { useState } from 'react';
import { AppState, AnalysisResult } from './types';
import { CameraView } from './components/CameraView';
import { ResultDisplay } from './components/ResultDisplay';
import { Button } from './components/ui/Button';
import { analyzeFace } from './services/geminiService';

export default function App() {
  const [state, setState] = useState<AppState>(AppState.WELCOME);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingMsg, setLoadingMsg] = useState('이미지 분석 중...');
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (image: string) => {
    setCapturedImage(image);
    setState(AppState.ANALYZING);
    setError(null);
    
    // Smooth loading messages
    const messages = [
      '황금비를 분석하고 있습니다...',
      '이목구비의 조화를 측정 중입니다...',
      '피부결과 톤을 확인하고 있습니다...',
      '최상의 스타일 제안을 생성하는 중...'
    ];
    
    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingMsg(messages[msgIndex]);
    }, 2000);

    try {
      const analysis = await analyzeFace(image);
      setResult(analysis);
      setState(AppState.RESULT);
    } catch (err: any) {
      setError(err.message || '분석에 실패했습니다.');
      setState(AppState.WELCOME);
    } finally {
      clearInterval(interval);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center">
      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold font-display bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          AI Face Insight
        </h1>
        <p className="text-slate-400 mt-2 font-medium">당신만의 고유한 매력을 발견해 보세요</p>
      </header>

      <main className="w-full max-w-4xl">
        {state === AppState.WELCOME && (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-slate-800 border border-slate-700 p-8 rounded-3xl space-y-6">
                <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl">🤳</span>
                </div>
                <h2 className="text-2xl font-bold text-white">시작해볼까요?</h2>
                <p className="text-slate-400 max-w-xs mx-auto">
                  정면 사진을 찍거나 업로드하면 AI가 당신의 매력 포인트를 분석해 드립니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button onClick={() => setState(AppState.CAPTURE)} className="sm:w-48">
                    카메라로 촬영
                  </Button>
                  <label className="sm:w-48 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-6 py-3 rounded-full font-semibold transition-all duration-200 cursor-pointer text-center">
                    사진 업로드
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
            </div>
            {error && <p className="text-rose-400 font-medium">{error}</p>}
          </div>
        )}

        {state === AppState.CAPTURE && (
          <CameraView 
            onCapture={handleCapture} 
            onCancel={() => setState(AppState.WELCOME)} 
          />
        )}

        {state === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center py-20 space-y-8">
            <div className="relative">
              <div className="w-32 h-32 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-4xl">🔍</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">{loadingMsg}</h2>
              <p className="text-slate-400">잠시만 기다려 주세요...</p>
            </div>
          </div>
        )}

        {state === AppState.RESULT && result && capturedImage && (
          <ResultDisplay 
            result={result} 
            image={capturedImage} 
            onRestart={() => setState(AppState.WELCOME)} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-slate-800 w-full max-w-4xl text-center text-slate-500 text-sm">
        <p>© 2024 AI Face Insight Project. Powered by Gemini Pro Vision.</p>
        <p className="mt-1">프라이버시 보호: 업로드된 이미지는 분석 즉시 삭제됩니다.</p>
      </footer>
    </div>
  );
}

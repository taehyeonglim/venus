
import React, { useState } from 'react';
import { AppState, AnalysisResult } from './types';
import { CameraView } from './components/CameraView';
import { ResultDisplay } from './components/ResultDisplay';
import { Button } from './components/ui/Button';
import { analyzeFace } from './services/geminiService';

// Venus Symbol Component
const VenusSymbol = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="venusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="50%" stopColor="#e879f9" />
        <stop offset="100%" stopColor="#f472b6" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="36" r="28" stroke="url(#venusGrad)" strokeWidth="6" />
    <line x1="50" y1="64" x2="50" y2="92" stroke="url(#venusGrad)" strokeWidth="6" strokeLinecap="round" />
    <line x1="36" y1="78" x2="64" y2="78" stroke="url(#venusGrad)" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

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

    const messages = [
      '비너스의 황금비를 분석하고 있습니다...',
      '이목구비의 조화를 측정 중입니다...',
      '피부결과 톤을 확인하고 있습니다...',
      '당신만의 아우라를 읽는 중...',
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
      <header className="mb-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <VenusSymbol className="w-10 h-10 md:w-12 md:h-12 animate-float" />
          <h1 className="text-4xl md:text-6xl font-bold font-display venus-gradient-text venus-glow tracking-wide">
            VENUS
          </h1>
        </div>
        <p className="text-xs md:text-sm text-purple-300/80 font-medium tracking-[0.3em] uppercase">
          AI Face Analytics
        </p>
        <p className="text-purple-200/60 mt-3 font-light text-sm md:text-base">
          당신만의 고유한 아름다움을 발견하세요
        </p>
      </header>

      <main className="w-full max-w-4xl">
        {state === AppState.WELCOME && (
          <div className="text-center space-y-8">
            <div className="relative group">
              {/* Glow Effect */}
              <div className="absolute -inset-1 venus-gradient rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-700"></div>

              {/* Main Card */}
              <div className="relative venus-card p-10 md:p-12 rounded-3xl space-y-8">
                {/* Venus Icon */}
                <div className="relative mx-auto w-28 h-28">
                  <div className="absolute inset-0 venus-gradient rounded-full blur-2xl opacity-30 animate-pulse-glow"></div>
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center venus-border">
                    <VenusSymbol className="w-14 h-14" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl md:text-3xl font-display font-semibold text-white">
                    아름다움을 측정하다
                  </h2>
                  <p className="text-purple-200/70 max-w-sm mx-auto leading-relaxed">
                    정면 사진을 촬영하거나 업로드하면<br />
                    AI가 당신의 매력 포인트를 분석합니다
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button onClick={() => setState(AppState.CAPTURE)} variant="primary" className="sm:w-52">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    카메라로 촬영
                  </Button>
                  <label className="sm:w-52 venus-btn-outline text-white px-6 py-3.5 rounded-full font-medium cursor-pointer text-center flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    사진 업로드
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </label>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-pink-500/5 rounded-full blur-2xl"></div>
              </div>
            </div>

            {error && (
              <div className="venus-card px-6 py-4 rounded-2xl border-pink-500/30 inline-block">
                <p className="text-pink-400 font-medium">{error}</p>
              </div>
            )}
          </div>
        )}

        {state === AppState.CAPTURE && (
          <CameraView
            onCapture={handleCapture}
            onCancel={() => setState(AppState.WELCOME)}
          />
        )}

        {state === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center py-20 space-y-10">
            {/* Loading Animation */}
            <div className="relative">
              {/* Outer Glow */}
              <div className="absolute inset-0 venus-gradient rounded-full blur-3xl opacity-30 animate-pulse"></div>

              {/* Spinning Ring */}
              <div className="relative w-36 h-36">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 border-r-pink-400 animate-spin"></div>

                {/* Center Icon */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center venus-border">
                  <VenusSymbol className="w-12 h-12 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="text-center space-y-3">
              <h2 className="text-2xl font-display font-semibold venus-gradient-text">
                {loadingMsg}
              </h2>
              <p className="text-purple-300/60 text-sm">잠시만 기다려 주세요...</p>

              {/* Progress Dots */}
              <div className="flex justify-center gap-2 pt-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full venus-gradient animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
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
      <footer className="mt-20 py-8 border-t border-purple-500/10 w-full max-w-4xl text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <VenusSymbol className="w-4 h-4 opacity-50" />
          <p className="text-purple-300/40 text-sm font-light">
            Project VENUS
          </p>
        </div>
        <p className="text-purple-300/30 text-xs">
          Powered by Gemini AI · 업로드된 이미지는 분석 즉시 삭제됩니다
        </p>
      </footer>
    </div>
  );
}

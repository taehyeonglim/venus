
import React, { useState, useEffect } from 'react';
import { AppState, AnalysisResult } from './types';
import { CameraView } from './components/CameraView';
import { ResultDisplay } from './components/ResultDisplay';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Button } from './components/ui/Button';
import { VenusLogo } from './components/ui/VenusLogo';
import { analyzeFace } from './services/geminiService';

const API_KEY_STORAGE_KEY = 'venus_gemini_api_key';

const Header = () => (
  <header className="w-full py-4 px-6 border-b border-[#FFB7C5]/10 mb-8">
    <div className="max-w-6xl mx-auto flex items-center gap-3">
      <VenusLogo className="w-8 h-8" />
      <h1 className="text-xl font-display font-semibold venus-gradient-text">V.E.N.U.S.</h1>
      <span className="text-[#9FE2BF]/60 text-xs font-light hidden sm:inline">Visual Enhancement & Next Upgrade Stylist</span>
    </div>
  </header>
);

const Footer = ({ apiKey, onOpenApiKeyModal }: { apiKey: string; onOpenApiKeyModal: () => void }) => (
  <footer className="w-full py-8 px-6 border-t border-[#FFB7C5]/10 mt-auto">
    <div className="max-w-6xl mx-auto text-center space-y-2">
      <div className="flex items-center justify-center gap-2">
        <VenusLogo className="w-5 h-5" />
        <span className="text-[#FFB7C5]/80 font-display font-semibold">V.E.N.U.S.</span>
      </div>
      <p className="text-[#9FE2BF]/60 text-sm italic font-display">
        Visual Enhancement & Next Upgrade Stylist
      </p>
      <p className="text-[#FFB7C5]/40 text-xs">
        &copy;2025-2026 Taehyeong Lim. All rights reserved.
      </p>
      {apiKey && (
        <button
          onClick={onOpenApiKeyModal}
          className="text-[#9FE2BF]/50 hover:text-[#9FE2BF] text-xs transition-colors inline-flex items-center gap-1 mt-2"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          API Key
        </button>
      )}
    </div>
  </footer>
);

export default function App() {
  const [state, setState] = useState<AppState>(AppState.WELCOME);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingMsg, setLoadingMsg] = useState('...');
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Load API Key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    setShowApiKeyModal(false);
    setError(null);
  };

  const handleStartCamera = () => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }
    setState(AppState.CAPTURE);
  };

  const handleCapture = async (image: string) => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

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
      const analysis = await analyzeFace(image, apiKey);
      setResult(analysis);
      setState(AppState.RESULT);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : '';
      setError(errorMsg);

      if (errorMsg.includes('API Key')) {
        setShowApiKeyModal(true);
      }

      setState(AppState.WELCOME);
    } finally {
      clearInterval(interval);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Show API Key modal if no key is set
  if (!apiKey || showApiKeyModal) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          {/* Title */}
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <VenusLogo className="w-10 h-10 md:w-12 md:h-12 animate-float" />
              <h1 className="text-4xl md:text-6xl font-bold font-display venus-gradient-text tracking-wide">
                V.E.N.U.S.
              </h1>
            </div>
            <p className="text-xs md:text-sm text-[#9FE2BF]/80 font-medium tracking-[0.3em] uppercase">
              AI Face Analytics
            </p>
          </div>

          <div className="w-full max-w-4xl">
            <ApiKeyModal
              onSubmit={handleApiKeySubmit}
              onClose={apiKey ? () => setShowApiKeyModal(false) : undefined}
              savedKey={apiKey}
            />
          </div>

          <p className="text-[#FFB7C5]/30 text-xs mt-8">
            API Key
          </p>
        </main>

        <Footer apiKey={apiKey} onOpenApiKeyModal={() => setShowApiKeyModal(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {state === AppState.WELCOME && (
          <>
            {/* Title */}
            <div className="mb-12 text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <VenusLogo className="w-10 h-10 md:w-12 md:h-12 animate-float" />
                <h1 className="text-4xl md:text-6xl font-bold font-display venus-gradient-text tracking-wide">
                  V.E.N.U.S.
                </h1>
              </div>
              <p className="text-xs md:text-sm text-[#9FE2BF]/80 font-medium tracking-[0.3em] uppercase">
                AI Face Analytics
              </p>
              <p className="text-[#FFB7C5]/60 mt-3 font-light text-sm md:text-base">
                당신만의 고유한 아름다움을 발견하세요
              </p>
            </div>

            <div className="w-full max-w-4xl text-center space-y-8">
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 venus-gradient rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-700"></div>

                {/* Main Card */}
                <div className="relative venus-card p-10 md:p-12 rounded-3xl space-y-8">
                  {/* Venus Icon */}
                  <div className="relative mx-auto w-28 h-28">
                    <div className="absolute inset-0 venus-gradient rounded-full blur-2xl opacity-30 animate-pulse-glow"></div>
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#FFB7C5]/20 to-[#9FE2BF]/20 flex items-center justify-center venus-border">
                      <VenusLogo className="w-14 h-14" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl md:text-3xl font-display font-semibold text-white">
                      아름다움을 측정하다
                    </h2>
                    <p className="text-[#9FE2BF]/70 max-w-sm mx-auto leading-relaxed">
                      정면 사진을 촬영하거나 업로드하면<br />
                      AI가 당신의 매력 포인트를 분석합니다
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button onClick={handleStartCamera} variant="primary" className="sm:w-52">
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
                  <div className="absolute top-4 right-4 w-20 h-20 bg-[#FFB7C5]/5 rounded-full blur-2xl"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-[#9FE2BF]/5 rounded-full blur-2xl"></div>
                </div>
              </div>

              {error && (
                <div className="venus-card px-6 py-4 rounded-2xl border-[#FFB7C5]/30 inline-block">
                  <p className="text-[#FFB7C5] font-medium">{error}</p>
                </div>
              )}
            </div>
          </>
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
                <div className="absolute inset-0 rounded-full border-4 border-[#FFB7C5]/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FFB7C5] border-r-[#9FE2BF] animate-spin"></div>

                {/* Center Icon */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#FFB7C5]/20 to-[#9FE2BF]/20 flex items-center justify-center venus-border">
                  <VenusLogo className="w-12 h-12 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="text-center space-y-3">
              <h2 className="text-2xl font-display font-semibold venus-gradient-text">
                {loadingMsg}
              </h2>
              <p className="text-[#9FE2BF]/60 text-sm">잠시만 기다려 주세요...</p>

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
            apiKey={apiKey}
          />
        )}
      </main>

      <Footer apiKey={apiKey} onOpenApiKeyModal={() => setShowApiKeyModal(true)} />
    </div>
  );
}

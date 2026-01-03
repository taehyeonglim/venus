
import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { simulateStyle } from '../services/geminiService';

interface StyleSimulationProps {
  originalImage: string;
  styleAdvice: string;
  apiKey: string;
  onClose: () => void;
}

export const StyleSimulation: React.FC<StyleSimulationProps> = ({
  originalImage,
  styleAdvice,
  apiKey,
  onClose,
}) => {
  const [simulatedImage, setSimulatedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  // ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    const runSimulation = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await simulateStyle(originalImage, styleAdvice, apiKey);
        setSimulatedImage(result);
      } catch (err: any) {
        setError(err.message || '스타일 시뮬레이션에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    runSimulation();
  }, [originalImage, styleAdvice, apiKey]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0a1d]/95 backdrop-blur-md cursor-pointer"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-2xl cursor-default" onClick={(e) => e.stopPropagation()}>
        {/* Glow Effect */}
        <div className="absolute -inset-1 venus-gradient rounded-3xl blur-xl opacity-30"></div>

        <div className="relative venus-card p-6 md:p-8 rounded-3xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-display font-semibold venus-gradient-text">
              스타일 시뮬레이션
            </h2>
            <button
              onClick={onClose}
              className="text-purple-400/60 hover:text-purple-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Style Advice */}
          <div className="mb-6 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <p className="text-purple-200/80 text-sm">
              <span className="text-purple-400 font-medium">적용 스타일: </span>
              {styleAdvice}
            </p>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-400 border-r-pink-400 animate-spin"></div>
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-purple-200 font-medium">스타일 변환 중...</p>
                <p className="text-purple-300/60 text-sm">AI가 새로운 스타일을 적용하고 있습니다</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-6">
              <div className="w-20 h-20 rounded-full bg-pink-500/20 flex items-center justify-center">
                <svg className="w-10 h-10 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="text-center space-y-2">
                <p className="text-pink-400 font-medium">{error}</p>
                <p className="text-purple-300/60 text-sm">
                  Gemini의 안전 정책으로 일부 스타일 변환이 제한될 수 있습니다
                </p>
              </div>
              <Button variant="outline" onClick={onClose}>
                돌아가기
              </Button>
            </div>
          ) : simulatedImage ? (
            <div className="space-y-6">
              {/* Image Comparison */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src={showOriginal ? originalImage : simulatedImage}
                  alt={showOriginal ? "원본" : "시뮬레이션"}
                  className="w-full h-full object-cover"
                />

                {/* Toggle Label */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[#0c0a1d]/80 backdrop-blur-sm border border-purple-500/30">
                  <span className="text-sm font-medium text-purple-200">
                    {showOriginal ? "원본" : "After"}
                  </span>
                </div>
              </div>

              {/* Toggle Button */}
              <div className="flex justify-center">
                <button
                  onMouseDown={() => setShowOriginal(true)}
                  onMouseUp={() => setShowOriginal(false)}
                  onMouseLeave={() => setShowOriginal(false)}
                  onTouchStart={() => setShowOriginal(true)}
                  onTouchEnd={() => setShowOriginal(false)}
                  className="px-6 py-3 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200 font-medium hover:bg-purple-500/30 transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  꾹 눌러서 원본 보기
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-4">
                <Button variant="outline" onClick={onClose}>
                  닫기
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = simulatedImage;
                    link.download = 'venus-style-simulation.png';
                    link.click();
                  }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  이미지 저장
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

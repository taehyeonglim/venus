
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a1a1a]/95 backdrop-blur-md cursor-pointer overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-md cursor-default my-auto" onClick={(e) => e.stopPropagation()}>
        {/* Glow Effect */}
        <div className="absolute -inset-1 venus-gradient rounded-2xl blur-xl opacity-30"></div>

        <div className="relative venus-card p-4 md:p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-display font-semibold venus-gradient-text">
              스타일 시뮬레이션
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#FFB7C5]/10 text-[#FFB7C5]/60 hover:text-[#9FE2BF] hover:bg-[#FFB7C5]/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Style Advice */}
          <div className="mb-4 p-3 rounded-lg bg-[#FFB7C5]/10 border border-[#FFB7C5]/20">
            <p className="text-[#9FE2BF]/80 text-xs">
              <span className="text-[#FFB7C5] font-medium">적용 스타일: </span>
              {styleAdvice}
            </p>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-[#FFB7C5]/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FFB7C5] border-r-[#FFB7C5] animate-spin"></div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[#9FE2BF] font-medium text-sm">스타일 변환 중...</p>
                <p className="text-[#9FE2BF]/60 text-xs">잠시만 기다려주세요</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFB7C5]/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#FFB7C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="text-center space-y-1">
                <p className="text-[#FFB7C5] font-medium text-sm">{error}</p>
                <p className="text-[#9FE2BF]/60 text-xs">
                  Gemini 정책으로 일부 변환이 제한될 수 있습니다
                </p>
              </div>
              <Button variant="outline" onClick={onClose}>
                돌아가기
              </Button>
            </div>
          ) : simulatedImage ? (
            <div className="space-y-4">
              {/* Image Comparison */}
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <img
                  src={showOriginal ? originalImage : simulatedImage}
                  alt={showOriginal ? "원본" : "시뮬레이션"}
                  className="w-full h-full object-cover"
                />

                {/* Toggle Label */}
                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-[#0a1a1a]/80 backdrop-blur-sm border border-[#FFB7C5]/30">
                  <span className="text-xs font-medium text-[#9FE2BF]">
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
                  className="px-4 py-2 rounded-full bg-[#FFB7C5]/20 border border-[#FFB7C5]/30 text-[#9FE2BF] text-sm font-medium hover:bg-[#FFB7C5]/30 transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  꾹 눌러서 원본 보기
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
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
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  저장
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

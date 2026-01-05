
import React, { useState } from 'react';
import { Button } from './ui/Button';

interface ApiKeyModalProps {
  onSubmit: (apiKey: string) => void;
  onClose?: () => void;
  savedKey?: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSubmit, onClose, savedKey }) => {
  const [apiKey, setApiKey] = useState(savedKey || '');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = apiKey.trim();

    if (!trimmedKey) {
      setError('API Key를 입력해 주세요');
      return;
    }

    if (!trimmedKey.startsWith('AIza')) {
      setError('유효한 Gemini API Key 형식이 아닙니다');
      return;
    }

    onSubmit(trimmedKey);
  };

  return (
    <div className="relative">
      {/* Glow Effect */}
      <div className="absolute -inset-1 venus-gradient rounded-3xl blur-xl opacity-20"></div>

      <div className="relative venus-card p-8 md:p-10 rounded-3xl space-y-6 max-w-md mx-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#FFB7C5]/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[#FFB7C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-semibold text-white">
            API Key 설정
          </h2>
          <p className="text-[#9FE2BF]/60 text-sm">
            Gemini API Key를 입력하면 얼굴 분석을 시작할 수 있습니다
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#9FE2BF]/80">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError('');
                }}
                placeholder="AIza..."
                className="w-full px-4 py-3 bg-[#0d2626]/50 border border-[#9FE2BF]/30 rounded-xl text-white placeholder-[#9FE2BF]/50 focus:outline-none focus:border-[#9FE2BF]/60 focus:ring-2 focus:ring-[#9FE2BF]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9FE2BF]/60 hover:text-[#9FE2BF] transition-colors"
              >
                {showKey ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {error && (
              <p className="text-[#FFB7C5] text-sm">{error}</p>
            )}
          </div>

          <Button type="submit" variant="primary" fullWidth>
            저장하고 시작하기
          </Button>
        </form>

        {/* Help Link */}
        <div className="text-center space-y-3 pt-2">
          <p className="text-[#9FE2BF]/50 text-xs">
            API Key가 없으신가요?
          </p>
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#FFB7C5] hover:text-[#FFC8D3] text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Google AI Studio에서 무료 발급받기
          </a>
        </div>

        {/* Privacy Note */}
        <p className="text-center text-[#9FE2BF]/30 text-xs">
          API Key는 브라우저에만 저장되며 서버로 전송되지 않습니다
        </p>

        {/* Close button if editing */}
        {onClose && savedKey && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#FFB7C5]/60 hover:text-[#FFB7C5] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

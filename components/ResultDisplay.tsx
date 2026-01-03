
import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { Button } from './ui/Button';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { StyleSimulation } from './StyleSimulation';
import { getAlternativeStyle } from '../services/geminiService';

interface ResultDisplayProps {
  result: AnalysisResult;
  image: string;
  onRestart: () => void;
  apiKey: string;
}

// Venus Symbol Component
const VenusSymbol = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none">
    <defs>
      <linearGradient id="venusGradResult" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="50%" stopColor="#e879f9" />
        <stop offset="100%" stopColor="#f472b6" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="36" r="28" stroke="url(#venusGradResult)" strokeWidth="6" />
    <line x1="50" y1="64" x2="50" y2="92" stroke="url(#venusGradResult)" strokeWidth="6" strokeLinecap="round" />
    <line x1="36" y1="78" x2="64" y2="78" stroke="url(#venusGradResult)" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, image, onRestart, apiKey }) => {
  const [showStyleSimulation, setShowStyleSimulation] = useState(false);
  const [currentStyleAdvice, setCurrentStyleAdvice] = useState(result.styleAdvice);
  const [previousStyles, setPreviousStyles] = useState<string[]>([]);
  const [isLoadingStyle, setIsLoadingStyle] = useState(false);
  const [styleError, setStyleError] = useState<string | null>(null);

  const handleGetAlternativeStyle = async () => {
    setIsLoadingStyle(true);
    setStyleError(null);
    try {
      const newStyle = await getAlternativeStyle(image, currentStyleAdvice, previousStyles, apiKey);
      setPreviousStyles([...previousStyles, currentStyleAdvice]);
      setCurrentStyleAdvice(newStyle);
    } catch (err: any) {
      setStyleError(err.message || '스타일 제안을 가져오는데 실패했습니다.');
    } finally {
      setIsLoadingStyle(false);
    }
  };

  const radarData = [
    { subject: '대칭성', A: result.categories.symmetry, fullMark: 100 },
    { subject: '피부', A: result.categories.skinTone, fullMark: 100 },
    { subject: '조화', A: result.categories.facialHarmony, fullMark: 100 },
    { subject: '분위기', A: result.categories.visualAura, fullMark: 100 },
  ];

  const getScoreLabel = (score: number) => {
    if (score >= 90) return '압도적 아름다움';
    if (score >= 80) return '눈부신 매력';
    if (score >= 70) return '매력적인 조화';
    if (score >= 60) return '자연스러운 아름다움';
    return '고유한 매력';
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Main Result Card */}
      <div className="relative">
        {/* Glow */}
        <div className="absolute -inset-1 venus-gradient rounded-3xl blur-xl opacity-20"></div>

        <div className="relative venus-card rounded-3xl overflow-hidden">
          {/* Header Section */}
          <div className="relative p-8 md:p-10 text-center">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>

            {/* Profile Image */}
            <div className="relative inline-block mb-6">
              <div className="absolute -inset-2 venus-gradient rounded-full blur-lg opacity-50"></div>
              <div className="relative">
                <img
                  src={image}
                  alt="Analyzed face"
                  className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-purple-400/50"
                />
                {/* Badge */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 venus-gradient px-3 py-1 rounded-full">
                  <span className="text-white text-xs font-medium tracking-wider">ANALYZED</span>
                </div>
              </div>
            </div>

            {/* Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <VenusSymbol className="w-8 h-8" />
                <h2 className="text-5xl md:text-6xl font-bold font-display venus-gradient-text">
                  {result.overallScore}
                </h2>
              </div>
              <p className="text-purple-300/80 font-medium">{getScoreLabel(result.overallScore)}</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-purple-500/10">
            {/* Radar Chart */}
            <div className="p-6 h-[280px]">
              <h3 className="text-xs font-medium text-purple-300/60 uppercase tracking-widest mb-4">
                분석 레이더
              </h3>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="rgba(192, 132, 252, 0.2)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: 'rgba(192, 132, 252, 0.7)', fontSize: 12 }}
                  />
                  <defs>
                    <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#c084fc" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#f472b6" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <Radar
                    name="Score"
                    dataKey="A"
                    stroke="url(#radarGradient)"
                    strokeWidth={2}
                    fill="url(#radarGradient)"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Celebrity & Features */}
            <div className="p-6 flex flex-col justify-center gap-6 bg-purple-500/5">
              <div>
                <h3 className="text-xs font-medium text-purple-300/60 uppercase tracking-widest mb-2">
                  닮은 꼴 연예인
                </h3>
                <p className="text-xl font-display font-semibold text-white">
                  {result.celebrityLookalike || '독보적인 아우라'}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-medium text-purple-300/60 uppercase tracking-widest mb-3">
                  최고의 강점
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.bestFeatures.map((feature, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full text-sm font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="p-6 md:p-8 space-y-4 border-t border-purple-500/10">
            {/* AI Feedback */}
            <div className="venus-card p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full venus-gradient flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-purple-200">AI 상세 피드백</h3>
              </div>
              <p className="text-purple-100/80 leading-relaxed text-sm italic">
                "{result.feedback}"
              </p>
            </div>

            {/* Style Advice */}
            <div className="relative overflow-hidden venus-card p-5 rounded-2xl border-purple-400/20">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-pink-300">스타일 제안</h3>
                  </div>
                  {/* Alternative Style Button */}
                  <button
                    onClick={handleGetAlternativeStyle}
                    disabled={isLoadingStyle}
                    className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium hover:bg-purple-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingStyle ? (
                      <>
                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        생성 중...
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        다른 스타일
                      </>
                    )}
                  </button>
                </div>
                <p className="text-purple-100/80 leading-relaxed text-sm mb-4">
                  {currentStyleAdvice}
                </p>
                {styleError && (
                  <p className="text-pink-400 text-xs mb-3">{styleError}</p>
                )}
                {/* Try Style Button */}
                <button
                  onClick={() => setShowStyleSimulation(true)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-pink-500/30 text-pink-300 text-sm font-medium hover:from-purple-500/30 hover:to-pink-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  이 스타일 AI로 적용해보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Style Simulation Modal */}
      {showStyleSimulation && (
        <StyleSimulation
          originalImage={image}
          styleAdvice={currentStyleAdvice}
          apiKey={apiKey}
          onClose={() => setShowStyleSimulation(false)}
        />
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button fullWidth onClick={onRestart} variant="outline">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          다시 측정하기
        </Button>
        <Button fullWidth onClick={() => window.print()} variant="primary">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          결과 저장하기
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-purple-300/40 text-xs leading-relaxed">
        이 결과는 AI의 가상 분석이며 실제 외모의 절대적인 지표가 아닙니다.<br />
        <span className="text-purple-300/60 font-medium">당신은 그 자체로 충분히 아름답습니다.</span>
      </p>
    </div>
  );
};


import React from 'react';
import { AnalysisResult } from '../types';
import { Button } from './ui/Button';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ResultDisplayProps {
  result: AnalysisResult;
  image: string;
  onRestart: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, image, onRestart }) => {
  const radarData = [
    { subject: '대칭성', A: result.categories.symmetry, fullMark: 100 },
    { subject: '피부', A: result.categories.skinTone, fullMark: 100 },
    { subject: '조화', A: result.categories.facialHarmony, fullMark: 100 },
    { subject: '분위기', A: result.categories.visualAura, fullMark: 100 },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-8 text-center space-y-4">
          <div className="relative inline-block">
            <img 
              src={image} 
              alt="Analyzed face" 
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 mx-auto"
            />
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              AI ANALYZED
            </div>
          </div>
          
          <div>
            <h2 className="text-5xl font-extrabold font-display bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {result.overallScore}점
            </h2>
            <p className="text-slate-400 font-medium">종합 매력 지수</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-slate-700">
          <div className="p-6 h-[250px]">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">분석 레이더</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#475569" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="p-6 flex flex-col justify-center gap-4 bg-slate-900/30">
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">닮은 꼴 연예인</h3>
              <p className="text-xl font-bold text-white">{result.celebrityLookalike || '매력적인 독보적 분위기'}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">최고의 강점</h3>
              <div className="flex flex-wrap gap-2">
                {result.bestFeatures.map((feature, i) => (
                  <span key={i} className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/20">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-indigo-400">✨</span> AI 상세 피드백
            </h3>
            <p className="text-slate-300 leading-relaxed italic">"{result.feedback}"</p>
          </div>

          <div className="bg-indigo-600/10 p-6 rounded-2xl border border-indigo-500/20">
            <h3 className="text-lg font-bold text-indigo-400 mb-2 flex items-center gap-2">
              <span className="text-indigo-400">💡</span> 스타일 제안
            </h3>
            <p className="text-slate-300">{result.styleAdvice}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button fullWidth onClick={onRestart} variant="outline">다시 측정하기</Button>
        <Button fullWidth onClick={() => window.print()} variant="primary">결과 저장하기</Button>
      </div>
      
      <p className="text-center text-slate-500 text-sm">
        이 결과는 AI의 가상 분석이며 실제 외모의 절대적인 지표가 아닙니다.<br/>
        당신은 그 자체로 충분히 아름답습니다.
      </p>
    </div>
  );
};

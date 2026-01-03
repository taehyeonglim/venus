
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button } from './ui/Button';

interface CameraViewProps {
  onCapture: (base64Image: string) => void;
  onCancel: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('카메라를 시작할 수 없습니다. 권한을 확인해 주세요.');
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.85);
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-[500px] object-cover scale-x-[-1]"
      />
      <canvas ref={canvasRef} className="hidden" />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center bg-slate-900/90 backdrop-blur-sm">
          <p className="text-rose-400 font-medium">{error}</p>
        </div>
      )}

      <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col gap-4 bg-gradient-to-t from-slate-950/80 to-transparent">
        <div className="flex justify-center gap-4">
          <Button variant="secondary" onClick={onCancel}>취소</Button>
          <Button onClick={capturePhoto} className="px-10 h-16 w-16 !p-0">
            <div className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-white scale-90 hover:scale-100 transition-transform"></div>
            </div>
          </Button>
        </div>
        <p className="text-center text-slate-300 text-sm">얼굴이 가이드 안에 정면으로 오게 해주세요</p>
      </div>
      
      {/* Visual Guide Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-64 h-80 border-2 border-white/20 rounded-[120px] shadow-[0_0_0_1000px_rgba(15,23,42,0.4)]"></div>
      </div>
    </div>
  );
};

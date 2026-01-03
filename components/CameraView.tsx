
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
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glow Effect */}
      <div className="absolute -inset-1 venus-gradient rounded-3xl blur-xl opacity-30"></div>

      {/* Camera Container */}
      <div className="relative overflow-hidden rounded-3xl venus-card">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-[500px] object-cover scale-x-[-1]"
        />
        <canvas ref={canvasRef} className="hidden" />

        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center bg-[#0c0a1d]/95 backdrop-blur-md">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-pink-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-pink-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Visual Guide Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Face Guide */}
          <div className="relative w-64 h-80">
            {/* Gradient Border */}
            <div className="absolute inset-0 rounded-[120px] p-[2px] bg-gradient-to-br from-purple-400/50 via-pink-400/30 to-purple-400/50">
              <div className="w-full h-full rounded-[118px] bg-transparent"></div>
            </div>
            {/* Corner Accents */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 venus-gradient rounded-full"></div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 venus-gradient rounded-full"></div>
          </div>
          {/* Dark Overlay Outside Guide */}
          <div className="absolute inset-0 bg-[#0c0a1d]/50" style={{
            maskImage: 'radial-gradient(ellipse 128px 160px at center, transparent 100%, black 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 128px 160px at center, transparent 100%, black 100%)'
          }}></div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col gap-4 bg-gradient-to-t from-[#0c0a1d]/90 via-[#0c0a1d]/50 to-transparent">
          <div className="flex justify-center items-center gap-6">
            {/* Cancel Button */}
            <Button variant="ghost" onClick={onCancel} className="!px-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>

            {/* Capture Button */}
            <button
              onClick={capturePhoto}
              className="relative group"
            >
              {/* Outer Ring */}
              <div className="w-20 h-20 rounded-full p-1 venus-gradient">
                <div className="w-full h-full rounded-full bg-[#0c0a1d] p-1">
                  {/* Inner Button */}
                  <div className="w-full h-full rounded-full venus-gradient opacity-80 group-hover:opacity-100 group-active:scale-90 transition-all duration-200 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 group-hover:bg-white transition-colors"></div>
                  </div>
                </div>
              </div>
              {/* Glow */}
              <div className="absolute inset-0 rounded-full venus-gradient blur-xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
            </button>

            {/* Placeholder for symmetry */}
            <div className="w-14"></div>
          </div>

          <p className="text-center text-purple-200/60 text-sm">
            얼굴이 가이드 안에 정면으로 오게 해주세요
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import { MediaCardProps } from '@/types/Media';
import { Play, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MediaCard({ item, type }: MediaCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const handleLoadComplete = () => {
    setIsLoading(false);
    setIsError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleMediaClick = () => {
    if (type === 'video' && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div 
      className="group relative h-full w-full overflow-hidden rounded-xl shadow-lg transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl dark:bg-card dark:text-card-foreground"
      onClick={handleMediaClick}
      role={type === 'video' ? 'button' : 'img'}
      tabIndex={0}
      aria-label={`${type === 'video' ? 'Play' : 'View'} ${item.title}`}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90">
          <p className="text-white">Failed to load media</p>
          <button 
            className="mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Media Content */}
      {type === 'image' ? (
        <img
          src={item.src}
          alt={item.title}
          className={cn(
            "h-full w-full object-cover rounded-xl transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1",
            isLoading && "opacity-0",
            isError && "hidden"
          )}
          onLoad={handleLoadComplete}
          onError={handleError}
        />
      ) : (
        <>
          <video
            ref={videoRef}
            src={item.src}
            className={cn(
              "h-full w-full object-cover rounded-xl transition-all duration-700 ease-in-out group-hover:scale-110 group-hover:rotate-1",
              isLoading && "opacity-0",
              isError && "hidden"
            )}
            playsInline
            muted={isMuted}
            loop
            onLoadedData={handleLoadComplete}
            onError={handleError}
          />
          {/* Video Controls Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            <Play
              className="h-16 w-16 text-white drop-shadow-lg transform transition-transform duration-300 group-hover:scale-110"
              fill="white"
              strokeWidth={1.5}
            />
            <button
              className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors duration-300"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-white" />
              ) : (
                <Volume2 className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Title and Info */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent transform translate-y-full transition-transform duration-500 group-hover:translate-y-0">
        <h3 className="text-lg font-semibold text-white line-clamp-1">{item.title}</h3>
        <p className="mt-1 text-sm text-gray-300 line-clamp-2">{item.description}</p>
      </div>

      {/* Focus Ring */}
      <div className="absolute inset-0 rounded-xl ring-2 ring-transparent ring-offset-2 ring-offset-transparent transition-all duration-300 group-focus-visible:ring-blue-500" />
    </div>
  );
}

import React, { useState } from 'react';
import { Play, ExternalLink, Video } from 'lucide-react';
import { cn } from '../../lib/cn';

function YouTubeLogoIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function getYouTubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function YouTubeEmbedLite({ youtubeUrl, title = 'Recipe video tutorial', className }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = getYouTubeId(youtubeUrl);

  if (!youtubeUrl || !videoId) {
    return (
      <div className={cn('p-6 rounded-3xl bg-[#FDFBF8] hairline-border border-[#E7DCD1] text-center space-y-3', className)}>
        <Video className="w-8 h-8 text-[#E2673F] mx-auto opacity-70" />
        <p className="text-sm font-medium text-[#6B6259]">
          No video tutorial available for this recipe.
        </p>
      </div>
    );
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className={cn('overflow-hidden rounded-3xl bg-[#2B2622] hairline-border border-[#E7DCD1] shadow-lg relative group', className)}>
      {!isPlaying ? (
        <div className="relative aspect-video w-full overflow-hidden cursor-pointer" onClick={() => setIsPlaying(true)}>
          {/* Thumbnail image */}
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 flex flex-col justify-between p-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <YouTubeLogoIcon className="w-3.5 h-3.5" />
                YouTube Guide
              </span>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white bg-black/40 hover:bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm transition-colors"
              >
                Watch on YouTube <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>

            <div className="flex items-center gap-4">
              {/* Play Button */}
              <div className="w-14 h-14 rounded-full bg-[#E2673F] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform shrink-0">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
              <div>
                <h4 className="text-white text-lg font-serif font-medium line-clamp-1">
                  {title}
                </h4>
                <p className="text-xs text-white/70">Click to play embedded video guide</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      )}
    </div>
  );
}

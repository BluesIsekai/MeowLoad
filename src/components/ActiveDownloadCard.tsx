import React from 'react';
import { ProgressData } from '../hooks/useDownloader';

interface ActiveDownloadCardProps {
  id: string;
  title: string;
  thumbnail: string;
  progress: ProgressData | null;
  onCancel: (id: string) => void;
  onOpenFolder: (path: string) => void;
  outputDir: string;
}

export const ActiveDownloadCard: React.FC<ActiveDownloadCardProps> = ({
  id,
  title,
  thumbnail,
  progress,
  onCancel,
  onOpenFolder,
  outputDir,
}) => {
  const percentage = progress?.percentage || 0;

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-md hover:bg-[#202023] transition-colors group">
      <div className="flex gap-md">
        {/* Thumbnail */}
        <div className="w-40 aspect-video bg-surface-container rounded-lg overflow-hidden shrink-0 relative border border-[#27272A]">
          <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
          <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono-label text-white">
            DOWNLOADING
          </div>
        </div>

        {/* Info & Live Progress */}
        <div className="flex-1 flex flex-col justify-between py-xs min-w-0">
          <div>
            <div className="flex justify-between items-start gap-md">
              <h3 className="font-label-md text-label-md text-on-surface truncate font-semibold">{title}</h3>
              <span className="inline-flex items-center gap-1 bg-[#6366F1]/10 text-[#6366F1] px-2 py-0.5 rounded text-xs font-medium border border-[#6366F1]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-pulse" />
                Downloading
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex justify-between items-end mb-1.5">
              <div className="flex gap-lg font-mono-label text-mono-label text-on-surface-variant">
                <span>{percentage.toFixed(1)}%</span>
                <span>{progress?.speed || '0B/s'}</span>
                <span>ETA: {progress?.eta || '--:--'}</span>
              </div>
            </div>
            <div className="w-full bg-[#27272A] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#6366F1] h-full rounded-full progress-bar-glow transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 justify-center shrink-0 border-l border-[#27272A] pl-md ml-xs">
          <button
            onClick={() => onOpenFolder(outputDir)}
            className="p-2 rounded-lg bg-surface hover:bg-surface-container-high border border-surface-variant text-on-surface-variant hover:text-on-surface transition-colors"
            title="Open Destination Folder"
          >
            <span className="material-symbols-outlined text-sm">folder</span>
          </button>
          <button
            onClick={() => onCancel(id)}
            className="p-2 rounded-lg bg-surface hover:bg-error/10 border border-surface-variant hover:border-error/30 text-on-surface-variant hover:text-error transition-colors"
            title="Cancel Download"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
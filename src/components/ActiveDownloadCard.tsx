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
    <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 hover:bg-[#202023] transition-colors text-[#e4e1ed]">
      <div className="flex gap-4 items-center">
        {/* Thumbnail Preview */}
        <div className="w-40 aspect-video bg-[#1f1f27] rounded-lg overflow-hidden shrink-0 relative border border-[#27272A]">
          {thumbnail ? (
            <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-[#908fa0]">
              No Thumbnail
            </div>
          )}
          <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono text-white">
            DOWNLOADING
          </div>
        </div>

        {/* Info & Live Download Progress */}
        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
          <div>
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-sm font-semibold text-[#e4e1ed] truncate">{title}</h3>
              <span className="inline-flex items-center gap-1.5 bg-[#6366F1]/10 text-[#6366F1] px-2.5 py-0.5 rounded text-xs font-medium border border-[#6366F1]/20 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-pulse" />
                Downloading
              </span>
            </div>

            {/* Save Location Display */}
            <p className="text-xs text-[#908fa0] mt-1 truncate">
              Saving to: <span className="text-[#c7c4d7] font-mono">{outputDir || '~/Downloads'}</span>
            </p>
          </div>

          <div className="mt-3">
            <div className="flex justify-between items-end mb-1.5 font-mono text-xs text-[#c7c4d7]">
              <div className="flex gap-4">
                <span>{percentage.toFixed(1)}%</span>
                <span>{progress?.speed || '0 B/s'}</span>
                <span>ETA: {progress?.eta || '--:--'}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#27272A] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#6366F1] h-full rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col gap-2 justify-center shrink-0 border-l border-[#27272A] pl-4 ml-1">
          <button
            onClick={() => onOpenFolder(outputDir)}
            className="p-2 rounded-lg bg-[#13131b] hover:bg-[#34343d] border border-[#34343d] text-[#c7c4d7] hover:text-white transition-colors"
            title="Open Destination Folder"
          >
            <span className="material-symbols-outlined text-sm">folder</span>
          </button>
          <button
            onClick={() => onCancel(id)}
            className="p-2 rounded-lg bg-[#13131b] hover:bg-red-950/40 border border-[#34343d] hover:border-red-800 text-[#c7c4d7] hover:text-red-400 transition-colors"
            title="Cancel Download"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      </div>
    </div>
  );
};
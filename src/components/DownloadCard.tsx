import React, { useState, useEffect } from 'react';
import { downloadDir } from '@tauri-apps/api/path';
import { ProgressData } from '../hooks/useDownloader';

interface Format {
  format_id: string;
  ext: string;
  resolution?: string;
  vcodec?: string;
  acodec?: string;
  format_note?: string;
  height?: number;
}

interface MediaMetadata {
  title: string;
  thumbnail: string;
  duration: number;
  formats: Format[];
}

interface DownloadCardProps {
  id: string;
  url: string;
  metadata: MediaMetadata;
  progress: ProgressData | null;
  isDownloading: boolean;
  onStartDownload: (
    id: string,
    url: string,
    formatId: string,
    outputDir: string,
    container: string
  ) => void;
  onCancelDownload: (id: string) => void;
  onOpenFolder: (path: string) => void;
}

export const DownloadCard: React.FC<DownloadCardProps> = ({
  id,
  url,
  metadata,
  progress,
  isDownloading,
  onStartDownload,
  onCancelDownload,
  onOpenFolder,
}) => {
  // Filter out storyboards, images, and non-media streams
  const validFormats = (metadata.formats || []).filter((fmt) => {
    const isStoryboard =
      fmt.format_id.startsWith('sb') || (fmt.vcodec === 'none' && fmt.acodec === 'none');
    const isM3u8 = fmt.ext === 'm3u8';
    return !isStoryboard && !isM3u8 && fmt.height; // Only keep entries with height
  });

  // Deduplicate resolutions (grouping by height like 1080p, 720p, 480p) [cite: 718]
  const uniqueResolutions = Array.from(
    new Map(validFormats.map((item) => [item.height, item])).values()
  ).sort((a, b) => (b.height || 0) - (a.height || 0));

  const [selectedResolution, setSelectedResolution] = useState<string>('best');
  const [container, setContainer] = useState<string>('mp4'); // Default output container: mp4
  const [outputDir, setOutputDir] = useState<string>('');

  useEffect(() => {
    downloadDir().then((dir) => setOutputDir(dir));
  }, []);

  const handleDownload = () => {
    let formatSpecifier = selectedResolution;
    if (selectedResolution !== 'best' && selectedResolution !== 'bestaudio') {
      formatSpecifier = `${selectedResolution}+bestaudio/best`; // Auto stitch best audio [cite: 719]
    } else if (selectedResolution === 'best') {
      formatSpecifier = 'bestvideo+bestaudio/best';
    }

    onStartDownload(id, url, formatSpecifier, outputDir, container);
  };

  // Helper to format video duration nicely
  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-5 my-4 max-w-3xl mx-auto shadow-xl text-white backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        
        {metadata.thumbnail && (
          <div className="relative w-full sm:w-56 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shadow-inner">
            <img
              src={metadata.thumbnail}
              alt={metadata.title}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded font-mono font-medium border border-white/10">
              {formatDuration(metadata.duration)}
            </span>
          </div>
        )}

        {/* DETAILS & CONTROLS */}
        <div className="flex-1 flex flex-col justify-between w-full min-h-[8rem]">
          <div>
            <h3 className="font-bold text-base leading-snug line-clamp-2 text-slate-100">
              {metadata.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Duration: {formatDuration(metadata.duration)}
            </p>
          </div>

          {!isDownloading && (
            <div className="flex flex-wrap items-center gap-2.5 mt-4">
              {/* Quality Selector */}
              <select
                value={selectedResolution}
                onChange={(e) => setSelectedResolution(e.target.value)}
                className="bg-slate-900/80 text-xs text-slate-200 rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="best">Best Quality (Auto)</option>
                {uniqueResolutions.map((fmt) => (
                  <option key={fmt.format_id} value={fmt.format_id}>
                    {fmt.height}p ({fmt.resolution || 'HD'})
                  </option>
                ))}
                <option value="bestaudio">Audio Only (MP3/M4A)</option>
              </select>

              {/* Format Container Selector */}
              <select
                value={container}
                onChange={(e) => setContainer(e.target.value)}
                className="bg-slate-900/80 text-xs text-slate-200 rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="mp4">MP4</option>
                <option value="mkv">MKV</option>
                <option value="webm">WebM</option>
              </select>

              <button
                onClick={handleDownload}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold rounded-lg transition-colors shadow-md ml-auto"
              >
                Download
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DOWNLOAD PROGRESS & STATUS */}
      {isDownloading && progress && (
        <div className="mt-5 pt-4 border-t border-slate-700/80">
          <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
            <span>Downloading... {progress.percentage.toFixed(1)}%</span>
            <span>
              Speed: {progress.speed} | ETA: {progress.eta}
            </span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-2.5 mb-3 overflow-hidden border border-slate-700/50">
            <div
              className="bg-indigo-500 h-full transition-all duration-200 rounded-full"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => onOpenFolder(outputDir)}
              className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
            >
              Open Destination Folder
            </button>

            <button
              onClick={() => onCancelDownload(id)}
              className="px-3 py-1 bg-rose-600/90 hover:bg-rose-500 text-xs font-semibold rounded-md transition-colors"
            >
              Cancel Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
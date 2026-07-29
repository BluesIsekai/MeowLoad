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
  onStartDownload: (id: string, url: string, formatId: string, outputDir: string, container: string) => void;
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
    const isStoryboard = fmt.format_id.startsWith('sb') || (fmt.vcodec === 'none' && fmt.acodec === 'none');
    const isM3u8 = fmt.ext === 'm3u8';
    return !isStoryboard && !isM3u8 && fmt.height; // Only keep entries with height (resolutions)
  });

  // Deduplicate resolutions (grouping by height like 1080p, 720p, 480p)
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
    // If a specific format ID was picked, merge it with best audio!
    let formatSpecifier = selectedResolution;
    if (selectedResolution !== 'best' && selectedResolution !== 'bestaudio') {
      formatSpecifier = `${selectedResolution}+bestaudio/best`;
    } else if (selectedResolution === 'best') {
      formatSpecifier = 'bestvideo+bestaudio/best';
    }

    onStartDownload(id, url, formatSpecifier, outputDir, container);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 my-4 max-w-3xl mx-auto shadow-lg text-white">
      <div className="flex gap-4">
        {metadata.thumbnail && (
          <img
            src={metadata.thumbnail}
            alt={metadata.title}
            className="w-40 h-24 object-cover rounded-md border border-slate-700"
          />
        )}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2">{metadata.title}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Duration: {Math.floor(metadata.duration / 60)}m {metadata.duration % 60}s
            </p>
          </div>

          {!isDownloading && (
            <div className="flex flex-wrap items-center gap-3 mt-4">
              {/* Quality Selection Dropdown */}
              <select
                value={selectedResolution}
                onChange={(e) => setSelectedResolution(e.target.value)}
                className="bg-slate-700 text-sm rounded px-3 py-1.5 border border-slate-600 focus:outline-none"
              >
                <option value="best">Best Quality (Auto)</option>
                {uniqueResolutions.map((fmt) => (
                  <option key={fmt.format_id} value={fmt.format_id}>
                    {fmt.height}p ({fmt.resolution || 'HD'})
                  </option>
                ))}
                <option value="bestaudio">Audio Only (MP3/M4A)</option>
              </select>

              {/* Format / Container Selection Dropdown */}
              <select
                value={container}
                onChange={(e) => setContainer(e.target.value)}
                className="bg-slate-700 text-sm rounded px-3 py-1.5 border border-slate-600 focus:outline-none"
              >
                <option value="mp4">MP4</option>
                <option value="mkv">MKV</option>
                <option value="webm">WebM</option>
              </select>

              <button
                onClick={handleDownload}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-sm font-medium rounded transition-colors"
              >
                Download
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Progress & Controls */}
      {isDownloading && progress && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex justify-between text-xs text-slate-300 mb-1">
            <span>Downloading... {progress.percentage.toFixed(1)}%</span>
            <span>
              Speed: {progress.speed} | ETA: {progress.eta}
            </span>
          </div>

          <div className="w-full bg-slate-700 rounded-full h-2 mb-3 overflow-hidden">
            <div
              className="bg-indigo-500 h-full transition-all duration-150"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => onOpenFolder(outputDir)}
              className="text-xs text-indigo-400 hover:underline"
            >
              Open Destination Folder
            </button>

            <button
              onClick={() => onCancelDownload(id)}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-xs font-medium rounded"
            >
              Cancel Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
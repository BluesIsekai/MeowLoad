import React, { useState, useEffect } from 'react';
import { downloadDir } from '@tauri-apps/api/path';

interface Format {
  format_id: string;
  ext: string;
  resolution?: string;
  vcodec?: string;
  acodec?: string;
  height?: number;
}

interface InspectedMediaCardProps {
  id: string;
  url: string;
  metadata: {
    title: string;
    thumbnail: string;
    duration: number;
    uploader?: string;
    formats: Format[];
  };
  onStartDownload: (
    id: string,
    url: string,
    formatSpecifier: string,
    outputDir: string,
    container: string
  ) => void;
}

export const InspectedMediaCard: React.FC<InspectedMediaCardProps> = ({
  id,
  url,
  metadata,
  onStartDownload,
}) => {
  // Deduplicate format resolutions by height (keep non-storyboard video formats)
  const validFormats = (metadata.formats || []).filter(
    (fmt) => fmt.height && fmt.vcodec !== 'none'
  );
  const uniqueResolutions = Array.from(
    new Map(validFormats.map((item) => [item.height, item])).values()
  ).sort((a, b) => (b.height || 0) - (a.height || 0));

  const [selectedResolution, setSelectedResolution] = useState<string>('best');
  const [container, setContainer] = useState<string>('mp4');
  const [outputDir, setOutputDir] = useState<string>('');

  useEffect(() => {
    downloadDir()
      .then((dir) => setOutputDir(dir || ''))
      .catch((err) => console.error('Failed to resolve download directory:', err));
  }, []);

  const handleDownload = () => {
    let formatSpecifier = selectedResolution;
    if (selectedResolution !== 'best' && selectedResolution !== 'bestaudio') {
      formatSpecifier = `${selectedResolution}+bestaudio/best`;
    } else if (selectedResolution === 'best') {
      formatSpecifier = 'bestvideo+bestaudio/best';
    }

    const targetContainer = container || 'mp4';
    onStartDownload(id, url, formatSpecifier, outputDir, targetContainer);
  };

  const formatTime = (secs: number) => {
    if (!secs) return '0:00';
    const mins = Math.floor(secs / 60);
    const remainingSecs = String(secs % 60).padStart(2, '0');
    return `${mins}:${remainingSecs}`;
  };

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 sticky top-4 text-[#e4e1ed]">
      {/* Inspected Status Badge */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#27272A]">
        <span className="material-symbols-outlined text-[#00a572]">check_circle</span>
        <span className="text-sm font-medium text-[#e4e1ed]">URL Inspected</span>
      </div>

      {/* Thumbnail Container */}
      <div className="w-full aspect-video bg-[#1f1f27] rounded-lg overflow-hidden mb-4 relative border border-[#27272A]">
        <img
          src={metadata.thumbnail}
          alt={metadata.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs font-mono text-white">
          {formatTime(metadata.duration)}
        </div>
      </div>

      {/* Title & Uploader */}
      <h3 className="text-sm font-semibold text-[#e4e1ed] mb-1 line-clamp-2">
        {metadata.title}
      </h3>
      <p className="text-xs text-[#c7c4d7] mb-6">
        {metadata.uploader || 'Unknown Creator'}
      </p>

      {/* Options */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-[#c7c4d7] mb-1">Quality</label>
          <select
            value={selectedResolution}
            onChange={(e) => setSelectedResolution(e.target.value)}
            className="w-full bg-[#27272A] border border-[#34343d] rounded-lg px-3 py-2 text-xs text-[#e4e1ed] focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] focus:outline-none"
          >
            <option value="best">Best Quality (Auto)</option>
            {uniqueResolutions.map((fmt) => (
              <option key={fmt.format_id} value={fmt.format_id}>
                {fmt.height}p ({fmt.resolution || 'HD'})
              </option>
            ))}
            <option value="bestaudio">Audio Only (MP3/M4A)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-[#c7c4d7] mb-1">Format Container</label>
          <select
            value={container}
            onChange={(e) => setContainer(e.target.value)}
            className="w-full bg-[#27272A] border border-[#34343d] rounded-lg px-3 py-2 text-xs text-[#e4e1ed] focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] focus:outline-none"
          >
            <option value="mp4">MP4</option>
            <option value="mkv">MKV</option>
            <option value="webm">WebM</option>
          </select>
        </div>

        <button
          onClick={handleDownload}
          className="w-full mt-4 bg-[#00a572] hover:bg-[#008f63] text-[#002113] text-sm font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,165,114,0.2)] hover:shadow-[0_0_20px_rgba(0,165,114,0.4)] active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-sm">download</span>
          Start Download
        </button>
      </div>
    </div>
  );
};
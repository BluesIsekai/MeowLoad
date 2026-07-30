import React, { useState, useEffect } from 'react';
import { downloadDir } from '@tauri-apps/api/path';

export interface Format {
  format_id: string;
  ext: string;
  resolution?: string;
  vcodec?: string;
  acodec?: string;
  height?: number;
  width?: number;
  fps?: number;
  filesize?: number;
  filesize_approx?: number;
}

export interface InspectedMediaCardProps {
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
  const [downloadType, setDownloadType] = useState<'video' | 'audio'>('video');
  const [selectedResolution, setSelectedResolution] = useState<string>('best');
  const [audioQuality, setAudioQuality] = useState<string>('0');
  const [videoContainer, setVideoContainer] = useState<string>('mp4');
  const [audioContainer, setAudioContainer] = useState<string>('mp3');
  const [downloadSubtitles, setDownloadSubtitles] = useState<boolean>(false);
  const [subtitleMode, setSubtitleMode] = useState<'embed' | 'file'>('embed');
  const [subtitleLang, setSubtitleLang] = useState<string>('en');
  const [outputDir, setOutputDir] = useState<string>('');

  useEffect(() => {
    downloadDir()
      .then((dir) => setOutputDir(dir || ''))
      .catch((err) => console.error('Failed to resolve download directory:', err));
  }, []);

  // Filter out storyboards, images, and non-video formats
  const validFormats = (metadata?.formats || []).filter(
    (fmt) => fmt.height && fmt.vcodec && fmt.vcodec !== 'none' && !fmt.format_id.startsWith('sb')
  );

  // Deduplicate format resolutions by height (keep highest quality format per height)
  const uniqueResolutions = Array.from(
    new Map(validFormats.map((item) => [item.height, item])).values()
  ).sort((a, b) => (b.height || 0) - (a.height || 0));

  const handleDownload = () => {
    let formatSpecifier: string;
    let targetContainer: string;

    if (downloadType === 'audio' || selectedResolution === 'bestaudio') {
      formatSpecifier = `bestaudio/best:${audioQuality}`;
      targetContainer = audioContainer || 'mp3';
    } else {
      if (selectedResolution === 'best') {
        formatSpecifier = 'bestvideo+bestaudio/best';
      } else {
        formatSpecifier = `${selectedResolution}+bestaudio/best`;
      }
      targetContainer = videoContainer || 'mp4';

      if (downloadSubtitles) {
        formatSpecifier = `${formatSpecifier}|sub:${subtitleMode}:${subtitleLang}`;
      }
    }

    onStartDownload(id, url, formatSpecifier, outputDir, targetContainer);
  };

  const formatTime = (secs: number) => {
    if (!secs) return '0:00';
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = String(Math.floor(secs % 60)).padStart(2, '0');
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${remainingSecs}`;
    }
    return `${mins}:${remainingSecs}`;
  };

  const handleQualityChange = (val: string) => {
    if (val === 'bestaudio') {
      setDownloadType('audio');
      setSelectedResolution('bestaudio');
    } else {
      setDownloadType('video');
      setSelectedResolution(val);
    }
  };

  const handleModeSwitch = (mode: 'video' | 'audio') => {
    setDownloadType(mode);
    if (mode === 'audio') {
      setSelectedResolution('bestaudio');
    } else if (selectedResolution === 'bestaudio') {
      setSelectedResolution('best');
    }
  };

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 sticky top-4 text-[#e4e1ed] shadow-lg">
      {/* Inspected Status Badge */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#27272A]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00a572] text-lg">check_circle</span>
          <span className="text-xs font-semibold text-[#e4e1ed] tracking-wide uppercase">URL Inspected</span>
        </div>
        <span className="text-[10px] bg-[#27272A] text-[#c7c4d7] px-2 py-0.5 rounded-full font-mono">
          Ready
        </span>
      </div>

      {/* Thumbnail Container */}
      <div className="w-full aspect-video bg-[#1f1f27] rounded-lg overflow-hidden mb-4 relative border border-[#27272A]">
        {metadata.thumbnail ? (
          <img
            src={metadata.thumbnail}
            alt={metadata.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#34343d]">
            <span className="material-symbols-outlined text-4xl">movie</span>
          </div>
        )}
        {metadata.duration > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-mono text-white border border-white/10">
            {formatTime(metadata.duration)}
          </div>
        )}
      </div>

      {/* Title & Uploader */}
      <h3 className="text-sm font-semibold text-[#e4e1ed] mb-1 line-clamp-2 leading-snug" title={metadata.title}>
        {metadata.title}
      </h3>
      <p className="text-xs text-[#c7c4d7] mb-4 flex items-center gap-1">
        <span className="material-symbols-outlined text-xs text-[#8f8ca0]">person</span>
        <span className="truncate">{metadata.uploader || 'Unknown Creator'}</span>
      </p>

      {/* Download Mode Tabs (Video / Audio-Only) */}
      <div className="flex bg-[#27272A] p-1 rounded-lg mb-4 text-xs font-medium border border-[#34343d]">
        <button
          type="button"
          onClick={() => handleModeSwitch('video')}
          className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${
            downloadType === 'video'
              ? 'bg-[#6366F1] text-white shadow-sm font-semibold'
              : 'text-[#c7c4d7] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-sm">videocam</span>
          Video
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch('audio')}
          className={`flex-1 py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all ${
            downloadType === 'audio'
              ? 'bg-[#6366F1] text-white shadow-sm font-semibold'
              : 'text-[#c7c4d7] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-sm">audiotrack</span>
          Audio Only
        </button>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {downloadType === 'video' ? (
          <>
            {/* Resolution Selector */}
            <div>
              <label className="block text-xs font-medium text-[#c7c4d7] mb-1 flex justify-between items-center">
                <span>Resolution / Quality</span>
                {uniqueResolutions.length > 0 && (
                  <span className="text-[10px] text-[#8f8ca0]">{uniqueResolutions.length} options</span>
                )}
              </label>
              <select
                value={selectedResolution}
                onChange={(e) => handleQualityChange(e.target.value)}
                className="w-full bg-[#27272A] border border-[#34343d] rounded-lg px-3 py-2 text-xs text-[#e4e1ed] focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] focus:outline-none transition-colors"
              >
                <option value="best">Best Quality (Auto)</option>
                {uniqueResolutions.map((fmt) => (
                  <option key={fmt.format_id} value={fmt.format_id}>
                    {fmt.height}p {fmt.fps && fmt.fps > 30 ? `(${fmt.fps}fps)` : ''} {fmt.resolution ? `- ${fmt.resolution}` : ''}
                  </option>
                ))}
                <option value="bestaudio">🎵 Audio Only (Extract MP3/M4A)</option>
              </select>
            </div>

            {/* Container Selector for Video */}
            <div>
              <label className="block text-xs font-medium text-[#c7c4d7] mb-1">Format Container</label>
              <select
                value={videoContainer}
                onChange={(e) => setVideoContainer(e.target.value)}
                className="w-full bg-[#27272A] border border-[#34343d] rounded-lg px-3 py-2 text-xs text-[#e4e1ed] focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] focus:outline-none transition-colors"
              >
                <option value="mp4">MP4 (Default - High Compatibility)</option>
                <option value="mkv">MKV (Matroska)</option>
                <option value="webm">WebM</option>
              </select>
            </div>

            {/* Subtitles Option */}
            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#c7c4d7] hover:text-[#e4e1ed] transition-colors">
                <input
                  type="checkbox"
                  checked={downloadSubtitles}
                  onChange={(e) => setDownloadSubtitles(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#27272A] border-[#34343d] text-[#6366F1] focus:ring-[#6366F1] focus:ring-offset-0 transition-colors cursor-pointer"
                />
                <span>Download Subtitles</span>
              </label>

              {downloadSubtitles && (
                <div className="mt-2.5 p-2.5 bg-[#1f1f27] border border-[#27272A] rounded-lg space-y-2.5">
                  {/* Output Type */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#c7c4d7] mb-1">Output Type</label>
                    <select
                      value={subtitleMode}
                      onChange={(e) => setSubtitleMode(e.target.value as 'embed' | 'file')}
                      className="w-full bg-[#27272A] border border-[#34343d] rounded-lg px-3 py-1.5 text-xs text-[#e4e1ed] focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] focus:outline-none transition-colors"
                    >
                      <option value="embed">Embed in Video</option>
                      <option value="file">Save as Separate File</option>
                    </select>
                  </div>

                  {/* Subtitle Language */}
                  <div>
                    <label className="block text-[11px] font-medium text-[#c7c4d7] mb-1">Language</label>
                    <select
                      value={subtitleLang}
                      onChange={(e) => setSubtitleLang(e.target.value)}
                      className="w-full bg-[#27272A] border border-[#34343d] rounded-lg px-3 py-1.5 text-xs text-[#e4e1ed] focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] focus:outline-none transition-colors"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="ja">Japanese</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="all">All</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Audio Quality / Mode */}
            <div>
              <label className="block text-xs font-medium text-[#c7c4d7] mb-1">Audio Quality</label>
              <select
                value={audioQuality}
                onChange={(e) => setAudioQuality(e.target.value)}
                className="w-full bg-[#27272A] border border-[#34343d] rounded-lg px-3 py-2 text-xs text-[#e4e1ed] focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] focus:outline-none transition-colors"
              >
                <option value="0">Best (320 kbps)</option>
                <option value="2">High (256 kbps)</option>
                <option value="4">Standard (192 kbps)</option>
                <option value="5">Compact (128 kbps)</option>
              </select>
            </div>

            {/* Audio Format Container Selector */}
            <div>
              <label className="block text-xs font-medium text-[#c7c4d7] mb-1">Audio Format</label>
              <select
                value={audioContainer}
                onChange={(e) => setAudioContainer(e.target.value)}
                className="w-full bg-[#27272A] border border-[#34343d] rounded-lg px-3 py-2 text-xs text-[#e4e1ed] focus:ring-1 focus:ring-[#6366F1] focus:border-[#6366F1] focus:outline-none transition-colors"
              >
                <option value="mp3">MP3 (Universal)</option>
                <option value="m4a">M4A (AAC)</option>
                <option value="wav">WAV (Lossless)</option>
                <option value="opus">OPUS</option>
                <option value="flac">FLAC (Lossless)</option>
              </select>
            </div>
          </>
        )}

        {/* Output Directory indicator */}
        {outputDir && (
          <div className="text-[11px] text-[#8f8ca0] truncate pt-1 flex items-center gap-1" title={outputDir}>
            <span className="material-symbols-outlined text-xs">folder</span>
            <span className="truncate">{outputDir}</span>
          </div>
        )}

        {/* Start Download Button */}
        <button
          type="button"
          onClick={handleDownload}
          className="w-full mt-3 bg-[#00a572] hover:bg-[#008f63] text-[#002113] text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,165,114,0.2)] hover:shadow-[0_0_20px_rgba(0,165,114,0.4)] active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-base">download</span>
          Start Download
        </button>
      </div>
    </div>
  );
};
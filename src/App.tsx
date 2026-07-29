// src/App.tsx
import React, { useState } from 'react';
import { BinaryInstaller } from './components/BinaryInstaller';
import { URLInput } from './components/URLInput';
import { DownloadCard } from './components/DownloadCard';
import { useDownloader } from './hooks/useDownloader';

export function App() {
  const [isBinaryReady, setIsBinaryReady] = useState(false);
  const [isFetchingInfo, setIsFetchingInfo] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<{ id: string; url: string; data: any } | null>(
    null
  );

  const { fetchInfo, startDownload, cancelDownload, openFolder, progress, isDownloading } =
    useDownloader();

  // 1. Show Binary Preparation Screen until yt-dlp/ffmpeg are verified
  if (!isBinaryReady) {
    return <BinaryInstaller onReady={() => setIsBinaryReady(true)} />;
  }

  // 2. Fetch URL metadata
  const handleFetchMetadata = async (url: string) => {
    setIsFetchingInfo(true);
    try {
      const data = await fetchInfo(url);
      const id = Date.now().toString(); // Generate unique ID for this download task
      setCurrentMedia({ id, url, data });
    } catch (err) {
      alert(`Failed to fetch URL media details: ${err}`);
    } finally {
      setIsFetchingInfo(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-400">MeowLoad 🐾</h1>
        <p className="text-slate-400 text-sm mt-1">
          Fast, lightweight, native cross-platform downloader
        </p>
      </header>

      <URLInput onFetch={handleFetchMetadata} isLoading={isFetchingInfo} />

      {currentMedia && (
        <DownloadCard
          id={currentMedia.id}
          url={currentMedia.url}
          metadata={currentMedia.data}
          progress={progress}
          isDownloading={isDownloading}
          onStartDownload={startDownload}
          onCancelDownload={cancelDownload}
          onOpenFolder={openFolder}
        />
      )}
    </main>
  );
}

export default App;
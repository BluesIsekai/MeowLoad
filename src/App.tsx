// src/App.tsx
import { useState } from 'react';
import { downloadDir } from '@tauri-apps/api/path';
import { Sidebar } from './components/Sidebar';
import { BinaryInstaller } from './components/BinaryInstaller';
import { URLInput } from './components/URLInput';
import { ActiveDownloadCard } from './components/ActiveDownloadCard';
import { InspectedMediaCard } from './components/InspectedMediaCard';
import { useDownloader } from './hooks/useDownloader';

export function App() {
  const [isBinaryReady, setIsBinaryReady] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [inspectedMedia, setInspectedMedia] = useState<{ id: string; url: string; data: any } | null>(null);

  const { fetchInfo, startDownload, cancelDownload, openFolder, progress, isDownloading } = useDownloader();

  // Show binary setup banner if dependencies are missing
  if (!isBinaryReady) {
    return <BinaryInstaller onReady={() => setIsBinaryReady(true)} />;
  }

  const handleInspectURL = async (url: string) => {
    setIsFetching(true);
    try {
      const data = await fetchInfo(url);
      const id = Date.now().toString();
      setInspectedMedia({ id, url, data });
    } catch (err) {
      alert(`Error fetching URL metadata: ${err}`);
    } finally {
      setIsFetching(false);
    }
  };

  // ✅ Resolve system downloads directory path dynamically
  const handleOpenDownloadsFolder = async () => {
    try {
      const dir = await downloadDir();
      await openFolder(dir);
    } catch (err) {
      console.error('Failed to open downloads folder:', err);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex font-body-md selection:bg-primary-container selection:text-on-primary-container overflow-hidden">
      <Sidebar />

      <main className="ml-sidebar-width flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-30 flex justify-between items-center w-full px-lg py-md border-b border-surface-variant/50">
          <nav className="flex gap-lg">
            <a href="#" className="font-label-md text-label-md text-primary border-b-2 border-primary pb-1 transition-colors">
              Queue
            </a>
            <a href="#" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              Completed
            </a>
            <a href="#" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
              Failed
            </a>
          </nav>

          <div className="flex items-center gap-md">
            <button
              onClick={handleOpenDownloadsFolder}
              className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md"
            >
              <span className="material-symbols-outlined text-lg">folder_open</span>
              Open Folder
            </button>
            <div className="w-px h-6 bg-surface-variant mx-2"></div>
            <button className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary scale-95 active:scale-90 transition-transform">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button className="p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant hover:text-primary scale-95 active:scale-90 transition-transform">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </header>

        {/* Scrollable Body Canvas */}
        <div className="flex-1 overflow-y-auto p-lg">
          <div className="max-w-container-max mx-auto space-y-xl">
            <URLInput onInspect={handleInspectURL} isLoading={isFetching} />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-lg">
              {/* Left Column: Active Download List */}
              <div className="xl:col-span-8 space-y-sm">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Active Downloads</h2>

                {isDownloading && inspectedMedia ? (
                  <ActiveDownloadCard
                    id={inspectedMedia.id}
                    title={inspectedMedia.data.title}
                    thumbnail={inspectedMedia.data.thumbnail}
                    progress={progress}
                    onCancel={cancelDownload}
                    onOpenFolder={handleOpenDownloadsFolder}
                    outputDir=""
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 bg-[#18181B] border border-[#27272A] rounded-xl text-on-surface-variant">
                    <span className="material-symbols-outlined text-5xl mb-2 text-surface-variant">
                      downloading
                    </span>
                    <p className="font-body-md text-body-md">No active downloads right now</p>
                  </div>
                )}
              </div>

              {/* Right Column: URL Inspection Panel */}
              <div className="xl:col-span-4">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-md opacity-0">Ready</h2>
                {inspectedMedia ? (
                  <InspectedMediaCard
                    id={inspectedMedia.id}
                    url={inspectedMedia.url}
                    metadata={inspectedMedia.data}
                    onStartDownload={startDownload}
                  />
                ) : (
                  <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-md text-center text-on-surface-variant sticky top-4">
                    <span className="material-symbols-outlined text-4xl mb-2 text-surface-variant">
                      link
                    </span>
                    <p className="font-label-sm text-label-sm">Paste and inspect a URL above to choose formats</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
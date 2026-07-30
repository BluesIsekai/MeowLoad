import React, { useState, useEffect } from "react";
import { downloadDir } from "@tauri-apps/api/path";
import { Sidebar } from "./components/Sidebar";
import { BinaryInstaller } from "./components/BinaryInstaller";
import { URLInput } from "./components/URLInput";
import { ActiveDownloadCard } from "./components/ActiveDownloadCard";
import { InspectedMediaCard } from "./components/InspectedMediaCard";
import { useDownloader } from "./hooks/useDownloader";

export function App() {
    const [isBinaryReady, setIsBinaryReady] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [inspectedMedia, setInspectedMedia] = useState<{ id: string; url: string; data: any } | null>(null);
    const [defaultOutputDir, setDefaultOutputDir] = useState<string>("");

    const { fetchInfo, startDownload, cancelDownload, openFolder, progress, isDownloading } = useDownloader();

    // Resolve system downloads directory on mount safely
    useEffect(() => {
        downloadDir()
            .then(dir => setDefaultOutputDir(dir || ""))
            .catch(err => console.error("Could not fetch downloads folder:", err));
    }, []);

    // Show binary setup banner until yt-dlp & FFmpeg are verified
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

    const handleOpenDownloadsFolder = async () => {
        try {
            // Falls back to ~/Downloads if defaultOutputDir is not yet populated
            const dir = defaultOutputDir || "";
            await openFolder(dir);
        } catch (err) {
            console.error("Failed to open downloads folder:", err);
        }
    };

    return (
        <div className="bg-[#13131b] text-[#e4e1ed] min-h-screen flex font-sans overflow-hidden">
            <Sidebar />

            <main className="ml-64 flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Header Bar */}
                <header className="bg-[#13131b]/80 backdrop-blur-md sticky top-0 z-30 flex justify-between items-center w-full px-6 py-4 border-b border-[#34343d]">
                    <nav className="flex gap-6">
                        <a href="#" className="text-sm font-medium text-[#c0c1ff] border-b-2 border-[#c0c1ff] pb-1">
                            Queue
                        </a>
                        <a href="#" className="text-sm font-medium text-[#c7c4d7] hover:text-[#c0c1ff]">
                            Completed
                        </a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleOpenDownloadsFolder}
                            className="flex items-center gap-1 text-xs text-[#c7c4d7] hover:text-[#c0c1ff] transition-colors"
                        >
                            <span className="material-symbols-outlined text-base">folder_open</span>
                            Open Downloads Folder
                        </button>
                    </div>
                </header>

                {/* Scrollable Main Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-6xl mx-auto space-y-6">
                        <URLInput onInspect={handleInspectURL} isLoading={isFetching} />

                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                            {/* Left Column: Active Downloads */}
                            <div className="xl:col-span-8 space-y-4">
                                <h2 className="text-lg font-semibold text-[#e4e1ed]">Active Downloads</h2>

                                {isDownloading && inspectedMedia ? (
                                    <ActiveDownloadCard
                                        id={inspectedMedia.id}
                                        title={inspectedMedia.data?.title || "Downloading media..."}
                                        thumbnail={inspectedMedia.data?.thumbnail || ""}
                                        progress={progress}
                                        onCancel={cancelDownload}
                                        onOpenFolder={handleOpenDownloadsFolder}
                                        outputDir={defaultOutputDir}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 bg-[#18181B] border border-[#27272A] rounded-xl text-[#c7c4d7]">
                                        <span className="material-symbols-outlined text-5xl mb-2 text-[#34343d]">
                                            downloading
                                        </span>
                                        <p className="text-sm">No active downloads right now</p>
                                    </div>
                                )}
                            </div>

                            {/* Right Column: URL Inspection Panel */}
                            <div className="xl:col-span-4">
                                {inspectedMedia ? (
                                    <InspectedMediaCard
                                        id={inspectedMedia.id}
                                        url={inspectedMedia.url}
                                        metadata={inspectedMedia.data}
                                        onStartDownload={(id, url, formatId, container) =>
                                            startDownload(id, url, formatId, defaultOutputDir, container)
                                        }
                                    />
                                ) : (
                                    <div className="bg-[#18181B] border border-[#27272A] rounded-xl p-6 text-center text-[#c7c4d7]">
                                        <span className="material-symbols-outlined text-4xl mb-2 text-[#34343d]">
                                            link
                                        </span>
                                        <p className="text-xs">Paste and inspect a URL above to choose formats</p>
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

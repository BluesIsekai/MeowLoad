import { useState, useEffect } from "react";
import { downloadDir } from "@tauri-apps/api/path";
import { Sidebar } from "./components/Sidebar";
import { BinaryInstaller } from "./components/BinaryInstaller";
import { URLInput } from "./components/URLInput";
import { ActiveDownloadCard } from "./components/ActiveDownloadCard";
import { InspectedMediaCard } from "./components/InspectedMediaCard";
import { CompletedDownloads } from "./components/CompletedDownloads";
import { useDownloader } from "./hooks/useDownloader";

export function App() {
    const [isBinaryReady, setIsBinaryReady] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [inspectedMedia, setInspectedMedia] = useState<{ id: string; url: string; data: any } | null>(null);
    const [defaultOutputDir, setDefaultOutputDir] = useState<string>("");
    const [activeTab, setActiveTab] = useState<'queue' | 'completed'>('queue');

    const { fetchInfo, startDownload, cancelDownload, openFolder, removeDownload, clearFinished, downloads, progress, isDownloading } = useDownloader();

    // Resolve system downloads directory on mount safely
    useEffect(() => {
        downloadDir()
            .then(dir => setDefaultOutputDir(dir || ""))
            .catch(err => console.error("Could not fetch downloads folder:", err));
    }, []);

    // Listen for finished downloads to add to completed tab
    useEffect(() => {
        if (progress?.status === 'finished' && inspectedMedia && progress.id === inspectedMedia.id) {
            // Automatically switch to completed tab when a download finishes
            setActiveTab('completed');
        }
    }, [progress?.status, progress?.id, inspectedMedia]);

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
        <div className="bg-background text-on-surface min-h-screen flex font-sans overflow-hidden">
            <Sidebar />

            <main className="ml-64 flex-1 flex flex-col h-screen overflow-hidden relative">
                <header className="bg-surface text-primary border-b border-surface-variant flex justify-between items-center w-full px-lg py-md sticky top-0 z-30 docked top-0">
                    {/* Brand / Search Area */}
                    <div className="flex items-center gap-xl flex-1">
                        <div className="hidden md:flex items-center border border-outline-variant bg-surface-container-lowest rounded-full px-md py-xs focus-within:border-[#6366F1] focus-within:ring-2 focus-within:ring-[#6366F1]/20 transition-all w-64">
                            <span className="material-symbols-outlined text-on-surface-variant mr-sm text-[20px]">search</span>
                            <input className="bg-transparent border-none focus:outline-none focus:ring-0 text-on-surface font-body-sm text-body-sm w-full placeholder:text-on-surface-variant" placeholder="Search downloads..." type="text"/>
                        </div>
                    </div>
                    {/* Navigation Links */}
                    <div className="flex gap-lg mx-lg flex-1 justify-center">
                        <button 
                            onClick={() => setActiveTab('queue')}
                            className={`font-label-md text-label-md transition-colors py-sm ${activeTab === 'queue' ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant hover:text-primary'}`}
                        >
                            Queue
                        </button>
                        <button 
                            onClick={() => setActiveTab('completed')}
                            className={`font-label-md text-label-md transition-colors py-sm ${activeTab === 'completed' ? 'text-primary border-b-2 border-primary pb-1 font-bold' : 'text-on-surface-variant hover:text-primary'}`}
                        >
                            Completed
                        </button>
                        <button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors py-sm">Failed</button>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-md flex-1 justify-end">
                        <button 
                            onClick={handleOpenDownloadsFolder}
                            className="bg-[#6366F1] text-white py-xs px-md rounded-md font-label-sm text-label-sm bg-gradient-to-b from-indigo-500 to-indigo-600 hover:brightness-110 border border-indigo-400/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] transition-transform scale-95 active:scale-90"
                        >
                            Open Folder
                        </button>
                        <button 
                            onClick={clearFinished}
                            className="bg-surface border border-outline-variant text-on-surface py-xs px-md rounded-md font-label-sm text-label-sm hover:bg-surface-container-high transition-transform scale-95 active:scale-90"
                        >
                            Clear Finished
                        </button>
                        <div className="flex gap-sm border-l border-surface-variant pl-md ml-sm">
                            <button className="text-on-surface-variant hover:text-primary transition-colors scale-95 active:scale-90 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
                            </button>
                            <button className="text-on-surface-variant hover:text-primary transition-colors scale-95 active:scale-90 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>folder_open</span>
                            </button>
                            <button className="text-on-surface-variant hover:text-primary transition-colors scale-95 active:scale-90 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[20px]">more_vert</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Scrollable Main Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'queue' ? (
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
                                        onStartDownload={(id, url, formatSpecifier, outputDir, container) =>
                                            startDownload(id, url, formatSpecifier, outputDir, container, inspectedMedia.data?.title, inspectedMedia.data?.thumbnail)
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
                    ) : (
                        <CompletedDownloads 
                            items={downloads.filter(d => d.status === 'finished' || d.status === 'error')} 
                            onOpenFolder={openFolder} 
                            onRemoveItem={removeDownload}
                            defaultOutputDir={defaultOutputDir} 
                        />
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;

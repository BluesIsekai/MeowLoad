import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen, UnlistenFn } from '@tauri-apps/api/event';

export interface ProgressData {
  id: string;
  percentage: number;
  speed: string;
  eta: string;
  status: 'downloading' | 'finished' | 'error';
}

export function useDownloader() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let unlisten: UnlistenFn;

    listen<ProgressData>('download_progress', (event) => {
      setProgress(event.payload);

      if (event.payload.status === 'finished' || event.payload.status === 'error') {
        setIsDownloading(false);
      } else {
        setIsDownloading(true);
      }
    }).then((fn) => (unlisten = fn));

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  const fetchInfo = async (url: string) => {
    return await invoke('get_media_info', { url });
  };

  const startDownload = async (
    id: string,
    url: string,
    formatId: string,
    outputDir: string,
    container: string = 'mp4'
  ) => {
    setIsDownloading(true);
    setProgress({ id, percentage: 0, speed: 'Starting...', eta: '--:--', status: 'downloading' });

    // Fallbacks to prevent passing empty strings to Rust IPC
    const safeFormatId = formatId || 'bestvideo+bestaudio/best';
    const safeContainer = container || 'mp4';

    try {
      await invoke('start_download', {
        id,
        url,
        formatId: safeFormatId,
        outputDir: outputDir || '',
        container: safeContainer,
      });
    } catch (err) {
      setIsDownloading(false);
      alert(`Download error: ${err}`);
    }
  };

  const cancelDownload = async (id: string) => {
    try {
      await invoke('cancel_download', { id });
    } catch (err) {
      console.error('Failed to cancel download:', err);
    } finally {
      setIsDownloading(false);
      setProgress(null);
    }
  };

  const openFolder = async (path: string) => {
    try {
      await invoke('open_file_location', { path: path || '' });
    } catch (err) {
      console.error('Failed to open folder:', err);
    }
  };

  return { fetchInfo, startDownload, cancelDownload, openFolder, progress, isDownloading };
}
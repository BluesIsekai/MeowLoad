// src/hooks/useDownloader.ts
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen, UnlistenFn } from '@tauri-apps/api/event';

export interface ProgressData {
  percentage: number;
  speed: string;
  eta: string;
}

export function useDownloader() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let unlisten: UnlistenFn;

    listen<ProgressData>('download_progress', (event) => {
      setProgress(event.payload);
    }).then((fn) => (unlisten = fn));

    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  const fetchInfo = async (url: string) => {
    return await invoke('get_media_info', { url });
  };

  const startDownload = async (id: string, url: string, formatId: string, outputDir: string) => {
    setIsDownloading(true);
    try {
      await invoke('start_download', { id, url, formatId, outputDir });
    } finally {
      setIsDownloading(false);
    }
  };

  const cancelDownload = async (id: string) => {
    await invoke('cancel_download', { id });
    setIsDownloading(false);
  };

  const openFolder = async (path: string) => {
    await invoke('open_file_location', { path });
  };

  return { fetchInfo, startDownload, cancelDownload, openFolder, progress, isDownloading };
}
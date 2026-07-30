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

export interface DownloadItem {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  outputDir: string;
  date: string;
  status: 'downloading' | 'finished' | 'error';
  progress?: ProgressData;
}

const STORAGE_KEY = 'meowload_download_history';

export function useDownloader() {
  const [downloads, setDownloads] = useState<DownloadItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DownloadItem[];
        // Any previously downloading items that are loaded from storage are marked as error since they were interrupted
        return parsed.map(item => ({
          ...item,
          status: item.status === 'downloading' ? 'error' : item.status
        }));
      }
    } catch (e) {
      console.error('Failed to parse download history from localStorage', e);
    }
    return [];
  });

  // Derived state to keep backward compatibility with progress
  const activeDownload = downloads.find(d => d.status === 'downloading');
  const progress = activeDownload?.progress || null;
  const isDownloading = !!activeDownload;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    let unlisten: UnlistenFn;

    listen<ProgressData>('download_progress', (event) => {
      setDownloads(prev => {
        return prev.map(item => {
          if (item.id === event.payload.id) {
            return {
              ...item,
              status: event.payload.status,
              progress: event.payload
            };
          }
          return item;
        });
      });
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
    container: string = 'mp4',
    title: string = 'Unknown Title',
    thumbnail: string = ''
  ) => {
    const newItem: DownloadItem = {
      id,
      url,
      title,
      thumbnail,
      outputDir,
      date: new Date().toLocaleString(),
      status: 'downloading',
      progress: { id, percentage: 0, speed: 'Starting...', eta: '--:--', status: 'downloading' }
    };
    
    setDownloads(prev => [newItem, ...prev]);

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
      setDownloads(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'error' } : item
      ));
      alert(`Download error: ${err}`);
    }
  };

  const cancelDownload = async (id: string) => {
    try {
      await invoke('cancel_download', { id });
    } catch (err) {
      console.error('Failed to cancel download:', err);
    } finally {
      setDownloads(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'error' } : item
      ));
    }
  };

  const removeDownload = (id: string) => {
    setDownloads(prev => prev.filter(item => item.id !== id));
  };

  const clearFinished = () => {
    setDownloads(prev => prev.filter(item => item.status === 'downloading'));
  };

  const openFolder = async (path: string) => {
    try {
      await invoke('open_file_location', { path: path || '' });
    } catch (err) {
      console.error('Failed to open folder:', err);
    }
  };

  return { 
    fetchInfo, 
    startDownload, 
    cancelDownload, 
    removeDownload, 
    clearFinished,
    openFolder, 
    downloads,
    progress, 
    isDownloading 
  };
}
import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';

interface BinaryProgress {
  binary_name: string;
  downloaded_bytes: number;
  total_bytes: number;
}

export const BinaryInstaller: React.FC<{ onReady: () => void }> = ({ onReady }) => {
  const [status, setStatus] = useState('Initializing core components...');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen to download events emitted from bin_manager.rs
    const unlistenPromise = listen<BinaryProgress>('binary_download_progress', (event) => {
      const { binary_name, downloaded_bytes, total_bytes } = event.payload;
      if (total_bytes > 0) {
        const percent = Math.round((downloaded_bytes / total_bytes) * 100);
        setProgress(percent);
        setStatus(`Downloading required component: ${binary_name} (${percent}%)`);
      }
    });

    // Invoke binary check command in Rust
    invoke<boolean>('check_and_prepare_binaries')
      .then(() => onReady())
      .catch((err) => setError(String(err)));

    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, [onReady]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6 text-red-500 text-center">
        <h2 className="text-xl font-bold mb-2">Initialization Error</h2>
        <p className="text-sm bg-red-950 p-4 rounded border border-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-6">
      <div className="w-full max-w-md bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl text-center">
        <h2 className="text-xl font-bold mb-2">Setting Up MeowLoad 🐾</h2>
        <p className="text-slate-400 text-sm mb-6">{status}</p>

        <div className="w-full bg-slate-700 rounded-full h-3 mb-2 overflow-hidden">
          <div
            className="bg-indigo-500 h-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-slate-400">{progress}% Completed</span>
      </div>
    </div>
  );
};
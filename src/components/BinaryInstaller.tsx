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
      <div className="flex flex-col items-center justify-center h-screen bg-background p-lg text-error text-center">
        <h2 className="font-headline-md text-headline-md font-bold mb-2">Initialization Error</h2>
        <p className="font-body-sm text-body-sm bg-error-container text-on-error-container p-md rounded border border-error/50 max-w-[448px] break-words">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-on-background p-lg">
      <div className="w-full max-w-[448px] bg-surface p-lg rounded-xl border border-surface-variant shadow-xl text-center">
        <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 mx-auto mb-md">
          <span className="material-symbols-outlined text-primary animate-spin">sync</span>
        </div>
        <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Setting Up MeowLoad 🐾</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg">{status}</p>

        <div className="w-full bg-[#27272A] rounded-full h-2 mb-2 overflow-hidden">
          <div
            className="bg-[#6366F1] h-full rounded-full progress-bar-glow transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-mono-label text-mono-label text-on-surface-variant">{progress}% Completed</span>
      </div>
    </div>
  );
};
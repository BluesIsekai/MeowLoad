import React from 'react';
import { DownloadItem } from '../hooks/useDownloader';

interface CompletedDownloadCardProps {
  item: DownloadItem;
  onOpenFolder: (path: string) => void;
  onRemoveItem: (id: string) => void;
  defaultOutputDir: string;
}

export const CompletedDownloadCard: React.FC<CompletedDownloadCardProps> = ({ item, onOpenFolder, onRemoveItem, defaultOutputDir }) => {
  const isError = item.status === 'error';

  return (
    <div className="group bg-surface border border-surface-variant rounded-xl p-md flex items-center gap-lg hover:bg-[#202023] transition-colors relative overflow-hidden">
      <div className="w-32 h-24 rounded-lg overflow-hidden shrink-0 border border-surface-variant relative group-hover:border-[#6366F1]/50 transition-colors bg-surface-container-high">
        {item.thumbnail ? (
          <img className="w-full h-full object-cover" alt={item.title} src={item.thumbnail} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl">video_file</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-sm mb-xs">
          <h3 className="font-headline-md text-[18px] text-on-surface font-semibold truncate leading-tight">{item.title}</h3>
          
          {isError ? (
            <div className="bg-error/10 text-error border border-error/20 px-sm py-[2px] rounded font-mono-label text-[10px] uppercase tracking-wider flex items-center gap-[4px]">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              Error
            </div>
          ) : (
            <div className="bg-secondary/10 text-secondary border border-secondary/20 px-sm py-[2px] rounded font-mono-label text-[10px] uppercase tracking-wider flex items-center gap-[4px]">
              <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Finished
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-md font-mono-label text-mono-label text-on-surface-variant mt-sm">
          <span className="flex items-center gap-[4px] truncate">
            <span className="material-symbols-outlined text-[14px]">folder</span> 
            {item.outputDir || defaultOutputDir}
          </span>
          <span className="w-[3px] h-[3px] shrink-0 rounded-full bg-outline-variant"></span>
          <span className="shrink-0">{item.date}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-sm opacity-60 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onOpenFolder(item.outputDir || defaultOutputDir)}
          className="bg-surface-container border border-surface-variant text-on-surface p-sm rounded-lg hover:border-outline-variant transition-colors flex items-center justify-center" 
          title="Open Folder"
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>folder_open</span>
        </button>
        <button 
          onClick={() => onRemoveItem(item.id)}
          className="text-on-surface-variant hover:text-error hover:bg-error/10 p-sm rounded-lg transition-colors flex items-center justify-center ml-sm" 
          title="Remove"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { DownloadItem } from '../hooks/useDownloader';
import { CompletedDownloadCard } from './CompletedDownloadCard';

interface CompletedDownloadsProps {
  items: DownloadItem[];
  onOpenFolder: (path: string) => void;
  onRemoveItem: (id: string) => void;
  defaultOutputDir: string;
}

export const CompletedDownloads: React.FC<CompletedDownloadsProps> = ({ items, onOpenFolder, onRemoveItem, defaultOutputDir }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-container-max mx-auto p-xl">
      <div className="flex justify-between items-center mb-lg">
        <h2 className="font-headline-md text-headline-md text-on-surface">Completed Downloads</h2>
        <div className="flex items-center gap-md">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input 
              type="text" 
              placeholder="Search downloads..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-surface border border-surface-variant rounded-full py-xs pl-[36px] pr-md text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-[240px] transition-all"
            />
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container px-md py-xs rounded-full border border-surface-variant">
            {filteredItems.length} {filteredItems.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-md">
        {filteredItems.map((item) => (
          <CompletedDownloadCard 
            key={item.id} 
            item={item} 
            onOpenFolder={onOpenFolder} 
            onRemoveItem={onRemoveItem} 
            defaultOutputDir={defaultOutputDir} 
          />
        ))}

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-surface border border-surface-variant rounded-xl text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-2 text-outline">
              history
            </span>
            <p className="text-sm font-label-md text-label-md">No completed downloads</p>
          </div>
        ) : filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 bg-surface border border-surface-variant rounded-xl text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-2 text-outline">
              search_off
            </span>
            <p className="text-sm font-label-md text-label-md">No downloads match your search</p>
          </div>
        )}
      </div>
    </div>
  );
};

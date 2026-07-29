import React, { useState } from 'react';

interface URLInputProps {
  onInspect: (url: string) => void;
  isLoading: boolean;
}

export const URLInput: React.FC<URLInputProps> = ({ onInspect, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onInspect(url.trim());
    }
  };

  return (
    <section className="max-w-3xl mx-auto mt-xl mb-6">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6366F1] to-secondary-container rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
        <div className="relative flex items-center bg-[#18181B] border border-[#27272A] rounded-xl p-2 shadow-lg focus-within:border-[#6366F1] focus-within:ring-1 focus-within:ring-[#6366F1]/50 transition-all">
          <div className="pl-sm text-on-surface-variant">
            <span className="material-symbols-outlined">link</span>
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            placeholder="Paste video or audio link here..."
            className="w-full bg-transparent border-none text-on-surface focus:ring-0 font-body-md text-body-md px-md placeholder-[#908fa0]"
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className="bg-[#27272A] hover:bg-surface-container-high text-on-surface font-label-md text-label-md px-md py-2 rounded-lg border border-surface-variant transition-colors flex items-center gap-xs whitespace-nowrap disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-sm">
              {isLoading ? 'sync' : 'search'}
            </span>
            {isLoading ? 'Analyzing...' : 'Inspect URL'}
          </button>
        </div>
      </form>
    </section>
  );
};
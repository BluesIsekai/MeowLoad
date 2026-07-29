import React, { useState } from 'react';

interface URLInputProps {
  onFetch: (url: string) => void;
  isLoading: boolean;
}

export const URLInput: React.FC<URLInputProps> = ({ onFetch, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onFetch(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-3xl mx-auto my-6">
      <input
        type="text"
        placeholder="Paste video or audio URL here..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={isLoading}
        className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || !url.trim()}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
      >
        {isLoading ? 'Analyzing...' : 'Inspect URL'}
      </button>
    </form>
  );
};
import React from 'react';

export const Sidebar: React.FC = () => {
  return (
    <nav className="bg-surface border-r border-surface-variant flex flex-col h-full fixed left-0 top-0 z-40 w-sidebar-width transition-all duration-200 ease-in-out">
      <div className="p-lg border-b border-surface-variant">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary text-3xl">pets</span>
          <div>
            <h1 className="font-headline-lg text-headline-lg font-bold text-primary leading-none">MeowLoad 🐾</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Lightweight Media Downloader</p>
          </div>
        </div>
        <button className="w-full mt-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white font-label-md text-label-md py-2 rounded-lg flex items-center justify-center gap-sm transition-colors btn-glow">
          <span className="material-symbols-outlined text-sm">add</span>
          New Download
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-md">
        <ul className="space-y-sm px-sm">
          <li>
            <a href="#" className="flex items-center gap-md px-md py-2 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md border-l-2 border-[#6366F1]">
              <span className="material-symbols-outlined">download</span>
              Downloads
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-md px-md py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out font-label-md text-label-md">
              <span className="material-symbols-outlined">video_library</span>
              Library
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-md px-md py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out font-label-md text-label-md">
              <span className="material-symbols-outlined">history</span>
              History
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-md px-md py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out font-label-md text-label-md">
              <span className="material-symbols-outlined">settings</span>
              Settings
            </a>
          </li>
        </ul>
      </div>

      <div className="p-md border-t border-surface-variant">
        <ul className="space-y-xs">
          <li>
            <a href="#" className="flex items-center gap-md px-md py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-sm">help</span>
              Help
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-md px-md py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-sm">contact_support</span>
              Support
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
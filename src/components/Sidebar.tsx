import React from 'react';

export const Sidebar: React.FC = () => {
  return (
    <nav aria-label="Sidebar Navigation" className="bg-surface text-primary border-r border-surface-variant flex flex-col h-full fixed left-0 top-0 z-40 docked left-0 w-sidebar-width">
      {/* Header */}
      <div className="px-lg py-xl flex flex-col items-center border-b border-surface-variant">
        <div className="w-16 h-16 rounded-full overflow-hidden mb-sm border border-surface-variant">
          <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANpeIlIvfZBiFKFfN-OSySpRKj0JpqCcqx-eVzBFxDEzXqSolo9eBFllLma-3NQW0yzU_6NRiDfqa1SdpJ_CAZlujl_QmowkDBoKOQ4Qmk4BscwopxQcUbHi8-UU20yZt-rYV2id7M6AEazkwgZqYtoxMXv7HQRUe00uBMG72OzTadUsOITgLPfYlHOYcqCC374xTZQXBHsEJKJi9xy_5QS1_CD26liZPAtXBNJm578S9xNNu9rbQ54g" />
        </div>
        <h1 className="font-headline-lg text-headline-lg font-bold text-primary">MeowLoad 🐾</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Media Downloader</p>
      </div>

      {/* CTA */}
      <div className="px-lg py-md border-b border-surface-variant">
        <button className="w-full bg-[#6366F1] text-white py-sm px-md rounded-lg font-label-md text-label-md flex items-center justify-center gap-sm bg-gradient-to-b from-indigo-500 to-indigo-600 hover:brightness-110 transition-all border border-indigo-400/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
          New Download
        </button>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto py-md px-sm flex flex-col gap-xs">
        <a aria-current="page" className="flex items-center gap-md px-md py-sm rounded-lg hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out text-primary font-bold border-r-2 border-primary bg-surface-container-low" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>download</span>
          <span className="font-label-md text-label-md">Downloads</span>
        </a>
        <a className="flex items-center gap-md px-md py-sm rounded-lg hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out text-on-surface-variant" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>video_library</span>
          <span className="font-label-md text-label-md">Library</span>
        </a>
        <a className="flex items-center gap-md px-md py-sm rounded-lg hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out text-on-surface-variant" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
          <span className="font-label-md text-label-md">History</span>
        </a>
        <a className="flex items-center gap-md px-md py-sm rounded-lg hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out text-on-surface-variant" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>settings</span>
          <span className="font-label-md text-label-md">Settings</span>
        </a>
      </div>

      {/* Footer Nav */}
      <div className="border-t border-surface-variant p-sm flex flex-col gap-xs">
        <a className="flex items-center gap-md px-md py-sm rounded-lg hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out text-on-surface-variant" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>help</span>
          <span className="font-label-md text-label-md">Help</span>
        </a>
        <a className="flex items-center gap-md px-md py-sm rounded-lg hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 ease-in-out text-on-surface-variant" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>contact_support</span>
          <span className="font-label-md text-label-md">Support</span>
        </a>
      </div>
    </nav>
  );
};
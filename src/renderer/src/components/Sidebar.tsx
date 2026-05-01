type SidebarProps = {
  isCompact: boolean
}

export function Sidebar({ isCompact }: SidebarProps) {
  return (
    <nav
      className={`bg-[#0A0A0A]/80 backdrop-blur-[20px] h-screen shrink-0 border-r border-white/10 hidden md:flex flex-col gap-2 p-4 z-40 transition-[width] duration-300 ease-out ${
        isCompact ? 'md:w-20' : 'md:w-64'
      }`}
    >
      {/* Header */}
      <div className={`mb-8 flex flex-col gap-1 ${isCompact ? 'px-0 items-center' : 'px-4'}`}>
        <div
          className={`flex items-center gap-3 mb-2 ${isCompact ? 'justify-center' : 'justify-between'}`}
        >
          <div className={`flex items-center gap-3 ${isCompact ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-on-primary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                terminal
              </span>
            </div>
            <h1
              className={`font-display text-display text-white tracking-tighter whitespace-nowrap transition-opacity duration-200 ${
                isCompact ? 'w-0 opacity-0 overflow-hidden' : 'opacity-100'
              }`}
              style={{ fontSize: '20px' }}
            >
              DL-COMMAND
            </h1>
          </div>
        </div>
        <span
          className={`font-mono-data text-mono-data text-outline whitespace-nowrap transition-opacity duration-200 ${
            isCompact ? 'w-0 opacity-0 overflow-hidden' : 'opacity-100'
          }`}
        >
          v2.4.0 Stable
        </span>
      </div>

      {/* Quick Paste CTA */}
      <button
        className={`mb-6 bg-primary-container text-on-primary-container rounded-lg font-body-sm font-medium hover:brightness-110 active:scale-[0.98] transition-all flex justify-center items-center gap-2 ${
          isCompact ? 'mx-auto w-10 h-10 p-0' : 'mx-4 py-2 px-4'
        }`}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
          content_paste
        </span>
        <span className={isCompact ? 'hidden' : ''}>Quick Paste</span>
      </button>

      {/* Main Nav */}
      <div className="flex grow flex-col gap-1">
        <a
          className={`flex items-center gap-3 text-blue-500 bg-blue-500/10 rounded-lg border-l-2 border-blue-500 active:scale-[0.98] transition-transform duration-200 ${
            isCompact ? 'justify-center px-2 py-3' : 'px-4 py-2'
          }`}
          href="#"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            dashboard
          </span>
          <span
            className={`font-['Inter'] text-sm font-medium tracking-tight ${isCompact ? 'hidden' : ''}`}
          >
            Dashboard
          </span>
        </a>
        <a
          className={`flex items-center gap-3 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 rounded-lg transition-all active:scale-[0.98] duration-200 ${
            isCompact ? 'justify-center px-2 py-3' : 'px-4 py-2'
          }`}
          href="#"
        >
          <span className="material-symbols-outlined">downloading</span>
          <span
            className={`font-['Inter'] text-sm font-medium tracking-tight ${isCompact ? 'hidden' : ''}`}
          >
            Downloads
          </span>
        </a>
        <a
          className={`flex items-center gap-3 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 rounded-lg transition-all active:scale-[0.98] duration-200 ${
            isCompact ? 'justify-center px-2 py-3' : 'px-4 py-2'
          }`}
          href="#"
        >
          <span className="material-symbols-outlined">video_library</span>
          <span
            className={`font-['Inter'] text-sm font-medium tracking-tight ${isCompact ? 'hidden' : ''}`}
          >
            Library
          </span>
        </a>
        <a
          className={`flex items-center gap-3 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 rounded-lg transition-all active:scale-[0.98] duration-200 ${
            isCompact ? 'justify-center px-2 py-3' : 'px-4 py-2'
          }`}
          href="#"
        >
          <span className="material-symbols-outlined">settings_input_component</span>
          <span
            className={`font-['Inter'] text-sm font-medium tracking-tight ${isCompact ? 'hidden' : ''}`}
          >
            Formats
          </span>
        </a>
        <a
          className={`flex items-center gap-3 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 rounded-lg transition-all active:scale-[0.98] duration-200 ${
            isCompact ? 'justify-center px-2 py-3' : 'px-4 py-2'
          }`}
          href="#"
        >
          <span className="material-symbols-outlined">terminal</span>
          <span
            className={`font-['Inter'] text-sm font-medium tracking-tight ${isCompact ? 'hidden' : ''}`}
          >
            Terminal
          </span>
        </a>
      </div>

      {/* Footer Nav */}
      <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-4">
        <a
          className={`flex items-center gap-3 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 rounded-lg transition-all active:scale-[0.98] duration-200 ${
            isCompact ? 'justify-center px-2 py-3' : 'px-4 py-2'
          }`}
          href="#"
        >
          <span className="material-symbols-outlined">help</span>
          <span
            className={`font-['Inter'] text-sm font-medium tracking-tight ${isCompact ? 'hidden' : ''}`}
          >
            Help
          </span>
        </a>
        <a
          className={`flex items-center gap-3 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 rounded-lg transition-all active:scale-[0.98] duration-200 ${
            isCompact ? 'justify-center px-2 py-3' : 'px-4 py-2'
          }`}
          href="#"
        >
          <span className="material-symbols-outlined">description</span>
          <span
            className={`font-['Inter'] text-sm font-medium tracking-tight ${isCompact ? 'hidden' : ''}`}
          >
            Logs
          </span>
        </a>
      </div>
    </nav>
  )
}

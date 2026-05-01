type HeaderProps = {
  isSidebarCompact: boolean
  onToggleSidebar: () => void
}

export function Header({ isSidebarCompact, onToggleSidebar }: HeaderProps) {
  return (
    <header className="bg-[#0A0A0A]/80 backdrop-blur-[20px] h-16 w-full sticky top-0 z-50 flex justify-between items-center px-6 border-b border-white/10">
      <div className="flex items-center gap-4">
        <button
          aria-label={isSidebarCompact ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-md cursor-pointer active:opacity-80 transition-opacity flex items-center justify-center"
          onClick={onToggleSidebar}
          type="button"
        >
          <span className="material-symbols-outlined">
            {isSidebarCompact ? 'menu' : 'menu_open'}
          </span>
        </button>
        <span className="text-lg font-bold text-white font-display">Command Center</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-md cursor-pointer active:opacity-80 transition-opacity flex items-center justify-center">
            <span className="material-symbols-outlined">notifications_active</span>
          </button>
          <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-md cursor-pointer active:opacity-80 transition-opacity flex items-center justify-center">
            <span className="material-symbols-outlined">dns</span>
          </button>
          <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-md cursor-pointer active:opacity-80 transition-opacity flex items-center justify-center">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        <div className="h-6 w-px bg-white/10 mx-2"></div>
        <button className="font-['Inter'] text-xs font-bold uppercase tracking-widest text-blue-500 border-b-2 border-blue-500 pb-1 cursor-pointer active:opacity-80 transition-opacity">
          Add URL
        </button>
        <img
          alt="User profile"
          className="w-8 h-8 rounded-full border border-white/10 ml-2"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8Sq5b0J09n1NaN_2vY7cQeTtCb6ynmM_xr_GKq8VmhrCII05hsyQEBAFvZzADtRrkvk26Td2Dp6usbVPsK2wlucWh_gtlkeIHIsgLTC2O_h804ywW2iLazbe1z0Q8IdCrJ7AY-EIsSUjvROiKb9PHNZLktzcfEunc2dY3SIYNOkxMvaVqjW9QpkSY4g33j28nLarZYvMWHSEVslRzMPOnJmS4WawWRz2Os7DVY-nzv_GrItPexG96WWaBlPdJSnTRGluQTLMz8gL9"
        />
      </div>
    </header>
  )
}

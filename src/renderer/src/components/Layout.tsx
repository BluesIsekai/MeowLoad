import { useState } from 'react'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarCompact, setIsSidebarCompact] = useState(false)

  return (
    <div className="bg-surface-container-lowest text-on-surface font-body-sm overflow-hidden h-screen flex">
      <Sidebar isCompact={isSidebarCompact} />
      <div className="flex-1 flex flex-col h-screen min-w-0 bg-[#0A0A0A] transition-[flex-basis] duration-300 ease-out">
        <Header
          isSidebarCompact={isSidebarCompact}
          onToggleSidebar={() => setIsSidebarCompact((current) => !current)}
        />
        {children}
      </div>
    </div>
  )
}

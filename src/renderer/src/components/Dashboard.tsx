export function Dashboard() {
  return (
    <main className="flex-1 overflow-y-auto p-margin flex flex-col gap-lg">
      {/* Bento Grid Layout for Dashboard */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* URL Input Section (Spans full width) */}
        <div className="col-span-12 bg-surface-container rounded-xl border border-white/10 p-md flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
              link
            </span>
            <input
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg py-3 pl-12 pr-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors font-body-sm placeholder:text-outline-variant"
              placeholder="Paste video or playlist URL here..."
              type="text"
            />
          </div>
          <button className="w-full md:w-auto whitespace-nowrap bg-[#007AFF] hover:bg-[#005bc1] text-white px-8 py-3 rounded-lg font-body-lg font-medium shadow-[0_0_15px_rgba(0,122,255,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">download</span>
            Download
          </button>
        </div>

        {/* Active Downloads (Main area) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-h2 text-h2 text-white">Active Tasks</h2>
            <span className="bg-surface-container-high text-on-surface-variant px-2 py-1 rounded text-xs font-mono-data">
              3 in progress
            </span>
          </div>

          {/* Download Card 1 */}
          <div className="bg-[#1A1A1A] rounded-lg border border-white/10 overflow-hidden flex flex-col group relative">
            <div className="p-4 flex gap-4">
              <div className="w-32 h-20 bg-surface-container-highest rounded border border-white/10 flex-shrink-0 overflow-hidden relative">
                <img
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8Ejx2LUiTYQYc-pO5jd6757hcRm9m1GsK8X1iQrSF3VNlLFbWe5iJU3t5wyokU21muTX-diL_J3guilVdZ6jAnoF8hdPgYmGdhabdtnhCGfut0k46nDTIMzcnWGRxV1O9jUbbWzK6wAUPTYDwWUFg4UtLtFCuDf4tC3IIH6_pwwrLOR7SFUb8jmU6l0g-U_yt4W7T1RugGehQ3Ro4pxwzQBe_CxIz6POgzMcwz32sPlpynKULqUheekoO-g9bCalDCq-HqTU3MpTD"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[10px] font-mono-data text-white">
                  14:20
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-body-sm font-medium text-white truncate">
                      Building a Data Pipeline with Python and Apache Kafka
                    </h3>
                    <div className="flex gap-2 text-outline">
                      <button className="hover:text-white transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                          pause
                        </span>
                      </button>
                      <button className="hover:text-error transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                          close
                        </span>
                      </button>
                    </div>
                  </div>
                  <p className="font-mono-data text-mono-data text-outline-variant mt-1 flex gap-3">
                    <span>mp4</span>
                    <span>1080p60</span>
                    <span>1.2 GB</span>
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="font-label-caps text-label-caps text-primary uppercase">
                      Downloading
                    </span>
                  </div>
                  <div className="font-mono-data text-[12px] text-outline flex gap-4">
                    <span>5.2 MB/s</span>
                    <span>02:14 ETA</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Progress Bar Full Width Bottom */}
            <div className="h-1 w-full bg-surface-container-highest">
              <div className="h-full bg-primary" style={{ width: '68%' }}></div>
            </div>
          </div>

          {/* Download Card 2 */}
          <div className="bg-[#1A1A1A] rounded-lg border border-white/10 overflow-hidden flex flex-col group relative">
            <div className="p-4 flex gap-4">
              <div className="w-32 h-20 bg-surface-container-highest rounded border border-white/10 flex-shrink-0 overflow-hidden relative">
                <img
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdFlPXq9ViHtOJBaiTCODIe0jjLDTchynlMPq9IP93jhJuTVN8xahaEZowL0uj7HnN8fIJRnM3WJ_5SblmU953JWO7OJ1PKbBcHALD_tp_qVw9DS7epuiAVXp4pugHjmy1aPyuArKtJnEGNsWR4eHIk8uInlKRaogVC-aDMlJNpYHi5fk7akZxgBb05-YgcbZQqxp0kQR24UdLRvB7OAX1knEIRQOKX8ikJOkjQ3GbSTcpGYfiApFlfLUA5gKOdk8prGcjhyzuVzXQ"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[10px] font-mono-data text-white">
                  45:00
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-body-sm font-medium text-white truncate">
                      Synthwave Mix 2024 - 4K Visuals
                    </h3>
                    <div className="flex gap-2 text-outline">
                      <button className="hover:text-white transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                          pause
                        </span>
                      </button>
                      <button className="hover:text-error transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                          close
                        </span>
                      </button>
                    </div>
                  </div>
                  <p className="font-mono-data text-mono-data text-outline-variant mt-1 flex gap-3">
                    <span>webm</span>
                    <span>2160p</span>
                    <span>4.5 GB</span>
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                    <span className="font-label-caps text-label-caps text-primary uppercase">
                      Downloading
                    </span>
                  </div>
                  <div className="font-mono-data text-[12px] text-outline flex gap-4">
                    <span>12.4 MB/s</span>
                    <span>05:30 ETA</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-surface-container-highest">
              <div className="h-full bg-primary" style={{ width: '32%' }}></div>
            </div>
          </div>

          {/* Queued Card */}
          <div className="bg-[#1A1A1A] rounded-lg border border-white/10 overflow-hidden flex flex-col opacity-60">
            <div className="p-4 flex gap-4">
              <div className="w-32 h-20 bg-surface-container-highest rounded border border-white/5 flex-shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-outline-variant text-3xl">
                  movie
                </span>
              </div>
              <div className="flex-1 flex flex-col justify-center py-1 min-w-0">
                <h3 className="font-body-sm font-medium text-white truncate">
                  Complete Python Course - 12 Hours
                </h3>
                <div className="flex items-center gap-3 mt-3">
                  <span className="font-label-caps text-label-caps text-outline uppercase bg-surface-container px-2 py-1 rounded">
                    Queued
                  </span>
                  <span className="font-mono-data text-[12px] text-outline-variant">
                    Waiting for available slot
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Content (Stats & Logs) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
          {/* Storage Stat */}
          <div className="bg-surface-container rounded-xl border border-white/10 p-md flex flex-col gap-2">
            <div className="flex items-center gap-2 text-outline">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                hard_drive_2
              </span>
              <h3 className="font-label-caps text-label-caps uppercase">Target Drive (D:)</h3>
            </div>
            <div className="flex items-end justify-between mt-2">
              <span className="font-display text-display text-white">
                428 <span className="text-h2 text-outline font-normal">GB</span>
              </span>
              <span className="text-body-sm text-outline-variant mb-1">free of 1 TB</span>
            </div>
            <div className="h-2 w-full bg-[#0A0A0A] rounded-full mt-2 overflow-hidden border border-white/5">
              <div className="h-full bg-tertiary-fixed-dim rounded-full" style={{ width: '58%' }}></div>
            </div>
          </div>

          {/* Network Stat */}
          <div className="bg-surface-container rounded-xl border border-white/10 p-md flex flex-col gap-2">
            <div className="flex items-center gap-2 text-outline">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                router
              </span>
              <h3 className="font-label-caps text-label-caps uppercase">Network Usage</h3>
            </div>
            <div className="flex items-end justify-between mt-2">
              <span className="font-display text-display text-primary">
                17.6 <span className="text-h2 text-outline font-normal">MB/s</span>
              </span>
              <span className="text-body-sm text-outline-variant mb-1">Total Speed</span>
            </div>
            {/* Mini graph placeholder */}
            <div className="h-12 w-full mt-2 flex items-end gap-1">
              <div className="w-full bg-primary/20 h-[30%] rounded-t-sm"></div>
              <div className="w-full bg-primary/40 h-[50%] rounded-t-sm"></div>
              <div className="w-full bg-primary/60 h-[40%] rounded-t-sm"></div>
              <div className="w-full bg-primary/30 h-[70%] rounded-t-sm"></div>
              <div className="w-full bg-primary/80 h-[90%] rounded-t-sm"></div>
              <div className="w-full bg-primary h-[100%] rounded-t-sm shadow-[0_0_10px_rgba(0,122,255,0.5)]"></div>
            </div>
          </div>

          {/* Mini Console */}
          <div className="bg-[#000000] rounded-xl border border-white/10 p-md flex-1 flex flex-col gap-2 min-h-[200px]">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-label-caps text-label-caps text-outline uppercase">
                Console Output
              </h3>
              <button className="text-outline hover:text-white">
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  open_in_full
                </span>
              </button>
            </div>
            <div className="font-mono-data text-[11px] text-outline-variant flex flex-col gap-1 overflow-hidden leading-relaxed">
              <div className="text-tertiary-fixed-dim">
                [youtube] Extracting URL: https://youtube.com/watch...
              </div>
              <div>[youtube] Downloading webpage</div>
              <div>[youtube] Downloading android player API JSON</div>
              <div className="text-primary-fixed-dim">
                [info] Video 1: Found formats: 137, 248, 299...
              </div>
              <div>[download] Destination: Building a Data Pipeline.f137.mp4</div>
              <div className="text-white bg-white/10 px-1 rounded inline-block">
                [download] 68.4% of 1.20GiB at 5.20MiB/s ETA 02:14
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

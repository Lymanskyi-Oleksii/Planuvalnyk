async function getWindow() {
  try {
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    return getCurrentWindow();
  } catch {
    return null;
  }
}

async function minimize() {
  const w = await getWindow();
  await w?.minimize();
}

async function toggleMaximize() {
  const w = await getWindow();
  await w?.toggleMaximize();
}

async function closeWindow() {
  const w = await getWindow();
  await w?.close();
}

export function TitleBar({ onLogout }: { onLogout?: () => void }) {
  return (
    <div
      data-tauri-drag-region
      className="flex h-11 shrink-0 items-center justify-between border-b border-line bg-panel px-4 select-none"
    >
      <div data-tauri-drag-region className="flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent" fill="none">
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 9.5H21" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 3V6.5M16 3V6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span className="text-sm font-semibold text-ink">Планувальник</span>
      </div>

      <div className="flex items-center gap-1">
        {onLogout && (
          <button
            onClick={onLogout}
            className="mr-1 rounded px-2 py-1 text-xs font-medium text-muted hover:bg-canvas hover:text-ink"
          >
            Вийти
          </button>
        )}
        <button
          onClick={minimize}
          className="flex h-7 w-9 items-center justify-center rounded text-muted hover:bg-canvas"
          aria-label="Згорнути"
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <path d="M2 6h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
        <button
          onClick={toggleMaximize}
          className="flex h-7 w-9 items-center justify-center rounded text-muted hover:bg-canvas"
          aria-label="Розгорнути"
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <rect x="2.5" y="2.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </button>
        <button
          onClick={closeWindow}
          className="flex h-7 w-9 items-center justify-center rounded text-muted hover:bg-red-50 hover:text-red-600"
          aria-label="Закрити"
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

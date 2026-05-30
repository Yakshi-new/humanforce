import './Loader.css'

/* ─── Full-page initial app loader ─────────────────────────────────────────── */
export function AppLoader() {
  return (
    <div className="app-loader-overlay" id="app-loader-overlay">
      <div className="app-loader-card">
        <div className="app-loader-logo">
          <div className="app-loader-logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="white" strokeWidth="2.5"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="app-loader-brand">
            <span className="app-loader-brand-name">HumanForce</span>
            <span className="app-loader-brand-tag">Buddy Portal</span>
          </div>
        </div>

        <div className="app-loader-spinner-wrap">
          <div className="app-loader-ring">
            <div className="app-loader-ring-inner"></div>
          </div>
          <div className="app-loader-dots">
            <span></span><span></span><span></span>
          </div>
        </div>

        <p className="app-loader-msg">Initializing secure workspace...</p>
      </div>
    </div>
  )
}

/* ─── Section / page content loader ────────────────────────────────────────── */
export function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="page-loader">
      <div className="page-loader-inner">
        <div className="pl-spinner">
          <div className="pl-arc pl-arc-1"></div>
          <div className="pl-arc pl-arc-2"></div>
          <div className="pl-center-dot"></div>
        </div>
        <p className="pl-msg">{message}</p>
      </div>
    </div>
  )
}

/* ─── Skeleton widget card ──────────────────────────────────────────────────── */
export function WidgetSkeleton({ count = 4 }) {
  return (
    <div className="dash-widgets">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="widget-card skeleton-card">
          <div className="sk-box sk-icon"></div>
          <div className="sk-col">
            <div className="sk-box sk-val"></div>
            <div className="sk-box sk-label"></div>
            <div className="sk-box sk-trend"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Skeleton table ────────────────────────────────────────────────────────── */
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="orders-table-wrap">
      <table className="data-table" style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}><div className="sk-box sk-th"></div></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, ri) => (
            <tr key={ri}>
              {Array.from({ length: cols }).map((_, ci) => (
                <td key={ci}>
                  <div className="sk-box sk-td" style={{ width: ci === 0 ? '60%' : ci === cols - 1 ? '40%' : '80%' }}></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ─── Dashboard full skeleton (widgets + table) ─────────────────────────────── */
export function DashboardSkeleton({ widgetCount = 4, tableRows = 5, tableCols = 5 }) {
  return (
    <div className="dash-content">
      <div className="sk-box sk-page-title"></div>
      <WidgetSkeleton count={widgetCount} />
      <div className="dash-card" style={{ marginTop: '24px' }}>
        <div className="dash-card-header">
          <div className="sk-box" style={{ width: '180px', height: '20px', borderRadius: '6px' }}></div>
        </div>
        <TableSkeleton rows={tableRows} cols={tableCols} />
      </div>
    </div>
  )
}

/* ─── Inline spinner for buttons ────────────────────────────────────────────── */
export function SpinnerIcon({ size = 16, color = 'currentColor' }) {
  return (
    <svg
      className="btn-spinner-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

/* ─── Panel loading overlay (for individual panels mid-action) ───────────────── */
export function PanelLoader({ text = 'Processing...' }) {
  return (
    <div className="panel-loader-overlay">
      <div className="panel-loader-inner">
        <div className="panel-mini-spinner"></div>
        <span>{text}</span>
      </div>
    </div>
  )
}

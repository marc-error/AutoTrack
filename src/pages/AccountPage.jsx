export default function AccountPage() {
  return (
    <div className="account-page">
      <div className="account-header">
        <div className="account-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 21v-1a6 6 0 0112 0v1"/>
          </svg>
        </div>
        <div className="account-header-info">
          <h2>Admin</h2>
          <p>admin@autotrack.com</p>
          <span className="account-role">Administrator</span>
        </div>
      </div>
    </div>
  )
}

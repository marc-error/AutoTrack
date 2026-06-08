import { useNavigate } from 'react-router-dom'

export default function AccountPending() {
  const navigate = useNavigate()

  return (
    <div className="status-page">
      <div className="status-container">
        <div className="status-giant">...</div>
        <div className="status-label">Account Pending</div>
        <div className="status-subtitle">Contact an administrator to get started</div>
        <div className="status-links">
          <button className="status-link" onClick={() => navigate('/home')}>Home</button>
        </div>
      </div>
    </div>
  )
}

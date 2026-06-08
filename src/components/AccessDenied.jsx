import { useNavigate } from 'react-router-dom'

export default function AccessDenied() {
  const navigate = useNavigate()

  return (
    <div className="status-page">
      <div className="status-container">
        <div className="status-giant">403</div>
        <div className="status-label">Access Denied</div>
        <div className="status-subtitle">You don't have permission to view this page</div>
        <div className="status-links">
          <button className="status-link" onClick={() => navigate(-1)}>Go Back</button>
          <span className="status-link-separator">,</span>
          <button className="status-link" onClick={() => navigate('/home')}>Home</button>
          <span className="status-link-separator">,</span>
          <button className="status-link" onClick={() => navigate('/account')}>Account</button>
        </div>
      </div>
    </div>
  )
}

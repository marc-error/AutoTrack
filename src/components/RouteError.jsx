import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom'

export default function RouteError() {
  const error = useRouteError()
  const navigate = useNavigate()

  let giantText = '404'
  let label = 'Page Not Found'
  let subtitle = "Let's get you back to the fun stuff"

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      giantText = '404'
      label = 'Page Not Found'
      subtitle = "Let's get you back to the fun stuff"
    } else {
      giantText = `${error.status}`
      label = 'Error'
      subtitle = error.statusText || 'Something went wrong unexpectedly'
    }
  }

  return (
    <div className="status-page">
      <div className="status-container">
        <div className="status-giant">{giantText}</div>
        <div className="status-label">{label}</div>
        <div className="status-subtitle">{subtitle}</div>
        <div className="status-links">
          <button className="status-link" onClick={() => navigate('/home')}>Home</button>
          <span className="status-link-separator">,</span>
          <button className="status-link" onClick={() => navigate('/search')}>Search</button>
          <span className="status-link-separator">,</span>
          <button className="status-link" onClick={() => navigate('/browse')}>Browse</button>
        </div>
      </div>
    </div>
  )
}

const Skeleton = ({ width, height, variant = 'text', lines = 1, className = '' }) => {
  if (variant === 'circle') {
    return (
      <div
        className={`skeleton skeleton-circle ${className}`}
        style={{ width: width || 40, height: height || 40 }}
      />
    )
  }

  if (variant === 'rect') {
    return (
      <div
        className={`skeleton skeleton-rect ${className}`}
        style={{ width: width || '100%', height: height || 120 }}
      />
    )
  }

  if (lines > 1) {
    return (
      <div className={`skeleton-text-block ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="skeleton skeleton-text"
            style={{
              width: i === lines - 1 ? '60%' : (width || '100%'),
              height: height || 14,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={`skeleton skeleton-text ${className}`}
      style={{ width: width || '100%', height: height || 14 }}
    />
  )
}

export const SkeletonCard = ({ className = '' }) => (
  <div className={`skeleton-card ${className}`}>
    <Skeleton variant="rect" height={160} />
    <div className="skeleton-card-body">
      <Skeleton width="70%" height={16} />
      <Skeleton width="40%" height={12} />
    </div>
  </div>
)

export const SkeletonTable = ({ rows = 5, cols = 4, className = '' }) => (
  <div className={`skeleton-table ${className}`}>
    <div className="skeleton-table-header">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} width="80%" height={14} />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div key={rowIdx} className="skeleton-table-row">
        {Array.from({ length: cols }).map((_, colIdx) => (
          <Skeleton
            key={colIdx}
            width={`${60 + Math.random() * 30}%`}
            height={14}
          />
        ))}
      </div>
    ))}
  </div>
)

export const SkeletonListItem = ({ className = '' }) => (
  <div className={`skeleton-list-item ${className}`}>
    <Skeleton variant="circle" width={40} height={40} />
    <div className="skeleton-list-item-body">
      <Skeleton width="60%" height={14} />
      <Skeleton width="40%" height={12} />
    </div>
  </div>
)

export const SkeletonProfile = ({ className = '' }) => (
  <div className={`skeleton-profile ${className}`}>
    <div className="skeleton-profile-header">
      <Skeleton variant="circle" width={80} height={80} />
      <div className="skeleton-profile-info">
        <Skeleton width="50%" height={20} />
        <Skeleton width="30%" height={14} />
      </div>
    </div>
    <div className="skeleton-profile-body">
      <Skeleton width="100%" height={16} />
      <Skeleton width="100%" height={16} />
      <Skeleton width="100%" height={16} />
      <Skeleton width="70%" height={16} />
    </div>
  </div>
)

export default Skeleton

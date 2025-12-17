function ProgressBar({ 
  progress,
  color = '#f18daf', 
  height = 20,
  animated = false  
}) {

  const normalizedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="progress-bar-container">
      
      <div 
        className="progress-bar-outer"
        style={{ 
          height: `${height}px`,
          backgroundColor: '#ffffff',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
      >
        <div
          className={`progress-bar-inner ${animated ? 'animated' : ''}`}
          style={{
            width: `${normalizedProgress}%`,
            backgroundColor: color,
            height: '100%',
            transition: animated ? 'width 0.5s ease-in-out' : 'none',
            borderRadius: '10px'
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
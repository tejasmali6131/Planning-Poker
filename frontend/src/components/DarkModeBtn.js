import { useDarkMode } from '../contexts/DarkModeContext';

function DarkModeBtn() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: isDarkMode ? '1px solid #4a5568' : '1px solid #ccc',
        background: isDarkMode ? '#1a1a2e' : '#ffffff',
        boxShadow: isDarkMode
          ? '0 2px 8px rgba(255, 255, 255, 0.1)'
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
        marginRight: '0px'
      }}
    >
      <button
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
        style={{
          fontSize: '1.5rem',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          outline: 'none',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDarkMode ? '#ffffff' : '#333333',
          transition: 'color 0.3s ease'
        }}
      >
        {!isDarkMode ? (
          <span style={{ fontSize: '2rem', transform: 'rotate(-140deg)', paddingBottom: '4px' }}>&#9790;</span>
        ) : (
          <span style={{ fontSize: '2rem', paddingBottom: '4px' }}>&#9728;</span>
        )}
      </button>
    </div>
  )
}

export default DarkModeBtn;
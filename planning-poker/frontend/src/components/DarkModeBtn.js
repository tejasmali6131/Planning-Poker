import {useState} from 'react'


function DarkModeBtn(){
  
  const[darkMode,setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(darkMode === false? true : false);
    if(darkMode === false){
      document.body.style.backgroundColor = "#0b0b1aff";
      Array.from(document.getElementsByClassName("modeChange")).forEach(element => {
        element.style.color = "white";
      });
    }else{
      document.body.style.backgroundColor = "white";
      Array.from(document.getElementsByClassName("modeChange")).forEach(element => {
        element.style.color = "#004798ff";
      });
    }
  }

return (
    <div
        style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: darkMode === false ? '1px solid #ccc' : "#000000ff",
            background: darkMode === false ? "#ffffffff" : "#eaff00ff",
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            transition: 'background 0.3s',
            marginRight: '16px'
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
            }}
        >
            {darkMode === false ? (
                <span style={{ fontSize: '2rem', transform: 'rotate(-140deg)', paddingBottom: '4px' }}>&#9790;</span>
            ) : (
                <span style={{ fontSize: '2rem', paddingBottom: '4px'}}>&#9728;</span>
            )}
        </button>
    </div>
)


}export default DarkModeBtn;
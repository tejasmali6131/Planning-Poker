import koneLogo from '../images/koneLogo.png';
import './Navbar.css'
import DarkModeBtn from './DarkModeBtn';

export default function Navbar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <div>
        <img src={koneLogo} id="koneLogo" alt="Planning Poker Logo" />
        <p  className="modeChange" style={{ margin: '4px', fontSize: '12px' }}>Planning Poker</p>
      </div>
      <div style={{ marginLeft: 'auto' }}>
        <DarkModeBtn />
      </div>
    </div>
  );
}

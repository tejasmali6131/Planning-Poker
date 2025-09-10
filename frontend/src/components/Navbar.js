import koneLogo from '../images/koneLogo.png';
import './Navbar.css'
import DarkModeBtn from './DarkModeBtn';

export default function Navbar() {
  return (
    <div className="navbar-container" data-testid="navbar">
      <div className="navbar-logo-section" data-testid="navbar-logo-section">
        <img src={koneLogo} id="koneLogo" alt="Planning Poker Logo" />
        <p className="navbar-title">Planning Poker</p>
      </div>
      <div className="navbar-actions" data-testid="navbar-actions">
        <DarkModeBtn />
      </div>
    </div>
  );
}

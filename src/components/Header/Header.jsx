import LogoMark from '../LogoMark/LogoMark.jsx';
import './Header.css';

export default function Header({ onHome }) {
  return (
    <header className="header" data-intro>
      <button type="button" className="header__brand" onClick={onHome} aria-label="ECHO home">
        <LogoMark size={30} />
        <span className="header__wordmark">ECHO</span>
        <span className="header__tagline">Every Choice Creates a Universe</span>
      </button>
      <span className="header__status">
        <span className="header__pulse" aria-hidden="true" />
        Private · runs in your browser
      </span>
    </header>
  );
}

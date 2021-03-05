import { memo } from 'react';
import HeaderMenu from './HeaderMenu';

const Header = memo(function Header({}) {
  return (
    <header id="header">
      <div id="header-container">
        <button
          onClick={() =>
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
          }
        >
          <h2>
            List <br />
            Together
          </h2>
        </button>
        <HeaderMenu />
      </div>
    </header>
  );
});
export default Header;

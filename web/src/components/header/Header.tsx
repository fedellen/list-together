import { memo } from 'react';
import ListTogetherIcon from '../svg/ppjs/ListTogetherIcon';
import HeaderMenu from './HeaderMenu';

const Header = memo(function Header({}) {
  return (
    <header id="header">
      <div id="header-container">
        <button
          id="list-together-icon"
          aria-label="Scroll to top"
          onClick={() =>
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
          }
        >
          <div>
            <ListTogetherIcon />
          </div>
          <h2>
            List
            <br />
            Together
          </h2>
        </button>
        <HeaderMenu />
      </div>
    </header>
  );
});
export default Header;

import { memo } from 'react';
import HeaderMenu from './HeaderMenu';

const Header = memo(function Header({}) {
  return (
    <header id="header">
      <div id="header-container">
        <h2>
          List <br />
          Together
        </h2>
        <HeaderMenu />
      </div>
    </header>
  );
});
export default Header;

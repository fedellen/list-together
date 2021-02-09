import HeaderMenu from './HeaderMenu';

export default function Header({}) {
  return (
    <header id="header">
      <div id="header-container">
        <h2>
          List <br />
          Together
        </h2>
        <HeaderMenu />
        {/* <MenuIcon /> */}
      </div>
    </header>
  );
}

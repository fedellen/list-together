import SubHeading from './styled/SubHeading';
import MenuIcon from './svg/MenuIcon';

export default function Header({}) {
  return (
    <header id="header">
      <div>
        <SubHeading>
          List <br />
          Together
        </SubHeading>
        <MenuIcon />
      </div>
    </header>
  );
}

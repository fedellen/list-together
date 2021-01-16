import SubHeading from './styled/SubHeading';
import MenuIcon from './svg/MenuIcon';

export default function Header({}) {
  return (
    <div className=" bg-darker border-light border-b-4">
      <div className="container mx-auto h-28 p-4  flex justify-between items-center  ">
        <SubHeading>
          List <br />
          Together
        </SubHeading>
        <MenuIcon />
      </div>
    </div>
  );
}

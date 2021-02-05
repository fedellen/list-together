import SubHeading from './styled/SubHeading';
import MenuIcon from './svg/MenuIcon';

export default function Header({}) {
  return (
    <div className="bg-gray-200  border-indigo-700 border-t-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto h- py-2 px-4  flex justify-between items-center  ">
        <SubHeading>
          List <br />
          Together
        </SubHeading>
        <MenuIcon />
      </div>
    </div>
  );
}

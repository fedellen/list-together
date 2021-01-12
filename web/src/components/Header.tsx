import MenuIcon from './svg/MenuIcon';

export default function Header({}) {
  return (
    <div className=" bg-darker border-light border-b-4">
      <div className="container mx-auto h-28 p-4  flex justify-between items-center  ">
        <div className="text-4xl font-extrabold">
          List <br />
          Together
        </div>
        <MenuIcon />
      </div>
    </div>
  );
}

import AddItemIcon from '../svg/AddItemIcon';

export default function SideMenu() {
  return (
    <div className="sticky ml-auto md:mx-auto bottom-0 flex justify-center z-10">
      <AddItemIcon />
      <AddItemIcon />
      <AddItemIcon />
    </div>
  );
}

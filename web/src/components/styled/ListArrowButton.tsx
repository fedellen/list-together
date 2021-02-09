import RightArrowIcon from '../svg/RightArrowIcon';
import LeftArrowIcon from '../svg/LeftArrowIcon';
import { ArrowIconDirection } from '../../types';

type ListArrowButtonProps = {
  handleArrowClick: (arg: ArrowIconDirection) => void;
  direction: 'right' | 'left';
};

export default function ListArrowButton({
  handleArrowClick,
  direction
}: ListArrowButtonProps) {
  return (
    <button
      className="w-5 hover-grow-blue"
      onClick={() => handleArrowClick(direction)}
    >
      {direction === 'right' ? <RightArrowIcon /> : <LeftArrowIcon />}
    </button>
  );
}
// w-5 mx-5 mb-6 md:mx-8 md:w-7

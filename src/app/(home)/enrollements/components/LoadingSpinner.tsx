import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <FontAwesomeIcon 
        icon={faSpinner} 
        className="text-3xl text-primary animate-spin" 
      />
    </div>
  );
}
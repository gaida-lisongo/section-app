import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { Cours } from '@/types/enrollement';

interface CoursListProps {
  cours: Cours[];
}

export const CoursList = ({ cours }: CoursListProps) => {
  return (
    <div className="space-y-2">
      {cours.map(course => (
        <div 
          key={course._id} 
          className="flex items-center justify-between p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faGraduationCap} className="text-primary" />
            <div>
              <p className="font-medium text-gray-900">{course.designation}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{course.code}</span>
                <span>•</span>
                <span>{course.credit} crédits</span>
                <span>•</span>
                <span>{course.semestre}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
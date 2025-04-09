"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function SearchInput({ placeholder, value, onChange }: SearchInputProps) {
  return (
    <div className="relative">
      <input
        type="text"
        className="w-full p-2 pl-10 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <FontAwesomeIcon 
        icon={faSearch} 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}
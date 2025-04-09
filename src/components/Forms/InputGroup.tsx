import { ChangeEvent, ReactNode } from 'react';

interface InputGroupProps {
  className?: string;
  type: string;
  name: string;
  label: string;
  placeholder?: string;  // Prop optionnelle
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  height?: 'sm' | 'md' | 'lg';
}

import React from 'react';
import { Category } from '../types';

interface CategoryButtonProps {
  category: Category;
  active: boolean;
  onClick: (cat: Category) => void;
  icon: string;
  color: string;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ category, active, onClick, icon, color }) => {
  const activeClasses = active 
    ? `ring-4 ring-offset-2 ${color} text-white shadow-xl transform scale-105` 
    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200";

  return (
    <button
      onClick={() => onClick(category)}
      className={`
        flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 w-full sm:w-32 h-32
        ${activeClasses}
      `}
    >
      <span className="text-3xl mb-2">{icon}</span>
      <span className="font-bold capitalize text-sm">{category}</span>
    </button>
  );
};

export default CategoryButton;

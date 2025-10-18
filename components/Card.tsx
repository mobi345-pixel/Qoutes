
import React from 'react';

interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg">
      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
        <div className="text-indigo-400">{icon}</div>
        <h3 className="text-lg font-bold text-gray-100">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

// components/ProgressBar.jsx
'use client';

const ProgressBar = ({ percentage, color = 'bg-emerald-600' }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className={`${color} h-2.5 rounded-full transition-all duration-500 ease-out`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;